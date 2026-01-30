'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from 'react-i18next';

type Tab = 'RATES' | 'TRACKING' | 'SCHEDULES' | 'REQUEST_QUOTE';

export default function SeaRatesStyleSearch() {
    const router = useRouter();
    const { state, updateState } = useBooking();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('RATES');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [containerType, setContainerType] = useState('FCL-20ST');
    const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
    const [showDestSuggestions, setShowDestSuggestions] = useState(false);

    // Mock port/city data
    const ports = [
        { name: 'Bangkok, TH', type: 'City', icon: '📍' },
        { name: 'Bangkok Port, TH', type: 'Port', icon: '⚓' },
        { name: 'Lat Krabang, TH', type: 'Port', icon: '⚓' },
        { name: 'Laem Chabang, TH', type: 'Port', icon: '⚓' },
        { name: 'Don Muang Intl, TH', type: 'Airport', icon: '✈️' },
        { name: 'Shanghai, CN', type: 'City', icon: '📍' },
        { name: 'Hong Kong, HK', type: 'City', icon: '📍' },
        { name: 'Singapore, SG', type: 'City', icon: '📍' },
    ];

    const handleSearch = () => {
        if (origin && destination) {
            updateState({
                origin,
                destination,
                date,
                bookingType: 'FCL'
            });
            router.push('/booking');
        }
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        if (tab === 'RATES') {
            // Stay on search
        } else if (tab === 'TRACKING') {
            router.push('/tracking');
        } else if (tab === 'SCHEDULES') {
            router.push('/schedules');
        } else if (tab === 'REQUEST_QUOTE') {
            router.push('/bookings');
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            {/* Hero Section with Headline */}
            <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                        Find the best <span className="text-blue-600 dark:text-blue-400">Freight Quote</span>
                    </h1>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {[
                            { id: 'RATES', label: 'RATES' },
                            { id: 'TRACKING', label: 'TRACKING' },
                            { id: 'SCHEDULES', label: 'SCHEDULES' },
                            { id: 'REQUEST_QUOTE', label: 'REQUEST A QUOTE' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id as Tab)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Form Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                    {/* Search Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Origin */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Origin</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400">📍</span>
                                <input
                                    type="text"
                                    placeholder="City, terminal, ZIP code etc."
                                    value={origin}
                                    onChange={(e) => {
                                        setOrigin(e.target.value);
                                        setShowOriginSuggestions(true);
                                    }}
                                    onFocus={() => setShowOriginSuggestions(true)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                                {showOriginSuggestions && (
                                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg mt-1 z-10 shadow-lg">
                                        {ports.filter(p => p.name.toLowerCase().includes(origin.toLowerCase())).map((port, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setOrigin(port.name);
                                                    setShowOriginSuggestions(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 border-b border-slate-100 dark:border-slate-600 last:border-b-0 flex items-center gap-3"
                                            >
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{port.name}</span>
                                                <span className="text-xs text-slate-500 ml-auto">{port.type}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Destination</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400">📍</span>
                                <input
                                    type="text"
                                    placeholder="City, terminal, ZIP code etc."
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value);
                                        setShowDestSuggestions(true);
                                    }}
                                    onFocus={() => setShowDestSuggestions(true)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                                {showDestSuggestions && (
                                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg mt-1 z-10 shadow-lg">
                                        {ports.filter(p => p.name.toLowerCase().includes(destination.toLowerCase())).map((port, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setDestination(port.name);
                                                    setShowDestSuggestions(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 border-b border-slate-100 dark:border-slate-600 last:border-b-0 flex items-center gap-3"
                                            >
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{port.name}</span>
                                                <span className="text-xs text-slate-500 ml-auto">{port.type}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Departure Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Container Type */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Container</label>
                            <select
                                value={containerType}
                                onChange={(e) => setContainerType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            >
                                <option>FCL - 20'ST</option>
                                <option>FCL - 40'ST</option>
                                <option>FCL - 40'HC</option>
                                <option>LCL</option>
                                <option>AIR</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">search</span>
                            Search
                        </span>
                    </button>
                </div>
            </div>

            {/* Special Offers Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">Special Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { dest: 'Dammam', type: 'FCL - 40\'ST', price: 800, from: true },
                        { dest: 'Dammam', type: 'FCL - 20\'ST', price: 1155, from: true },
                        { dest: 'Melbourne', type: 'FCL - 20\'ST', price: 2392, from: true },
                        { dest: 'Mundra', type: 'FCL - 20\'ST', price: 1334, from: true }
                    ].map((offer, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer">
                            <p className="text-sm text-slate-500 mb-2">{offer.type}</p>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{offer.dest}</h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                ${offer.price}
                                {offer.from && <span className="text-xs text-slate-500 font-normal ml-1">starting from</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
