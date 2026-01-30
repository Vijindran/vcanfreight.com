'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Common Types
interface Dimensions { l: number; w: number; h: number; }
export type BookingType = 'FCL' | 'LCL' | 'AIR';

export type BookingState = {
    // Shared / Meta
    bookingType: BookingType;

    // FCL / LCL Fields
    origin: string;
    destination: string;
    date: string;
    equipment: Record<string, number>;
    commodity: string;
    weight: number;
    weightUnit: 'KG' | 'MT';
    volume: number;
    incoterms: string;
    hsCode: string;

    // Airfreight Specifics
    airOrigin: string;
    airDest: string;
    pieces: number;
    dims: Dimensions;
    serviceLevel: 'Standard' | 'Express';
    instructions: string;

    // Selected Quote for Payment
    selectedQuote: {
        id: string;
        carrier: string;
        price: number;
        currency: string;
        transitTime: number;
        shipmentId?: string; // Searates shipment ID for booking
    } | null;
};

type BookingContextType = {
    state: BookingState;
    updateState: (updates: Partial<BookingState>) => void;
    updateEquipment: (type: string, change: number) => void;
    updateDims: (key: keyof Dimensions, value: number) => void;
    currentStep: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canProceed: () => boolean;
    submitBooking: () => Promise<string>;
};

