'use client';
import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import OrderSummary from '@/components/OrderSummary';

export default function SeaRatesBookingDetails() {
    const { state, updateState } = useBooking();
    const [cargoDetails, setCargoDetails] = useState({
        product: 'Mineral Products',
        weight: 25,
        weightUnit: 'mt',
        containers: 1,
        cargoType: ['hazardous'],
        additionalInfo: 'Scrap metal'
    });

    const [services, setServices] = useState({
        insurance: false,
        customsClearance: false,
        certification: false,
        inspectionServices: false
    });

    const handleServiceToggle = (service: keyof typeof services) => {
        setServices(prev => ({
            ...prev,
            [service]: !prev[service]
        }));
    };

    const handleBookNow = () => {
        updateState({
            weight: cargoDetails.weight,
            weightUnit: cargoDetails.weightUnit as 'KG' | 'MT',
            commodity: cargoDetails.product
        });
        // Proceed to payment
        window.location.href = '/subscription';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-sm">
                    <a href="/booking" className="text-blue-600 hover:underline">← Back</a>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-600 dark:text-slate-400">Booking on the Quote ID 4466379</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Details */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Shipping details</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    Step 1 of 3
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Shipping details • Cargo details & associated services • Confirm booking</p>
                            </div>

                            {/* Route Visualization */}
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">DEPARTURE</p>
                                        <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{state.origin || 'Felixstowe, GB'}</p>
                                    </div>
                                    <div className="flex-1 mx-4 relative h-12 flex items-center">
                                        <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                                        <span className="material-symbols-outlined text-blue-600 text-2xl absolute right-0">arrow_forward</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">ARRIVAL</p>
                                        <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{state.destination || 'Bangkok, TH'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">TRANSPORT MODE</p>
                                    <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">Sea, FCL</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">READY TO LOAD</p>
                                    <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">09 Feb, 2026</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">CONTAINER TYPE</p>
                                    <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">1 x 20'ST</p>
                                </div>
                            </div>
                        </div>

                        {/* Cargo Details */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                Cargo details
                            </h2>

                            {/* Product Section */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wide">PRODUCT</h3>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm text-blue-600">inventory_2</span>
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white">{cargoDetails.product}</span>
                                    </div>
                                    <span className="text-slate-400 cursor-pointer hover:text-slate-600">✕</span>
                                </div>
                            </div>

                            {/* Weight & Containers */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wide">WEIGHT (25 CONTAINERS)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        value={cargoDetails.weight}
                                        className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        onChange={(e) => setCargoDetails({...cargoDetails, weight: parseInt(e.target.value)})}
                                    />
                                    <select className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                        <option>mt</option>
                                        <option>kg</option>
                                        <option>lbs</option>
                                    </select>
                                </div>
                            </div>

                            {/* Cargo Flags */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wide">CARGO FLAGS</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'Hazardous cargo', icon: '⚠️' },
                                        { label: 'Perishable cargo', icon: '❄️' },
                                        { label: 'Oversized cargo', icon: '📦' },
                                        { label: 'Liquid cargo', icon: '💧' }
                                    ].map((flag, i) => (
                                        <button
                                            key={i}
                                            className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                        >
                                            {flag.icon} {flag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wide">ADDITIONAL INFORMATION</h3>
                                <textarea
                                    value={cargoDetails.additionalInfo}
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    rows={3}
                                    onChange={(e) => setCargoDetails({...cargoDetails, additionalInfo: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Associated Services */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                Associated services
                            </h2>

                            <div className="space-y-4">
                                {[
                                    { id: 'insurance', label: 'Insurance', icon: '🛡️' },
                                    { id: 'customsClearance', label: 'Customs Clearance', icon: '📋' },
                                    { id: 'certification', label: 'Certification', icon: '✅' },
                                    { id: 'inspectionServices', label: 'Inspection services', icon: '🔍' }
                                ].map((service) => (
                                    <label
                                        key={service.id}
                                        className="flex items-center p-4 border-2 border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={services[service.id as keyof typeof services]}
                                            onChange={() => handleServiceToggle(service.id as keyof typeof services)}
                                            className="w-5 h-5 rounded accent-blue-600"
                                        />
                                        <span className="ml-3 text-lg">{service.icon}</span>
                                        <span className="ml-3 font-semibold text-slate-900 dark:text-white">{service.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 pb-8">
                            <button className="flex-1 px-6 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                ← Previous Page
                            </button>
                            <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg">
                                Continue →
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar - Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary onBookNow={handleBookNow} />
                    </div>
                </div>
            </div>
        </div>
    );
}
