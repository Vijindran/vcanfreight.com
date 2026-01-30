'use client';
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import HSCodeAutoSuggest from '@/components/HSCodeAutoSuggest';

export default function CargoDetails() {
    const { state, updateState } = useBooking();

    return (
        <section className="mt-8 px-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">package_2</span>
                Cargo Details
            </h2>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                {/* Commodity */}
                <label className="block">
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Commodity / Goods</span>
                    <input
                        className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary text-sm h-12 placeholder:text-slate-400 text-slate-900 dark:text-white"
                        placeholder="e.g. Electronics, Furniture"
                        type="text"
                        value={state.commodity}
                        onChange={(e) => updateState({ commodity: e.target.value })}
                    />
                </label>

                {/* HS Code Auto-Suggest */}
                <div className="block">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">
                        HS Code (Auto-Generated)
                    </label>
                    <HSCodeAutoSuggest
                        value={state.hsCode || ''}
                        onChange={(code) => updateState({ hsCode: code })}
                        commodity={state.commodity}
                    />
                </div>
                <div className="flex gap-4">
                    {/* Weight */}
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Total Weight</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input
                                className="form-input block w-full min-w-0 rounded-l-lg border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary sm:text-sm h-12 text-slate-900 dark:text-white"
                                placeholder="0"
                                type="number"
                                value={state.weight || ''}
                                onChange={(e) => updateState({ weight: parseFloat(e.target.value) || 0 })}
                            />
                            <select
                                className="inline-flex items-center px-2 rounded-r-lg border border-l-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm font-medium focus:ring-primary focus:border-primary py-0 pl-3 pr-7"
                                value={state.weightUnit || 'MT'}
                                onChange={(e) => updateState({ weightUnit: e.target.value as 'KG' | 'MT' })}
                            >
                                <option value="MT">MT</option>
                                <option value="KG">KG</option>
                            </select>
                        </div>
                    </div>
                    {/* Volume */}
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Total Volume</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input
                                className="form-input block w-full min-w-0 rounded-l-lg border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary sm:text-sm h-12 text-slate-900 dark:text-white"
                                placeholder="0"
                                type="number"
                                value={state.volume || ''}
                                onChange={(e) => updateState({ volume: parseFloat(e.target.value) || 0 })}
                            />
                            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 sm:text-sm font-medium">
                                CBM
                            </span>
                        </div>
                    </div>
                </div>
                {/* Incoterms */}
                <label className="block">
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Incoterms</span>
                    <div className="relative">
                        <select
                            className="form-select block w-full rounded-lg bg-background-light dark:bg-background-dark border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary text-sm h-12 text-slate-900 dark:text-white appearance-none pr-10"
                            value={state.incoterms}
                            onChange={(e) => updateState({ incoterms: e.target.value })}
                        >
                            <option value="FOB">FOB - Free On Board</option>
                            <option value="CIF">CIF - Cost, Insurance & Freight</option>
                            <option value="EXW">EXW - Ex Works</option>
                            <option value="DAP">DAP - Delivered at Place</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                            <span className="material-symbols-outlined text-lg">expand_more</span>
                        </div>
                    </div>
                </label>
            </div>
        </section>
    );
}
