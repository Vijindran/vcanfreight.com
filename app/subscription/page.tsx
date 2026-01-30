'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    priceId?: string; // Stripe price ID
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        period: 'forever',
        description: 'Basic access to freight rates',
        features: [
            'Access to cached freight rates',
            'Basic booking functionality',
            'Email support',
            'Up to 5 quotes per month',
        ],
    },
    {
        id: 'monthly',
        name: 'Monthly',
        price: 9.99,
        currency: 'USD',
        period: 'month',
        description: 'Real-time LIFE rates - billed monthly',
        features: [
            'Real-time LIFE rates from 15+ carriers',
            'Unlimited quotes',
            'Priority booking',
            'Phone & email support',
            'Cancel anytime',
        ],
        priceId: 'monthly',
    },
    {
        id: 'yearly',
        name: 'Yearly',
        price: 99,
        currency: 'USD',
        period: 'year',
        description: 'Best value - save $20.88/year!',
        features: [
            'Everything in Monthly plan',
            'Real-time LIFE rates from 15+ carriers',
            'Unlimited quotes',
            'Priority booking',
            'Dedicated account manager',
            'API access for integrations',
            '2 months FREE (save 17%)',
        ],
        popular: true,
        priceId: 'yearly',
    },
];

export default function SubscriptionPage() {
    const router = useRouter();
    const { user, isGuest } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async (plan: PricingPlan) => {
        if (plan.id === 'free') {
            router.push('/booking');
            return;
        }

        if (!user || isGuest) {
            router.push('/auth/login?redirect=/subscription');
            return;
        }

        setLoading(plan.id);
        setError(null);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    planId: plan.id, // 'monthly' or 'yearly'
                }),
            });

            const data = await response.json() as any;

            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                setError(data.error + (data.message ? `: ${data.message}` : ''));
            } else {
                setError('Unable to start checkout. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to payment system. Please try again.');
            console.error('Checkout error:', err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-6xl mx-auto">
                {/* Top App Bar */}
                <div className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">Subscription Plans</h2>
                    <div className="flex size-10 shrink-0 items-center justify-center">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Hero Section */}
                <div className="text-center py-12 px-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Get access to real-time freight rates from major carriers worldwide. 
                        Save time and money with accurate, up-to-date pricing.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-12">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl border-2 p-6 transition-all ${
                                plan.popular
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-xl shadow-primary/20'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                                        ${plan.price}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        /{plan.period}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-green-500 text-[18px] mt-0.5">
                                            check_circle
                                        </span>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={loading === plan.id}
                                className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${
                                    plan.popular
                                        ? 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/30'
                                        : plan.id === 'free'
                                        ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                                        : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
                                } ${loading === plan.id ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                {loading === plan.id ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                                        Processing...
                                    </span>
                                ) : plan.id === 'free' ? (
                                    'Get Started Free'
                                ) : (
                                    `Subscribe to ${plan.name}`
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mx-4 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-center">
                        {error}
                    </div>
                )}

                {/* FAQ Section */}
                <div className="px-4 pb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                                What are LIFE rates?
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                LIFE rates are real-time freight rates directly from carriers like Maersk, MSC, CMA CGM, and more. 
                                They're updated daily and reflect current market prices.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                                Can I cancel anytime?
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Yes! Premium subscriptions can be canceled at any time. You'll continue to have access until the end of your billing period.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                                What payment methods do you accept?
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment system.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="px-4 pb-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        Need a custom plan for your business?{' '}
                        <a href="mailto:vg@vcanresources.com" className="text-primary font-semibold hover:underline">
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

