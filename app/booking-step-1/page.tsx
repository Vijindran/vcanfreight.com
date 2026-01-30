'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import Link from 'next/link';

interface ContactDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
}

export default function BookingStep1() {
  const router = useRouter();
  const { state, updateState } = useBooking();
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: ''
  });

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    updateState({
      origin: state.origin || 'Felixstowe, GB',
      destination: state.destination || 'Bangkok, TH'
    });
    router.push('/booking-step-2');
  };

  // Sample quote data
  const selectedQuote = {
    id: '4466379',
    carrier: 'CMA CGM',
    origin: state.origin || 'Felixstowe, GB',
    destination: state.destination || 'Bangkok, TH',
    price: 3025,
    currency: 'USD',
    containerType: "FCL 20'ST",
    readyToLoad: '09 Feb, 2026',
    validity: 'Validity 04 Feb-2026 - 28 Mar 2026'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">V</div>
            <span className="font-bold text-slate-900 dark:text-white">VCANFreight</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700"></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/quotes" className="text-blue-600 hover:underline">← Back</Link>
          <span className="text-slate-500">/</span>
          <span className="text-slate-600 dark:text-slate-400">Booking on the Quote ID {selectedQuote.id}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Shipping details</h2>

              {/* Route Info */}
              <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Departure</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedQuote.origin}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-2xl mt-2">arrow_forward</span>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Arrival</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedQuote.destination}</p>
                  </div>
                </div>

                {/* Route Details */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">ROUTE INFORMATION</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    City Felixstowe,GB → Port Rotterdam,NL → City Bangkok,TH
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">SHIPPING TYPE</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📦</span> {selectedQuote.containerType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">QUANTITY</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">1</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">READY TO LOAD</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedQuote.readyToLoad}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">BASE VALIDITY</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">28 Mar, 2026</p>
                </div>
              </div>

              {/* Carrier Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">SELECTED CARRIER</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚢</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedQuote.carrier}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Quote ID: {selectedQuote.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Terms / Additional charges</h3>
                
                <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>Door-to-Door rate</strong></p>
                  <p>Subject to:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                    <li>CMS surcharge where applicable</li>
                    <li>HACSG Surcharge where applicable</li>
                    <li>Currency surcharges</li>
                    <li>Equipment availability</li>
                    <li>Trucking availability</li>
                    <li>Any other unforeseen or additional charges</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <strong>Standard freetime in origin and destination on storage/surge/deration and electricity plugging (for reefers).</strong> Standard truck downtime according to local trucking company terms.
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All rates are subject to general Terms & Conditions
                </p>
              </div>
            </div>

            {/* Decarbonization Section */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 flex items-start gap-4">
              <span className="text-3xl">✨</span>
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">Contribute to global decarbonization</h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">Help the industry switching to the greener delivery technologies.</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all whitespace-nowrap">
                + USD 14
              </button>
            </div>

            {/* Contact Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Contact Details</h3>
              
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-6">
                You can edit your profile details <a href="#" className="underline">here</a>
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">First Name</label>
                  <input
                    type="text"
                    value={contactDetails.firstName}
                    onChange={(e) => handleContactChange('firstName', e.target.value)}
                    placeholder="Virendran"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Last Name</label>
                  <input
                    type="text"
                    value={contactDetails.lastName}
                    onChange={(e) => handleContactChange('lastName', e.target.value)}
                    placeholder="Raisurudam"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactDetails.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+971505877502"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">E-mail</label>
                  <input
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="vcsn.cargoservices.com"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Company</label>
                <input
                  type="text"
                  value={contactDetails.company}
                  onChange={(e) => handleContactChange('company', e.target.value)}
                  placeholder="VCAN resources limited"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                By submitting a form, you agree with our <a href="#" className="text-blue-600 dark:text-blue-400 underline">Terms & conditions</a>.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Link href="/quotes" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-2">
                ← Previous Page
              </Link>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Next step
              </button>
            </div>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 sticky top-8 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order summary</h3>

              {/* Route */}
              <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Departure</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedQuote.origin}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Arrival</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedQuote.destination}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 py-6 border-b border-slate-200 dark:border-slate-700 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Transport mode</span>
                  <span className="font-bold text-slate-900 dark:text-white">Sea, FCL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Ready to load</span>
                  <span className="font-bold text-slate-900 dark:text-white">09 Feb, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Base validity</span>
                  <span className="font-bold text-slate-900 dark:text-white">28 Mar, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Carrier</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedQuote.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Container Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">1 x 20'ST</span>
                </div>
              </div>

              {/* Price */}
              <div className="py-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Price of loading</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 1196</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Port of origin</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 1400</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Ocean freight</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 250</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Port of destination</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 600</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-600 dark:text-slate-400">Place of discharge</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 313</span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="py-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  />
                  <button className="px-4 py-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
                    Apply
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="py-6 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Total amount</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  ~ {selectedQuote.currency} {selectedQuote.price.toLocaleString()}
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6">
                By clicking "Book now", you agree to our <a href="#" className="text-blue-600 dark:text-blue-400 underline">Terms & conditions</a>
              </p>

              {/* reCAPTCHA */}
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700/50 mb-4 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-semibold mb-2">reCAPTCHA</p>
                <p>This site is protected by reCAPTCHA and the Google <a href="#" className="text-blue-600 underline">Privacy Policy</a> and <a href="#" className="text-blue-600 underline">Terms of Service</a> apply.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Logistics Explorer</a></li>
                <li><a href="#" className="hover:text-white">Container Tracking</a></li>
                <li><a href="#" className="hover:text-white">Air Tracking</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Opportunities</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">For Shippers</a></li>
                <li><a href="#" className="hover:text-white">For Carriers</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Find Freight Routes</a></li>
                <li><a href="#" className="hover:text-white">Shipping Directory</a></li>
                <li><a href="#" className="hover:text-white">Maritime</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Terms of service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Copyright</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Contact us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2026 VCANFreight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
