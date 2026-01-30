'use client';
import React, { useEffect, useState } from 'react';
import { useBooking } from '@/context/BookingContext';

type RateOption = {
    id: string;
    carrier: string;
    price: number;
    currency: string;
    transitTime: number;
    cutoff: string;
    requiresSubscription?: boolean;
    isEstimate?: boolean;
};

export default function QuoteSelection() {
    const { state, updateState } = useBooking();
    const [rates, setRates] = useState<RateOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRates() {
            if (!state.origin || !state.destination) return;

            setLoading(true);
            try {
                // Determine origin/dest based on type
                const origin = state.bookingType === 'AIR' ? state.airOrigin : state.origin;
                const dest = state.bookingType === 'AIR' ? state.airDest : state.destination;

                const token = localStorage.getItem('auth_token');
                const response = await fetch(`/api/rates?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                let data: any = {};
                try {
                    const text = await response.text();
                    data = text ? JSON.parse(text) : {};
                } catch (_) {
                    data = {};
                }

                if (response.ok && data.rates) {
                    setRates(data.rates);
                } else {
                    // Fallback mock if API fails or returns empty
                    setRates([
                        { id: 'r1', carrier: 'Maersk', price: 1250, currency: 'USD', transitTime: 24, cutoff: '2025-12-30' },
                        { id: 'r2', carrier: 'MSC', price: 1100, currency: 'USD', transitTime: 28, cutoff: '2025-12-31' },
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch rates:', error);
                // Fallback mock
                setRates([
                    { id: 'r1', carrier: 'Maersk', price: 1250, currency: 'USD', transitTime: 24, cutoff: '2025-12-30' },
                    { id: 'r2', carrier: 'MSC', price: 1100, currency: 'USD', transitTime: 28, cutoff: '2025-12-31' },
                ]);
            } finally {
                setLoading(false);
            }
        }

        fetchRates();
    }, [state.origin, state.destination, state.airOrigin, state.airDest, state.bookingType]);

    const handleSelect = (id: string) => {
        setSelectedRateId(id);

        // Find and save the selected rate to context for payment
        const selectedRate = rates.find(r => r.id === id);
        if (selectedRate) {
            updateState({
                selectedQuote: {
                    id: selectedRate.id,
                    carrier: selectedRate.carrier,
                    price: selectedRate.price,
                    currency: selectedRate.currency,
                    transitTime: selectedRate.transitTime
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-slate-500 font-medium">Finding best rates...</p>
                <p className="text-xs text-slate-400">Checking 15+ carriers including Maersk, MSC, COSCO</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">currency_exchange</span>
                Select Quote
            </h2>

            {/* Selection Notice */}
            {rates.some(r => r.requiresSubscription || r.isEstimate) ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px] mt-0.5">warning</span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 italic">Showing Estimated Rates</p>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                These are baseline estimates. To unlock <strong>real-time SeaRates API pricing</strong> and direct carrier booking, please upgrade your plan.
                            </p>
                            <div className="mt-3">
                                <a
                                    href="/subscription"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                    Upgrade to Pro
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] mt-0.5">info</span>
                        <div>
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Select a shipping quote to continue</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                Click on a rate below to select it. You'll proceed to payment after review.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {rates.map((rate) => (
                    <div
                        key={rate.id}
                        onClick={() => handleSelect(rate.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${selectedRateId === rate.id ? 'border-primary bg-blue-50 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                                    {rate.carrier[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{rate.carrier}</h4>
                                        {rate.isEstimate && (
                                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase tracking-wider">Estimate</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">Direct Service</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">${rate.price}</span>
                                <span className="text-xs font-bold text-slate-500 uppercase">{rate.currency}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="text-xs text-slate-400 mb-0.5">Transit Time</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    {rate.transitTime} Days
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-0.5">Cut-off</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{rate.cutoff}</p>
                            </div>
                        </div>

                        {selectedRateId === rate.id && (
                            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-primary animate-in fade-in slide-in-from-top-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Selected
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