const defaultState: BookingState = {
    bookingType: 'FCL',

    // FCL Defaults
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    equipment: { "40' Standard": 0, "20' Standard": 0, "40' High Cube": 0 },
    commodity: '',
    weight: 0,
    weightUnit: 'MT', // Default to MT (Tons)
    volume: 0,
    incoterms: 'FOB',
    hsCode: '',

    // Air Defaults
    airOrigin: '',
    airDest: '',
    pieces: 1, // Default to 1 piece
    dims: { l: 0, w: 0, h: 0 },
    serviceLevel: 'Standard',
    instructions: '',

    // Quote Selection
    selectedQuote: null
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<BookingState>(defaultState);
    const [currentStep, setStep] = useState(1);

    const updateState = (updates: Partial<BookingState>) => {
        setState((prev) => {
            const newState = { ...prev, ...updates };

            // Reset step when booking type changes
            if (updates.bookingType && updates.bookingType !== prev.bookingType) {
                setStep(1);
            }

            // Reset relevant fields when switching booking types
            if (updates.bookingType === 'FCL' || updates.bookingType === 'LCL') {
                // Reset air-specific fields
                if (prev.bookingType === 'AIR') {
                    newState.airOrigin = '';
                    newState.airDest = '';
                    newState.pieces = 1;
                    newState.dims = { l: 0, w: 0, h: 0 };
                }
                // Set default date if empty
                if (!newState.date) {
                    newState.date = new Date().toISOString().split('T')[0];
                }
            } else if (updates.bookingType === 'AIR') {
                // Reset FCL/LCL specific fields
                if (prev.bookingType === 'FCL' || prev.bookingType === 'LCL') {
                    newState.origin = '';
                    newState.destination = '';
                    newState.equipment = { "40' Standard": 0, "20' Standard": 0, "40' High Cube": 0 };
                    newState.volume = 0;
                }
                // Set default pieces if 0
                if (newState.pieces === 0) {
                    newState.pieces = 1;
                }
            }

            return newState;
        });
    };

    const updateEquipment = (type: string, change: number) => {
        setState((prev) => {
            const currentCount = prev.equipment[type] || 0;
            const newCount = Math.max(0, currentCount + change);
            return {
                ...prev,
                equipment: { ...prev.equipment, [type]: newCount },
            };
        });
    };

    const updateDims = (key: keyof Dimensions, value: number) => {
        setState((prev) => ({
            ...prev,
            dims: { ...prev.dims, [key]: value }
        }));
    };

    // Validation Logic
    const canProceed = () => {
        // Step 1: Type Selection (Always valid as default is FCL)
        if (currentStep === 1) return true;

        if (state.bookingType === 'AIR') {
            // Air Flow logic
            // Step 2: Air Setup (Origin, Dest, Pieces, Weight)
            if (currentStep === 2) {
                return state.airOrigin.trim() !== '' &&
                    state.airDest.trim() !== '' &&
                    state.pieces > 0 &&
                    state.weight > 0;
            }
        } else {
            // FCL/LCL Flow (Shifted by 1)
            // Step 2: Route
            if (currentStep === 2) {
                return state.origin.trim() !== '' && state.destination.trim() !== '' && state.date !== '';
            }
            // Step 3: Equipment (FCL only - LCL doesn't use equipment)
            if (currentStep === 3) {
                if (state.bookingType === 'FCL') {
                    const totalContainers = Object.values(state.equipment).reduce((a, b) => a + b, 0);
                    return totalContainers > 0;
                } else {
                    // LCL: Skip equipment requirement, just need volume/weight (validated in cargo step)
                    return true;
                }
            }
            // Step 3/4: Cargo (Step 3 for LCL, Step 4 for FCL)
            if ((state.bookingType === 'LCL' && currentStep === 3) || (state.bookingType === 'FCL' && currentStep === 4)) {
                // For LCL, also require volume
                if (state.bookingType === 'LCL') {
                    return state.commodity.trim() !== '' && state.weight > 0 && state.volume > 0;
                }
                return state.commodity.trim() !== '' && state.weight > 0;
            }
            // Step 4/5: Quote Selection - Must select a quote (Step 4 for LCL, Step 5 for FCL)
            if ((state.bookingType === 'LCL' && currentStep === 4) || (state.bookingType === 'FCL' && currentStep === 5)) {
                return state.selectedQuote !== null;
            }

            // Step 5/6: Review & Compliance (Step 5 for LCL, Step 6 for FCL)
        }

        // For AIR: Step 3 is quote selection
        if (state.bookingType === 'AIR' && currentStep === 3) {
            return state.selectedQuote !== null;
        }

        return true;
    };

    const nextStep = () => {
        if (canProceed()) {
            // Max steps depend on type
            // Air: Type(1) -> Details(2) -> Quote(3) -> Review(4) = 4 steps
            // FCL: Type(1) -> Route(2) -> Equip(3) -> Cargo(4) -> Quote(5) -> Review(6) = 6 steps
            // LCL: Type(1) -> Route(2) -> Cargo(3) -> Quote(4) -> Review(5) = 5 steps
            const maxSteps = state.bookingType === 'AIR' ? 4 : state.bookingType === 'LCL' ? 5 : 6;
            if (currentStep < maxSteps) {
                setStep((prev) => prev + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const submitBooking = async (): Promise<string> => {
        try {
            // Get auth token (optional for guest bookings)
            const token = localStorage.getItem('auth_token');
            
            console.log('📤 [BOOKING CONTEXT] Submitting booking to API...', {
                bookingType: state.bookingType,
                isGuest: !token,
                hasSelectedQuote: !!state.selectedQuote,
                selectedQuoteId: state.selectedQuote?.id,
                selectedQuoteShipmentId: state.selectedQuote?.shipmentId,
                origin: state.origin || state.airOrigin,
                destination: state.destination || state.airDest,
                fullState: state
            });

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(state),
            });

            let data: any = {};
            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};
            } catch (_) {
                data = {};
            }
            console.log('📥 [BOOKING CONTEXT] API response:', {
                ok: response.ok,
                status: response.status,
                hasBookingId: !!data.bookingId,
                error: data.error,
                message: data.message,
                fullData: data
            });

            if (!response.ok) {
                const errorMsg = data.message || data.error || 'Failed to submit booking';
                console.error('❌ [Booking Context] Booking submission failed:', errorMsg);
                throw new Error(errorMsg);
            }

            // Server now always returns 200 with success/fallback, check the success field
            if (!data.success && !data.bookingId) {
                console.error('❌ [Booking Context] No success or bookingId in response:', data);
                throw new Error(data.message || 'Booking failed. Please try again or contact support.');
            }

            if (!data.bookingId) {
                console.error('❌ [Booking Context] No bookingId in response:', data);
                throw new Error('Booking was created but no booking ID was returned. Please contact support.');
            }

            return data.bookingId;
        } catch (error) {
            console.error('❌ [BOOKING CONTEXT] Submit booking error:', error);
            throw error;
        }
    };

    return (
        <BookingContext.Provider value={{ state, updateState, updateEquipment, updateDims, currentStep, setStep, nextStep, prevStep, canProceed, submitBooking }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
