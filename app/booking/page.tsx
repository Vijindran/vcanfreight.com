'use client';
import BookingHeader from "@/components/BookingHeader";
import BookingFooter from "@/components/BookingFooter";
import BookingWizard from "@/components/BookingWizard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingPage() {
    const { user, isGuest, isLoading } = useAuth();
    const router = useRouter();

    // Allow guest access - only redirect if not guest and not logged in
    useEffect(() => {
        if (!isLoading && !user && !isGuest) {
            router.push('/auth/login');
        }
    }, [user, isGuest, isLoading, router]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 sm:pb-24 md:pb-32 lg:pb-0">
            <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <BookingHeader />
                <BookingWizard />
                <BookingFooter />
            </div>
        </main>
    );
}
