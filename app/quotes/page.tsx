'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Quote {
  id: string;
  company: string;
  logo: string;
  route: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  transitDays: number;
  cutoff: string;
  containerType: string;
  rating: number;
  reviews: number;
  reliability: number;
  features: string[];
}

export default function QuotesListingPage() {
  const router = useRouter();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [filterPrice, setFilterPrice] = useState<number | null>(null);
  const [filterTransit, setFilterTransit] = useState<number | null>(null);

  const quotes: Quote[] = [
    {
      id: '1',
      company: 'Maersk',
      logo: '🚢',
      route: 'Bangkok → Rotterdam',
      origin: 'Bangkok, TH',
      destination: 'Rotterdam, NL',
      price: 2500,
      currency: 'USD',
      transitDays: 24,
      cutoff: '2026-02-15',
      containerType: 'FCL 20\'ST',
      rating: 4.8,
      reviews: 342,
      reliability: 99.2,
      features: ['Door-to-Door', 'Insurance', 'Tracking']
    },
    {
      id: '2',
      company: 'MSC',
      logo: '🚢',
      route: 'Bangkok → Rotterdam',
      origin: 'Bangkok, TH',
      destination: 'Rotterdam, NL',
      price: 2300,
      currency: 'USD',
      transitDays: 26,
      cutoff: '2026-02-14',
      containerType: 'FCL 20\'ST',
      rating: 4.6,
      reviews: 298,
      reliability: 98.8,
      features: ['Tracking', 'Clearance']
    },
    {
      id: '3',
      company: 'COSCO',
      logo: '🚢',
      route: 'Bangkok → Rotterdam',
      origin: 'Bangkok, TH',
      destination: 'Rotterdam, NL',
      price: 2200,
      currency: 'USD',
      transitDays: 28,
      cutoff: '2026-02-13',
      containerType: 'FCL 20\'ST',
      rating: 4.4,
      reviews: 256,
      reliability: 97.5,
      features: ['Competitive Rate', 'Flexible']
    },
    {
      id: '4',
      company: 'Evergreen',
      logo: '🚢',
      route: 'Bangkok → Rotterdam',
      origin: 'Bangkok, TH',
      destination: 'Rotterdam, NL',
      price: 2100,
      currency: 'USD',
      transitDays: 30,
      cutoff: '2026-02-12',
      containerType: 'FCL 20\'ST',
      rating: 4.3,
      reviews: 189,
      reliability: 96.8,
      features: ['Economy', 'Standard']
    },
    {
      id: '5',
      company: 'ONE',
      logo: '🚢',
      route: 'Bangkok → Rotterdam',
      origin: 'Bangkok, TH',
      destination: 'Rotterdam, NL',
      price: 2600,
      currency: 'USD',
      transitDays: 22,
      cutoff: '2026-02-16',
      containerType: 'FCL 20\'ST',
      rating: 4.7,
      reviews: 312,
      reliability: 99.0,
      features: ['Express', 'Priority', 'Support']
    },
    {
      id: '6',
      company: 'CMA CGM',
      logo: '🚢',
      route: 'Bangkok → Rotterdam',
      origin: 'Bangkok, TH',
      destination: 'Rotterdam, NL',
      price: 2350,
      currency: 'USD',
      transitDays: 25,
      cutoff: '2026-02-15',
      containerType: 'FCL 20\'ST',
      rating: 4.5,
      reviews: 267,
      reliability: 98.2,
      features: ['Reliable', 'Tracking', 'Insurance']
    }
  ];

  const filteredQuotes = quotes.filter(q => {
    if (filterPrice && q.price > filterPrice) return false;
    if (filterTransit && q.transitDays > filterTransit) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-4"
          >
            ← Back to Search
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Available Quotes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Bangkok, TH → Rotterdam, NL | FCL 20'ST | {filteredQuotes.length} options
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Filters</h2>

              {/* Price Filter */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Max Price
                </label>
                <div className="space-y-2">
                  {[2000, 2300, 2500, 2700].map((price) => (
                    <label key={price} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value={price}
                        onChange={() => setFilterPrice(price)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">
                        ${price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transit Time Filter */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Max Transit Days
                </label>
                <div className="space-y-2">
                  {[22, 25, 28, 30].map((days) => (
                    <label key={days} className="flex items-center">
                      <input
                        type="radio"
                        name="transit"
                        value={days}
                        onChange={() => setFilterTransit(days)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">
                        {days} days
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setFilterPrice(null);
                  setFilterTransit(null);
                }}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Quotes List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote.id)}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-6 border-2 transition-all cursor-pointer ${
                    selectedQuote === quote.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Left: Company Info */}
                    <div className="md:col-span-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">{quote.logo}</div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                            {quote.company}
                          </h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {quote.rating}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              ({quote.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="text-sm mb-3">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {quote.origin} → {quote.destination}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">
                          {quote.containerType}
                        </p>
                      </div>

                      {/* Reliability */}
                      <div className="text-xs">
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Reliability</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${quote.reliability}%` }}
                          ></div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold mt-1">
                          {quote.reliability}%
                        </p>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="md:col-span-1">
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                            Transit Time
                          </p>
                          <p className="text-slate-900 dark:text-white font-bold text-lg">
                            {quote.transitDays} days
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                            Cut-off Date
                          </p>
                          <p className="text-slate-900 dark:text-white font-semibold">
                            {new Date(quote.cutoff).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                            Features
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {quote.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Button */}
                    <div className="md:col-span-1 flex flex-col justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold mb-2">
                          Price
                        </p>
                        <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                          ${quote.price}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {quote.currency} per container
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(quote.id);
                          router.push(`/booking-step-1?quoteId=${quote.id}`);
                        }}
                        className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg"
                      >
                        Book Now
                      </button>

                      {selectedQuote === quote.id && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-2 flex items-center justify-center gap-1">
                          <span>✓</span> Selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredQuotes.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  No quotes match your filters. Try adjusting them.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
