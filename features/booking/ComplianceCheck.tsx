'use client';
import React from 'react';

export default function ComplianceCheck() {
    return (
        <div className="space-y-6 pb-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">policy</span>
                Compliance & Duties
            </h2>

            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                {/* HS Code Check */}
                <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">HS Code Verified</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Commodity matched with harmonized standards.</p>
                    </div>
                </div>

                {/* Restricted Party Screening */}
                <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sanctions Check Passed</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Origin and destination are clear for trade.</p>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

                {/* Duty Estimator */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Estimated Duties & Taxes</h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500">Import Duty (Est.)</p>
                            <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">$124.50</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">VAT / GST</p>
                            <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">$210.00</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                        *Estimates based on provided cargo value and recent tariff data. Final clearing amount may vary.
                    </p>
                </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <input type="checkbox" className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" id="terms" />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    I acknowledge that I am responsible for ensuring accurate cargo declarations. <span className="font-bold text-primary">View Terms</span>.
                </label>
            </div>
        </div>
    );
}
