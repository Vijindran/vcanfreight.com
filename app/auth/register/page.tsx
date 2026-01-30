'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function RegisterPage() {
    const { register, loginAsGuest, isLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(name, email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4 sm:p-6 md:p-8 relative">
            {/* Theme Toggle - Fixed Position */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
                <ThemeToggle />
            </div>
            <div className="relative flex w-full flex-col overflow-hidden bg-white dark:bg-background-dark shadow-2xl sm:max-w-[440px] md:max-w-[500px] lg:max-w-[540px] sm:rounded-2xl border border-slate-200 dark:border-slate-800">
                {/* Header Image Section */}
                <div className="relative h-[160px] sm:h-[180px] md:h-[200px] w-full shrink-0">
                    <div
                        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: 'url("/images/auth-hero.jpg")' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-white dark:to-background-dark mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-background-dark via-transparent to-transparent"></div>
                    </div>
                    <div className="absolute top-8 left-0 right-0 flex justify-center">
                        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                            <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
                            <span className="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">VCANFreight</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col px-6 sm:px-8 md:px-10 relative z-10 -mt-6 sm:-mt-8 md:-mt-10">
                    <div className="mb-5 sm:mb-6 md:mb-8 text-center">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Join us to start shipping globally.</p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8 border border-slate-200 dark:border-slate-700">
                        <Link
                            href="/auth/login"
                            className="flex-1 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-center flex items-center justify-center"
                        >
                            Log In
                        </Link>
                        <button className="flex-1 py-2.5 rounded-lg bg-white dark:bg-slate-600 shadow-sm text-primary dark:text-blue-400 text-sm font-bold transition-all border border-slate-200 dark:border-slate-500">
                            Register
                        </button>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-900 dark:text-slate-300 ml-1" htmlFor="fullname">Full Name</label>
                            <div className="relative group">
                                <input
                                    className="w-full h-[48px] sm:h-[50px] md:h-[52px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-10 sm:px-11 md:px-12 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all group-hover:border-slate-300 dark:group-hover:border-slate-600"
                                    id="fullname"
                                    name="name"
                                    placeholder="John Doe"
                                    type="text"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400/60 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-900 dark:text-slate-300 ml-1" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <input
                                    className="w-full h-[48px] sm:h-[50px] md:h-[52px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-10 sm:px-11 md:px-12 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all group-hover:border-slate-300 dark:group-hover:border-slate-600"
                                    id="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    type="email"
                                    autoComplete="username email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400/60 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-900 dark:text-slate-300 ml-1" htmlFor="password">Password</label>
                            <div className="relative group">
                                <input
                                    className="w-full h-[48px] sm:h-[50px] md:h-[52px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-10 sm:px-11 md:px-12 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all group-hover:border-slate-300 dark:group-hover:border-slate-600"
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400/60 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                                <button className="absolute right-0 top-0 bottom-0 px-3 text-slate-400/60 hover:text-primary transition-colors flex items-center" type="button">
                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                            </div>
                        </div>

                        <button
                            className="group w-full h-[48px] sm:h-[50px] md:h-[52px] mt-2 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Continue as Guest Button */}
                    <div className="mt-4">
                        <button
                            onClick={loginAsGuest}
                            className="w-full h-[46px] border-2 border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[20px]">person_off</span>
                            Continue as Guest
                        </button>
                    </div>

                    <div className="mt-6 pb-6 text-center">
                        <p className="text-[11px] leading-relaxed text-slate-500">
                            By registering, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> & <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
