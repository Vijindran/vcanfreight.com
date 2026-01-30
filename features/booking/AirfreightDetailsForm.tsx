'use client';
import React from 'react';
import { useBooking, BookingType } from '@/context/BookingContext';
import HSCodeAutoSuggest from '@/components/HSCodeAutoSuggest';

export default function AirfreightDetailsForm() {
    const { state, updateState, updateDims } = useBooking();

    // Simple Volumetric Weight Calculation (1:167 ratio standard)
    // Volumetric Weight (kg) = (L x W x H in cm) / 6000 (often used) or 167 kg/cbm
    // Actually, standard air freight formula is (L x W x H cm) / 6000. 
    // Let's use the UI text "Based on 1:167 ratio". This usually implies 1 CBM = 167 KG.
    // Which is equivalent to dividing cubic cm by 6000.
    const volWeight = ((state.dims.l * state.dims.w * state.dims.h) / 6000).toFixed(2);
    const displayVolWeight = isNaN(parseFloat(volWeight)) ? '--' : volWeight;

    return (
        <div className="space-y-6 pb-24">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-[#111418] dark:text-white tracking-light text-xl font-bold leading-tight mb-4">Route Details</h2>
                <div className="flex flex-col gap-4 relative">
                    <div className="absolute left-[1.15rem] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-700 z-0"></div>

                    <div className="relative z-10 w-full">
                        <label className="flex flex-col gap-1.5 w-full">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Origin Airport</span>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-400">flight_takeoff</span>
                                <input
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-11 pr-4 h-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white"
                                    placeholder="e.g. JFK"
                                    value={state.airOrigin}
                                    onChange={(e) => updateState({ airOrigin: e.target.value })}
                                />
                            </div>
                        </label>
                    </div>

                    <div className="relative z-10 w-full">
                        <label className="flex flex-col gap-1.5 w-full">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Destination Airport</span>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-400">flight_land</span>
                                <input
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-11 pr-4 h-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white"
                                    placeholder="e.g. LHR"
                                    value={state.airDest}
                                    onChange={(e) => updateState({ airDest: e.target.value })}
                                />
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-[#111418] dark:text-white tracking-light text-xl font-bold leading-tight mb-4">Cargo Description</h2>
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Commodity / Goods</span>
                        <input
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 h-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white"
                            placeholder="e.g. Electronics, Machine Parts"
                            value={state.commodity}
                            onChange={(e) => updateState({ commodity: e.target.value })}
                        />
                    </label>
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">HS Code {state.hsCode && <span className="text-green-600 dark:text-green-400 font-bold ml-2">✓ Auto-Detected</span>}</span>
                        <div className="relative">
                            <HSCodeAutoSuggest
                                value={state.hsCode || ''}
                                onChange={(code) => updateState({ hsCode: code })}
                                commodity={state.commodity}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-[#111418] dark:text-white tracking-light text-xl font-bold leading-tight mb-4">Shipment Specs</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Pieces</span>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 h-12 focus:border-primary focus:ring-primary outline-none dark:text-white"
                                placeholder="0"
                                value={state.pieces || ''}
                                onChange={(e) => updateState({ pieces: parseInt(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">PCS</span>
                        </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Actual Weight</span>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 h-12 focus:border-primary focus:ring-primary outline-none dark:text-white"
                                placeholder="0.0"
                                value={state.weight || ''}
                                onChange={(e) => updateState({ weight: parseFloat(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">KG</span>
                        </div>
                    </label>
                </div>

                <div className="mb-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Dimensions (L x W x H)</span>
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <input
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center h-12 focus:border-primary focus:ring-primary outline-none dark:text-white"
                                placeholder="L"
                                type="number"
                                value={state.dims.l || ''}
                                onChange={(e) => updateDims('l', parseInt(e.target.value) || 0)}
                            />
                            <span className="absolute right-2 top-4 text-[10px] font-bold text-gray-400">CM</span>
                        </div>
                        <span className="text-gray-400">x</span>
                        <div className="relative flex-1">
                            <input
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center h-12 focus:border-primary focus:ring-primary outline-none dark:text-white"
                                placeholder="W"
                                type="number"
                                value={state.dims.w || ''}
                                onChange={(e) => updateDims('w', parseInt(e.target.value) || 0)}
                            />
                            <span className="absolute right-2 top-4 text-[10px] font-bold text-gray-400">CM</span>
                        </div>
                        <span className="text-gray-400">x</span>
                        <div className="relative flex-1">
                            <input
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center h-12 focus:border-primary focus:ring-primary outline-none dark:text-white"
                                placeholder="H"
                                type="number"
                                value={state.dims.h || ''}
                                onChange={(e) => updateDims('h', parseInt(e.target.value) || 0)}
                            />
                            <span className="absolute right-2 top-4 text-[10px] font-bold text-gray-400">CM</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">Volumetric Weight</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Based on 1:167 ratio</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{displayVolWeight} <span className="text-sm font-medium text-gray-500">KG</span></p>
                        <p className="text-[10px] text-gray-400 font-medium">Chargeable Weight</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-[#111418] dark:text-white tracking-light text-xl font-bold leading-tight mb-4">Service Level</h2>
                <div className="flex flex-col gap-3">
                    <div
                        onClick={() => updateState({ serviceLevel: 'Standard' })}
                        className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${state.serviceLevel === 'Standard' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined">local_shipping</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-base font-bold leading-tight dark:text-white">Standard</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-normal">Est. 3-5 days transit</p>
                            </div>
                        </div>
                        {state.serviceLevel === 'Standard' && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                <span className="material-symbols-outlined text-sm">check</span>
                            </div>
                        )}
                    </div>

                    <div
                        onClick={() => updateState({ serviceLevel: 'Express' })}
                        className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${state.serviceLevel === 'Express' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <span className="material-symbols-outlined">bolt</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-base font-bold leading-tight dark:text-white">Express</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-normal">Est. 1-2 days transit</p>
                            </div>
                        </div>
                        {state.serviceLevel === 'Express' && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                <span className="material-symbols-outlined text-sm">check</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
