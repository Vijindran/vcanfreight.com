'use client';
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

export default function BookingFooter() {
    const { state, currentStep, nextStep, prevStep, canProceed } = useBooking();

    // Determine max steps
    // Air: 4 steps, LCL: 5 steps, FCL: 6 steps
    const maxSteps = state.bookingType === 'AIR' ? 4 : state.bookingType === 'LCL' ? 5 : 6;

    // Dynamic Summary
    const getSummary = () => {
        if (state.bookingType === 'AIR') {
            if (state.airOrigin && state.airDest) return `${state.airOrigin} -> ${state.airDest}`;
            return 'Airfreight Setup';
        }
        if (state.bookingType === 'LCL') {
            if (state.origin && state.destination) {
                const weightVol = state.weight > 0 && state.volume > 0 
                    ? ` (${state.weight} ${state.weightUnit}, ${state.volume} CBM)`
                    : '';
                return `${state.origin} -> ${state.destination}${weightVol}`;
            }
            return 'LCL Setup';
        }
        // FCL
        const selectedEquip = Object.entries(state.equipment)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => `${count}x ${type}`)
            .join(', ');
        return selectedEquip || 'No equipment selected';
    };

    // Error state for validation feedback
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { submitBooking } = useBooking();
    const router = useRouter();

    const handleContinue = async () => {
        if (canProceed()) {
            setError('');
            if (currentStep === maxSteps) {
                // Final step - initiate payment flow
                setIsSubmitting(true);
                try {
                    // Check if quote is selected
                    if (!state.selectedQuote) {
                        throw new Error('Please select a shipping quote');
                    }

                    // Require authenticated checkout to align with server-side verification
                    const token = localStorage.getItem('auth_token');
                    if (!token) {
                        setIsSubmitting(false);
                        setError('Please sign in to complete payment.');
                        router.push('/auth/login');
                        return;
                    }
                    
                    // Log booking submission start
                    console.log('🚀 [BOOKING FOOTER] Starting booking submission...', {
                        hasSelectedQuote: !!state.selectedQuote,
                        quoteId: state.selectedQuote?.id,
                        shipmentId: state.selectedQuote?.shipmentId,
                        bookingType: state.bookingType,
                        origin: state.origin || state.airOrigin,
                        destination: state.destination || state.airDest,
                        isGuest: !token
                    });
                    console.log('🔍 [BOOKING FOOTER] Full booking state:', JSON.stringify(state, null, 2));

                    // First, create the booking to get booking ID
                    const bookingId = await submitBooking();
                    console.log('✅ [BOOKING FOOTER] Booking created successfully:', bookingId);

                    // Then create Stripe checkout session for payment
                    console.log('💳 [BOOKING FOOTER] Creating Stripe checkout session...', {
                        bookingId,
                        amount: state.selectedQuote.price,
                        currency: state.selectedQuote.currency
                    });
                    
                    const paymentResponse = await fetch('/api/stripe/booking-checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            amount: state.selectedQuote.price,
                            currency: state.selectedQuote.currency,
                            bookingId: bookingId,
                            description: `${state.selectedQuote.carrier} - ${state.bookingType} Shipping`
                        })
                    });

                    const paymentData = await paymentResponse.json() as any;
                    console.log('📊 [BOOKING FOOTER] Payment response:', {
                        ok: paymentResponse.ok,
                        status: paymentResponse.status,
                        hasUrl: !!paymentData.url,
                        error: paymentData.error,
                        fullResponse: paymentData
                    });

                    if (!paymentResponse.ok) {
                        const errorMsg = paymentData.message || paymentData.error || 'Failed to initiate payment';
                        console.error('❌ [Payment] Payment failed:', errorMsg);
                        throw new Error(errorMsg);
                    }

                    // Redirect to Stripe Checkout
                    if (paymentData.url) {
                        console.log('✅ [Payment] Redirecting to Stripe Checkout:', paymentData.url);
                        window.location.href = paymentData.url;
                    } else {
                        throw new Error('Payment URL not received');
                    }
                } catch (err: any) {
                    setIsSubmitting(false);
                    const errorMessage = err.message || 'Failed to process booking';
                    console.error('❌ [BOOKING FOOTER] Error in booking flow:', {
                        error: errorMessage,
                        stack: err.stack,
                        fullError: err
                    });
                    setError(errorMessage);
                    setTimeout(() => setError(''), 10000); // Show error for 10 seconds
                }
            } else {
                nextStep();
            }
        } else {
            // Provide specific error message based on current step
            let errorMsg = 'Please complete required fields.';

            // Quote selection step: Step 4 for LCL, Step 5 for FCL, Step 3 for AIR
            if (state.bookingType === 'LCL' && currentStep === 4) {
                errorMsg = 'Please select a shipping quote to continue.';
            } else if (state.bookingType === 'FCL' && currentStep === 5) {
                errorMsg = 'Please select a shipping quote to continue.';
            } else if (state.bookingType === 'AIR' && currentStep === 3) {
                errorMsg = 'Please select a shipping quote to continue.';
            }

            setError(errorMsg);
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 md:p-6 pb-4 sm:pb-6 md:pb-8 z-40 transition-all duration-300">
            {error && (
                <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg animate-bounce">
                    {error}
                </div>
            )}
            <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Summary</p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">
                        {currentStep === maxSteps ? 'Ready to Submit' : getSummary()}
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs sm:text-sm md:text-base"
                        >
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleContinue}
                        disabled={isSubmitting}
                        className={`bg-primary hover:bg-blue-700 text-white px-5 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                Processing...
                            </>
                        ) : currentStep === maxSteps ? 'Confirm Booking' : 'Continue'}
                        {!isSubmitting && <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:text-[20px]">arrow_forward</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
