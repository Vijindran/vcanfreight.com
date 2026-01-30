import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function BookingHeader() {
    const { currentStep, state, prevStep } = useBooking();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    // Dynamic Steps Logic
    const steps = state.bookingType === 'AIR'
        ? [
            { id: 1, label: 'Type', icon: 'category' },
            { id: 2, label: 'Details', icon: 'flight' },
            { id: 3, label: 'Quote', icon: 'receipt_long' },
            { id: 4, label: 'Review', icon: 'check_circle' },
        ]
        : state.bookingType === 'LCL'
            ? [
                { id: 1, label: 'Type', icon: 'category' },
                { id: 2, label: 'Route', icon: 'map' },
                { id: 3, label: 'Cargo', icon: 'package_2' },
                { id: 4, label: 'Quote', icon: 'receipt_long' },
                { id: 5, label: 'Review', icon: 'check_circle' },
            ]
            : [
                { id: 1, label: 'Type', icon: 'category' },
                { id: 2, label: 'Route', icon: 'map' },
                { id: 3, label: 'Equipment', icon: 'directions_boat' },
                { id: 4, label: 'Cargo', icon: 'package_2' },
                { id: 5, label: 'Quote', icon: 'receipt_long' },
                { id: 6, label: 'Review', icon: 'check_circle' },
            ];

    // Title Logic
    const getTitle = () => {
        if (state.bookingType === 'AIR') return 'Airfreight Booking';
        return 'New Booking';
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 h-14 sm:h-16 md:h-20">
                <button
                    onClick={() => {
                        if (currentStep > 1) {
                            prevStep();
                        } else {
                            // If at step 1 or generic, go home
                            window.location.href = '/';
                        }
                    }}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
                >
                    <span className="material-symbols-outlined text-[20px] sm:text-[22px] md:text-[24px]">arrow_back</span>
                </button>
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight flex-1 text-center pr-6 sm:pr-8">{getTitle()}</h1>

                {/* Theme Toggle and User Profile / Logout */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <div className="relative">
                        {user ? (
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20"
                            >
                                {user.name.charAt(0)}
                            </button>
                        ) : (
                            <div className="w-10" />
                        )}

                        {showMenu && user && (
                            <div className="absolute right-0 top-12 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-48 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Progress Stepper */}
            <div className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-white dark:bg-background-dark overflow-x-auto no-scrollbar">
                <div className="flex items-center justify-between min-w-[280px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-full">
                    {steps.map((step, index) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        const isLast = index === steps.length - 1;

                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 relative z-10 group cursor-default">
                                    <div
                                        className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isActive
                                            ? 'bg-primary shadow-lg shadow-primary/30 ring-2 sm:ring-4 ring-primary/20 scale-105 sm:scale-110'
                                            : isCompleted
                                                ? 'bg-primary'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <span className="material-symbols-outlined text-[14px] sm:text-[16px] md:text-[18px] font-bold">check</span>
                                        ) : (
                                            <span className={`text-[11px] sm:text-[12px] md:text-[14px] font-bold ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{step.id}</span>
                                        )}
                                    </div>
                                    <span className={`text-[9px] sm:text-[10px] md:text-xs font-bold transition-colors duration-300 hidden sm:block ${isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-slate-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {!isLast && (
                                    <div className="flex-1 h-[2px] mx-2 relative -top-3">
                                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        <div
                                            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
                                            style={{ width: isCompleted ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
