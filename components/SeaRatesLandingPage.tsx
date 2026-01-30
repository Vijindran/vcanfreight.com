'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SeaRatesStyleSearch from '@/components/SeaRatesStyleSearch';

export default function SeaRatesLandingPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    return (
        <div className="w-full min-h-screen bg-white dark:bg-slate-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">V</div>
                        <span className="font-bold text-slate-900 dark:text-white">VCANFreight</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/services" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Services</Link>
                        <Link href="/calculator" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Calculator</Link>
                        <Link href="/integrations" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Integrations</Link>
                        <Link href="/quotes" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Quotes</Link>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero & Search Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 pt-12 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        Find the best <span className="text-blue-600">Freight Quote</span>
                    </h1>

                    {/* Search Form */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Origin</label>
                                <input id="search-origin" type="text" placeholder="City or Port" className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Destination</label>
                                <input id="search-destination" type="text" placeholder="City or Port" className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Date</label>
                                <input id="search-date" type="date" className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Container</label>
                                <select id="search-container" className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                    <option>FCL 20'ST</option>
                                    <option>FCL 40'ST</option>
                                    <option>LCL</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={() => {
                            const origin = (document.getElementById('search-origin') as unknown as HTMLInputElement)?.value;
                            const destination = (document.getElementById('search-destination') as unknown as HTMLInputElement)?.value;
                            const date = (document.getElementById('search-date') as unknown as HTMLInputElement)?.value;
                            const container = (document.getElementById('search-container') as unknown as HTMLSelectElement)?.value;
                            router.push(`/quotes?origin=${origin}&destination=${destination}&date=${date}&container=${container}`);
                        }} className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
                            Search Quotes
                        </button>
                    </div>

                    {/* Quote Offers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { route: 'Dammam', type: 'FCL 40\'ST', price: 800, img: '🚢' },
                            { route: 'Singapore', type: 'FCL 20\'ST', price: 1155, img: '🚢' },
                            { route: 'Melbourne', type: 'FCL 20\'ST', price: 2392, img: '🚢' },
                            { route: 'Hong Kong', type: 'FCL 20\'ST', price: 1334, img: '🚢' }
                        ].map((offer, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer">
                                <div className="text-3xl mb-4">{offer.img}</div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{offer.type}</p>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{offer.route}</h3>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    ${offer.price}
                                    <span className="text-xs text-slate-500 font-normal ml-1">starting from</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 24/7 Support Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                24/7 all time <span className="text-blue-600">support</span>
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                                Our expert team is available round the clock to assist you with any shipping inquiries, rate quotes, or booking issues. We're here to make your freight experience seamless.
                            </p>
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
                                Contact Support
                            </button>
                        </div>
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white">
                            <div className="text-6xl mb-4">👩‍💼</div>
                            <h3 className="text-2xl font-bold mb-2">Sarah Johnson</h3>
                            <p className="text-blue-100">Logistics Specialist</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Shipments Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        Active shipments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { status: 'In Transit', from: 'Shanghai', to: 'Rotterdam', date: 'Jan 25, 2026', progress: 65 },
                            { status: 'At Port', from: 'Bangkok', to: 'Singapore', date: 'Jan 28, 2026', progress: 45 },
                            { status: 'Delivered', from: 'Los Angeles', to: 'Dubai', date: 'Jan 30, 2026', progress: 100 }
                        ].map((shipment, i) => (
                            <div key={i} className="bg-white dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                                        {shipment.status}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{shipment.date}</span>
                                </div>
                                <p className="text-slate-900 dark:text-white font-bold mb-1">
                                    {shipment.from} → {shipment.to}
                                </p>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-4">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${shipment.progress}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{shipment.progress}% Complete</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: '🚀', title: 'Shipping & Logistics', desc: 'Competitive rates for all shipping modes worldwide' },
                            { icon: '📦', title: 'Track & Control', desc: 'Real-time tracking for all your shipments' },
                            { icon: '🛡️', title: 'Cargo Insurance', desc: 'Protect your shipments with comprehensive coverage' }
                        ].map((service, i) => (
                            <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        Your benefits with VCANFreight
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: '✓', title: 'Best Rates', desc: 'Get the most competitive shipping rates' },
                            { icon: '✓', title: 'Fast Booking', desc: 'Book shipments in minutes, not hours' },
                            { icon: '✓', title: '24/7 Support', desc: 'Always here to help with any questions' },
                            { icon: '✓', title: 'Global Network', desc: 'Access ports and terminals worldwide' }
                        ].map((benefit, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile App Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6">
                                    Be even faster with our mobile app
                                </h2>
                                <p className="text-blue-100 mb-8">
                                    Get instant access to rates, tracking, and booking on the go. Available on iOS and Android.
                                </p>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all">
                                        App Store
                                    </button>
                                    <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all">
                                        Play Store
                                    </button>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-6xl">📱</div>
                                <p className="text-blue-200 mt-4">Scan QR code to download</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrations Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        Integrations
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['Salesforce', 'Shopify', 'SAP', 'Oracle', 'NetSuite', 'QuickBooks', 'Xero', 'Zoho'].map((name, i) => (
                            <div key={i} className="bg-white dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🔗</div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                        Combine everything in one place
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                        Manage your entire freight operations from a single platform. Get quotes, book shipments, track cargo, and more.
                    </p>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-lg">
                        Get Started Free
                    </button>
                </div>
            </section>

            {/* News Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        News & Updates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'New Routes Added', date: 'Jan 28, 2026', img: '📰' },
                            { title: 'API Integration Guide', date: 'Jan 25, 2026', img: '📰' },
                            { title: 'Q1 2026 Outlook', date: 'Jan 20, 2026', img: '📰' }
                        ].map((article, i) => (
                            <div key={i} className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all cursor-pointer">
                                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40 flex items-center justify-center text-6xl">
                                    {article.img}
                                </div>
                                <div className="p-6">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{article.date}</p>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{article.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">V</div>
                                <span className="font-bold">VCANFreight</span>
                            </div>
                            <p className="text-slate-400 text-sm">Your trusted freight shipping partner worldwide.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><Link href="/services" className="hover:text-white">Services</Link></li>
                                <li><Link href="/calculator" className="hover:text-white">Calculator</Link></li>
                                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><Link href="/quotes" className="hover:text-white">Get Quotes</Link></li>
                                <li><a href="#" className="hover:text-white">Documentation</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8">
                        <p className="text-slate-400 text-sm text-center">
                            © 2026 VCANFreight. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
