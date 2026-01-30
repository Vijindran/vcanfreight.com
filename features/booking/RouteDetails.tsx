'use client';
import React from 'react';
import { useBooking } from '@/context/BookingContext';

export default function RouteDetails() {
    const { state, updateState } = useBooking();
    return (
        <section className="mt-6 px-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">map</span>
                Route Details
            </h2>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-4">
                    {/* Origin */}
                    <div className="relative group">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Origin Port</label>
                        <div className="flex items-center bg-background-light dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <span className="material-symbols-outlined text-slate-400 pl-3">flight_takeoff</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium h-12 placeholder:text-slate-400 text-slate-900 dark:text-white"
                                placeholder="e.g. Shanghai, China"
                                type="text"
                                value={state.origin}
                                onChange={(e) => updateState({ origin: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Connector (Visual) */}
                    <div className="absolute left-[29px] top-[108px] h-6 w-0.5 bg-slate-200 dark:bg-slate-700 -z-0"></div>
                    {/* Destination */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Destination Port</label>
                        <div className="flex items-center bg-background-light dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <span className="material-symbols-outlined text-slate-400 pl-3">flight_land</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium h-12 placeholder:text-slate-400 text-slate-900 dark:text-white"
                                placeholder="e.g. Los Angeles, USA"
                                type="text"
                                value={state.destination}
                                onChange={(e) => updateState({ destination: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Date */}
                    <div className="relative pt-2">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Ready to Load Date</label>
                        <div className="flex items-center bg-background-light dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <span className="material-symbols-outlined text-slate-400 pl-3">calendar_month</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium h-12 text-slate-900 dark:text-white"
                                type="date"
                                value={state.date}
                                onChange={(e) => updateState({ date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
