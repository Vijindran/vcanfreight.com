'use client';
import React from 'react';
import { useBooking } from '@/context/BookingContext';

interface OrderSummaryProps {
    onBookNow?: () => void;
}

export default function OrderSummary({ onBookNow }: OrderSummaryProps) {
    const { state } = useBooking();

    const calculateTotalPrice = () => {
        let total = 0;
        if (state.selectedQuote) {
            total += state.selectedQuote.price || 0;
        }
        return total;
    };

    const totalPrice = calculateTotalPrice();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-lg sticky top-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-6">Order summary</h3>

            {/* Route Information */}
            <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">DEPARTURE</p>
                        <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">{state.origin || 'Not selected'}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-xl">arrow_forward</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">ARRIVAL</p>
                    <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">{state.destination || 'Not selected'}</p>
                </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-3 py-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">TRANSPORT MODE</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Sea, FCL</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">READY TO LOAD</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{state.date || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">BASE VALIDITY</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">28 Mar, 2026</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">CARRIER</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{state.selectedQuote?.carrier || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">CONTAINER TYPE</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">1 x 20'ST</span>
                </div>
            </div>

            {/* Price Details */}
            <div className="space-y-2 py-6 border-b border-slate-200 dark:border-slate-700">
                {state.selectedQuote && (
                    <>
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">Place of Loading</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">USD {state.selectedQuote.price || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">Port of Origin</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">USD 0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">Ocean Freight</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">USD 0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">Port of Destination</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">USD 800</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">Place Of Discharge</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">USD 20</span>
                        </div>
                    </>
                )}
            </div>

            {/* Total Price */}
            <div className="py-6 space-y-3">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Price</span>
                    <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        ~ USD {totalPrice || '3025'}
                    </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    By clicking "Book now" you agree to our <a href="#" className="text-blue-600 hover:underline">Terms & conditions</a>
                </p>
            </div>

            {/* Book Now Button */}
            <button
                onClick={onBookNow}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 text-center"
            >
                Book now
            </button>

            {/* reCAPTCHA Notice */}
            <div className="mt-4 flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    This site is protected by reCAPTCHA and the Google <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> apply.
                </p>
            </div>
        </div>
    );
}
