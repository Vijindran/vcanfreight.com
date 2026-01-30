'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';

export default function MorePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const supportPhone = '+1 (251) 316-6847';
    const supportEmail = 'vg@vcanresources.com';
    const emergencyPhone = '+44 7476 991927';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-20 sm:pb-24 md:pb-32 lg:pb-0">
            <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                {/* Top Bar */}
                <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#1c293a] px-4 sm:px-6 md:px-8 py-3 sm:py-4 justify-between border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-900 dark:text-white flex size-10 sm:size-12 shrink-0 items-center justify-start cursor-pointer transition-opacity hover:opacity-70"
                    >
                        <span className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight flex-1 text-center pr-8 sm:pr-10">Account</h2>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-8 sm:pb-12 md:pb-16">
                    {/* Profile Header */}
                    <div className="flex p-4 sm:p-6 md:p-8 flex-col items-center bg-white dark:bg-[#1c293a] mb-4 sm:mb-6 md:mb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex w-full flex-col gap-3 items-center relative">
                        <div className="relative group">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 ring-4 ring-slate-100 dark:ring-slate-800 shadow-md"
                                style={{ backgroundImage: 'url("/images/profile-avatar.jpg")' }}
                            ></div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-slate-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight text-center">{user?.name || 'Guest User'}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base font-medium leading-normal text-center mt-1">Logistics Manager | VCANFreight</p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 max-w-lg sm:max-w-2xl md:max-w-4xl mx-auto">

                    {/* General Section */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <h3 className="px-2 text-xs sm:text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">General</h3>
                        <div className="bg-white dark:bg-[#1c293a] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            <button className="w-full flex items-center justify-between p-3 sm:p-4 md:p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
                                        <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">person</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-sm sm:text-base md:text-lg font-semibold">Profile Management</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Edit details, password & company info</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform text-lg sm:text-xl md:text-2xl">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined text-xl">credit_card</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">Payment Methods</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Manage cards & billing info</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>
                            <Link href="/subscription" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">Subscription Plans</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Upgrade for real-time LIFE rates</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </Link>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferences</h3>
                        <div className="bg-white dark:bg-[#1c293a] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined text-xl">notifications_active</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">Notifications</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Push, Email & SMS alerts</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>

                            {/* Language Button (Navigates to Settings) */}
                            <Link href="/settings/language" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                        <span className="material-symbols-outlined text-xl">language</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">Language</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">English (US)</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </Link>
                        </div>
                    </div>

                    {/* Support & Contact Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Support & Contact</h3>
                        <div className="bg-white dark:bg-[#1c293a] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            <a href={`tel:${supportPhone.replace(/\s/g, '')}`} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined text-xl">phone</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">{t('settings.supportPhone', 'Support Phone')}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{supportPhone}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </a>
                            <a href={`tel:${emergencyPhone.replace(/\s/g, '')}`} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined text-xl">emergency</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">{t('settings.emergencyPhone', 'Emergency Line')}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{emergencyPhone}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </a>
                            <a href={`mailto:${supportEmail}`} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-xl">email</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-slate-900 dark:text-white text-base font-semibold">{t('settings.supportEmail', 'Support Email')}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{supportEmail}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </a>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined text-xl">headset_mic</span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white text-base font-semibold">{t('settings.help')}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Information Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Information</h3>
                        <div className="bg-white dark:bg-[#1c293a] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-xl">gavel</span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white text-base font-semibold">{t('settings.terms', 'Terms & Privacy Policy')}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 pb-8">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center p-4 text-red-600 dark:text-red-400 font-bold text-base bg-white dark:bg-[#1c293a] border border-red-100 dark:border-red-900/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined mr-2">logout</span>
                            Log Out
                        </button>
                        <div className="flex justify-center mt-6">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">VCANFreight App v2.4.1</p>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
