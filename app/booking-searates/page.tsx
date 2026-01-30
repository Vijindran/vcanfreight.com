'use client';
import SeaRatesBookingDetails from "@/components/SeaRatesBookingDetails";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SeaRatesBookingPage() {
    const { user, isGuest, isLoading } = useAuth();
    const router = useRouter();

    // Allow guest access
    useEffect(() => {
        if (!isLoading && !user && !isGuest) {
            router.push('/auth/login');
        }
    }, [user, isGuest, isLoading, router]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <SeaRatesBookingDetails />
        </main>
    );
}
