'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function BookingsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-32">
            <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-12">My Bookings</h2>
                </div>
            </div>

            <main className="p-4">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold mb-2">No Bookings Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Your shipment bookings will appear here.</p>
                    <button
                        onClick={() => router.push('/booking')}
                        className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
                    >
                        Create Your First Booking
                    </button>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}