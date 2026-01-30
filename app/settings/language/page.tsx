'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LanguageSettingsPage() {
    const router = useRouter();
    const [selectedLang, setSelectedLang] = useState('auto');

    const languages = [
        { id: 'en-US', label: 'English (US)', subLabel: '', flag: '🇺🇸' },
        { id: 'en-UK', label: 'English (UK)', subLabel: '', flag: '🇬🇧' },
        { id: 'es', label: 'Español', subLabel: 'Spanish', flag: '🇪🇸' },
        { id: 'fr', label: 'Français', subLabel: 'French', flag: '🇫🇷' },
        { id: 'de', label: 'Deutsch', subLabel: 'German', flag: '🇩🇪' },
        { id: 'zh', label: '中文 (简体)', subLabel: 'Chinese, Simplified', flag: '🇨🇳' },
        { id: 'ja', label: '日本語', subLabel: 'Japanese', flag: '🇯🇵' },
        { id: 'ar', label: 'العربية', subLabel: 'Arabic', flag: '🇸🇦' },
    ];

    const handleSelect = (id: string) => {
        setSelectedLang(id);
        // Simulate a delay and restart or just go back
        // setTimeout(() => router.back(), 500);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-10">
            {/* TopAppBar */}
            <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => router.back()}
                    className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                </button>
                <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Language</h2>
            </header>

            <div className="w-full max-w-md mx-auto">
                {/* SearchBar */}
                <div className="px-4 py-4 sticky top-[60px] z-10 bg-background-light dark:bg-background-dark">
                    <label className="flex flex-col w-full">
                        <div className="relative flex w-full items-center rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">search</span>
                            </div>
                            <input
                                className="block w-full rounded-xl border-none bg-transparent py-3 pl-10 pr-4 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:ring-inset"
                                placeholder="Search languages"
                                type="text"
                            />
                        </div>
                    </label>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 flex flex-col px-4 pb-8">
                    {/* Section: System Default */}
                    <div className="mb-6">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider px-2 pb-2 mt-2">System Default</h3>
                        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <button
                                onClick={() => handleSelect('auto')}
                                className="flex items-center gap-4 px-4 py-4 w-full text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xl">
                                    ⚙️
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="text-base font-medium leading-normal text-slate-900 dark:text-white">Automatic</p>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Follows system settings</span>
                                </div>
                                {/* Selected State Checkmark */}
                                {selectedLang === 'auto' && (
                                    <div className="shrink-0 text-primary">
                                        <span className="material-symbols-outlined">check</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Section: All Languages */}
                    <div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider px-2 pb-2">All Languages</h3>
                        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => handleSelect(lang.id)}
                                    className="flex items-center gap-4 px-4 py-4 w-full text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center text-3xl">
                                        {lang.flag}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className="text-base font-medium leading-normal text-slate-900 dark:text-white">{lang.label}</p>
                                        {lang.subLabel && (
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{lang.subLabel}</span>
                                        )}
                                    </div>
                                    {selectedLang === lang.id && (
                                        <div className="shrink-0 text-primary">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 px-4">
                        <p className="text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                            Changing the language will restart the application to apply settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
