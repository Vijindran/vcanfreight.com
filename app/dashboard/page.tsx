'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import MobileHeaderMenu from '@/components/MobileHeaderMenu';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function DashboardPage() {
    const { user, isGuest, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const [showSuccess, setShowSuccess] = useState(false);

    // Log dashboard state
    useEffect(() => {
        console.log('[Dashboard] State updated:', { isLoading, hasUser: !!user, isGuest });
    }, [user, isGuest, isLoading]);

    useEffect(() => {
        // Handle token from OAuth callback - redirect to booking instead
        const token = searchParams.get('token');
        if (token && typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            // Redirect to booking page instead
            router.replace('/booking');
            // Reload to update auth state
            window.location.reload();
        }

        // Allow guest access - only redirect if not guest and not logged in
        if (!isLoading && !user && !isGuest) {
            router.push('/auth/login');
        }
        if (searchParams.get('booking_created')) {
            setShowSuccess(true);
            // Clear param after showing
            router.replace('/dashboard');
        }
    }, [user, isLoading, router, searchParams]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Show guest or logged in user
    const displayUser = user || { name: 'Guest', email: '' };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white pb-32">
            {/* Success Toast / Modal */}
            {showSuccess && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <span className="material-symbols-outlined">check</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">{t('success.bookingCreated')}</h4>
                            <p className="text-xs text-green-100">{t('success.bookingProcessing')}</p>
                        </div>
                        <button onClick={() => setShowSuccess(false)} className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101822]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <MobileHeaderMenu />
                        {/* Desktop Profile */}
                        <div className="hidden md:block relative">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-100 dark:border-slate-700"
                                style={{ backgroundImage: 'url("/images/profile-avatar.jpg")' }}
                            ></div>
                            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-[#101822] rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">VCANFreight</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <ThemeToggle />
                        <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[24px]">notifications</span>
                            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#101822]"></span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 pt-2 sm:pt-4 md:pt-6">
                {/* Headline Greeting */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-900 dark:text-white">{t('dashboard.goodMorning')}, {displayUser.name.split(' ')[0]}</h2>
                    <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1 sm:mt-2">{t('dashboard.whatsHappening')}</p>
                </div>

                {/* Action Panel (Alert) */}
                <div className="px-4 mb-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-100 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 p-4 shadow-sm">
                        <div className="flex gap-3">
                            <div className="mt-0.5 text-amber-600 dark:text-amber-500 shrink-0">
                                <span className="material-symbols-outlined text-[24px]">warning</span>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight">{t('dashboard.actionRequired')}</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal mt-1">{t('dashboard.shipmentsRequireReview')}</p>
                            </div>
                        </div>
                        <a className="group flex items-center gap-1 text-sm font-bold text-amber-700 dark:text-amber-500 hover:underline shrink-0 pl-9 sm:pl-0" href="#">
                            {t('dashboard.reviewNow')}
                            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </a>
                    </div>
                </div>

                {/* KPI Stats (Responsive Grid) */}
                <div className="w-full pb-2 px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {/* Active */}
                        <div className="group flex flex-col justify-between gap-2 rounded-xl p-4 sm:p-5 md:p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer card-hover">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit text-primary group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-[24px]">directions_boat</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">{t('dashboard.active')}</p>
                                <p className="text-slate-900 dark:text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">12</p>
                            </div>
                        </div>
                        {/* Pending Quotes */}
                        <div className="group flex flex-col justify-between gap-2 rounded-xl p-4 sm:p-5 md:p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700/50 transition-all duration-300 cursor-pointer card-hover">
                            <div className="p-2 sm:p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg w-fit text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-[20px] sm:text-[24px] md:text-[28px]">request_quote</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">{t('dashboard.quotes')}</p>
                                <p className="text-slate-900 dark:text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">5</p>
                            </div>
                        </div>
                        {/* Delivered */}
                        <div className="group flex flex-col justify-between gap-2 rounded-xl p-4 sm:p-5 md:p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-green-200 dark:hover:border-green-700/50 transition-all duration-300 cursor-pointer card-hover">
                            <div className="p-2 sm:p-2.5 bg-green-50 dark:bg-green-900/30 rounded-lg w-fit text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-[20px] sm:text-[24px] md:text-[28px]">inventory_2</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">{t('dashboard.delivered')}</p>
                                <p className="text-slate-900 dark:text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">45</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6">
                    <h3 className="text-slate-900 dark:text-white text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 px-1">{t('dashboard.quickActions')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        <Link href="/booking" className="group flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 rounded-xl bg-primary text-white p-3 sm:p-4 md:p-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300 hover:bg-blue-600 card-hover">
                            <span className="material-symbols-outlined text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] group-hover:scale-110 transition-transform">add_circle</span>
                            <span className="text-xs sm:text-sm md:text-base font-bold text-center leading-tight">{t('dashboard.newBooking')}</span>
                        </Link>
                        <Link href="/schedules" className="group flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary/30 card-hover">
                            <span className="material-symbols-outlined text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-primary group-hover:scale-110 transition-transform">schedule</span>
                            <span className="text-xs sm:text-sm md:text-base font-bold text-center leading-tight">{t('navigation.schedules', 'Schedules')}</span>
                        </Link>
                        <Link href="/schedules" className="group flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary/30 card-hover">
                            <span className="material-symbols-outlined text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-primary group-hover:scale-110 transition-transform">location_searching</span>
                            <span className="text-xs sm:text-sm md:text-base font-bold text-center leading-tight">{t('dashboard.trackShipment')}</span>
                        </Link>
                        <Link href="/booking" className="group flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary/30 card-hover">
                            <span className="material-symbols-outlined text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-primary group-hover:scale-110 transition-transform">currency_exchange</span>
                            <span className="text-xs sm:text-sm md:text-base font-bold text-center leading-tight">{t('dashboard.getQuote')}</span>
                        </Link>
                    </div>
                </div>

                {/* Active Shipments List */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
                    <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 px-1">
                        <h3 className="text-slate-900 dark:text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{t('dashboard.activeShipments')}</h3>
                        <a className="text-primary text-xs sm:text-sm md:text-base font-bold hover:underline" href="#">{t('dashboard.viewAll')}</a>
                    </div>
                    <div className="space-y-3">
                        {/* Card 1 */}
                        <div className="group bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/20 relative overflow-hidden transition-all duration-300 cursor-pointer card-hover">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">directions_boat</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">VCAN-88291</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">FCL • Electronics</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 group-hover:scale-105 transition-transform">
                                    {t('dashboard.onTime')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
                                <div className="text-left">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Shanghai</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">CNSHA</p>
                                    <p className="text-xs text-slate-400 mt-1">Oct 24</p>
                                </div>
                                <div className="flex-1 flex flex-col items-center px-2">
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full relative overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full bg-primary w-2/3 rounded-full group-hover:w-3/4 transition-all duration-500"></div>
                                    </div>
                                    <p className="text-[10px] text-primary font-bold mt-2">{t('dashboard.arrivingIn')} 2 {t('dashboard.days')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Los Angeles</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">USLAX</p>
                                    <p className="text-xs text-slate-400 mt-1">Nov 12</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Quotes */}
                <div className="px-4 pb-8">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-3 px-1">{t('dashboard.recentQuotes')}</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Mumbai ➔ Dubai</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">FCL 20ft Standard • Expires in 24h</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-lg font-extrabold text-slate-900 dark:text-white">$1,250</span>
                                <Link className="text-xs font-bold text-primary hover:underline" href="/booking">{t('dashboard.bookNow')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
