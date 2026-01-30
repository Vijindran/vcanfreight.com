'use client';
import React from 'react';
import { useBooking } from '@/context/BookingContext';

export default function ReviewDetails() {
    const { state } = useBooking();

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">map</span> Route Details
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Origin</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{state.origin}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Destination</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{state.destination}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Ready Date</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{state.date}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">directions_boat</span> Equipment
                </h3>
                <div className="space-y-2">
                    {Object.entries(state.equipment).map(([type, count]) => (
                        count > 0 && (
                            <div key={type} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{type}</span>
                                <span className="text-xs font-bold bg-white dark:bg-slate-700 px-2 py-1 rounded text-primary border border-slate-200 dark:border-slate-600">x{count}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">package_2</span> Cargo & Terms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Commodity</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{state.commodity}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Incoterms</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{state.incoterms}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Total Weight</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{state.weight} {state.weightUnit}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Total Volume</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{state.volume} cbm</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
