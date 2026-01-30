'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import RouteDetails from '@/features/booking/RouteDetails';
import EquipmentSelection from '@/features/booking/EquipmentSelection';
import CargoDetails from '@/features/booking/CargoDetails';
import ReviewDetails from '@/features/booking/ReviewDetails';
import BookingTypeSelection from '@/features/booking/BookingTypeSelection';
import AirfreightDetailsForm from '@/features/booking/AirfreightDetailsForm';
import QuoteSelection from '@/features/booking/QuoteSelection';
import ComplianceCheck from '@/features/booking/ComplianceCheck';

export default function BookingWizard() {
    const { currentStep, state } = useBooking();

    return (
        <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-32 sm:pb-40 md:pb-48 pt-4 sm:pt-6 md:pt-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 20 }}
                >
                    {/* Step 1: Type Selection (Common) */}
                    {currentStep === 1 && (
                        <BookingTypeSelection />
                    )}

                    {/* FCL/LCL Branch */}
                    {state.bookingType !== 'AIR' && (
                        <>
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Route Details</h2>
                                    <p className="text-sm text-slate-500 mb-6">Where is your cargo going?</p>
                                    <RouteDetails />
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Equipment</h2>
                                    <p className="text-sm text-slate-500 mb-6">Select container types and quantities.</p>
                                    <EquipmentSelection />
                                </div>
                            )}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cargo Details</h2>
                                    <p className="text-sm text-slate-500 mb-6">Describe your shipment.</p>
                                    <CargoDetails />
                                </div>
                            )}
                            {currentStep === 5 && (
                                <QuoteSelection />
                            )}
                            {currentStep === 6 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review & Compliance</h2>
                                    <ReviewDetails />
                                    <ComplianceCheck />
                                </div>
                            )}
                        </>
                    )}

                    {/* Airfreight Branch */}
                    {state.bookingType === 'AIR' && (
                        <>
                            {currentStep === 2 && (
                                <AirfreightDetailsForm />
                            )}
                            {currentStep === 3 && (
                                <QuoteSelection />
                            )}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review Air Booking</h2>
                                    <ReviewDetails />
                                    <ComplianceCheck />
                                </div>
                            )}
                        </>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
