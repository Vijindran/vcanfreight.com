'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import Link from 'next/link';

export default function BookingStep2() {
  const router = useRouter();
  const { state, updateState } = useBooking();
  const [cargoDetails, setCargoDetails] = useState({
    product: '',
    hsCode: '',
    weight: '',
    weightUnit: 'mt',
    additionalInfo: ''
  });

  const [selectedServices, setSelectedServices] = useState({
    insurance: false,
    customsClearance: false,
    certification: false,
    inspectionServices: false
  });

  const services = [
    { id: 'insurance', label: 'Insurance', icon: '🛡️' },
    { id: 'customsClearance', label: 'Customs clearance', icon: '📋' },
    { id: 'certification', label: 'Certification', icon: '✓' },
    { id: 'inspectionServices', label: 'Inspection services', icon: '🔍' }
  ];

  const handleCargoChange = (field: string, value: string) => {
    setCargoDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId as keyof typeof selectedServices]
    }));
  };

  const handleNext = () => {
    updateState({
      commodity: cargoDetails.product,
      weight: parseFloat(cargoDetails.weight) || 0,
      weightUnit: cargoDetails.weightUnit as 'KG' | 'MT',
      hsCode: cargoDetails.hsCode,
      instructions: cargoDetails.additionalInfo
    });
    router.push('/booking-confirmation');
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
          <Link href="/booking-step-1" className="text-blue-600 hover:underline">← Back</Link>
          <span className="text-slate-500">/</span>
          <span className="text-slate-600 dark:text-slate-400">Booking on the Quote ID 4466379</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Shipping details</span>
                </div>
                <div className="h-1 flex-1 mx-4 bg-blue-600"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Cargo details</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cargo details & associated services</p>
            </div>

            {/* Cargo Details Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Cargo details</h2>

              {/* Product */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">
                  Product <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-xl">search</span>
                  <input
                    type="text"
                    value={cargoDetails.product}
                    onChange={(e) => handleCargoChange('product', e.target.value)}
                    placeholder="Enter commodity type or HS code"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">
                  Weight (per container) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={cargoDetails.weight}
                    onChange={(e) => handleCargoChange('weight', e.target.value)}
                    placeholder="Enter weight"
                    className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                  <select
                    value={cargoDetails.weightUnit}
                    onChange={(e) => handleCargoChange('weightUnit', e.target.value)}
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="mt">MT</option>
                    <option value="kg">KG</option>
                    <option value="lb">LB</option>
                  </select>
                </div>
              </div>

              {/* HS Code */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">
                  HS Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cargoDetails.hsCode}
                  onChange={(e) => handleCargoChange('hsCode', e.target.value)}
                  placeholder="e.g., 2520.10.00"
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Additional Information */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">
                  Additional information
                </label>
                <textarea
                  value={cargoDetails.additionalInfo}
                  onChange={(e) => handleCargoChange('additionalInfo', e.target.value)}
                  placeholder="Write a message..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Associated Services Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Associated services</h2>

              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedServices[service.id as keyof typeof selectedServices]
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400'
                    }`}
                  >
                    <span className="text-2xl">{service.icon}</span>
                    <span className={`font-semibold ${
                      selectedServices[service.id as keyof typeof selectedServices]
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {service.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Link href="/booking-step-1" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-2">
                ← Previous Page
              </Link>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Book now
              </button>
            </div>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 sticky top-8 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order summary</h3>

              {/* Route */}
              <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-700 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Departure</p>
                  <p className="font-bold text-slate-900 dark:text-white">Felixstowe, GB</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Arrival</p>
                  <p className="font-bold text-slate-900 dark:text-white">Bangkok, TH</p>
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
                  <span className="text-slate-600 dark:text-slate-400">Carrier</span>
                  <span className="font-bold text-slate-900 dark:text-white">CMA CGM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Container Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">1 x 20'ST</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-2 py-6 border-b border-slate-200 dark:border-slate-700 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Price of loading</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 1196</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Port of origin</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 1400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Ocean freight</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Port of destination</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Place of discharge</span>
                  <span className="font-bold text-slate-900 dark:text-white">USD 313</span>
                </div>
              </div>

              {/* Total */}
              <div className="py-6 text-center border-b border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Total amount</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  ~ USD 3025
                </p>
              </div>

              {/* Selected Services */}
              {Object.values(selectedServices).some(v => v) && (
                <div className="py-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">Selected services</p>
                  <div className="space-y-2">
                    {services.map((service) => (
                      selectedServices[service.id as keyof typeof selectedServices] && (
                        <div key={service.id} className="flex items-center gap-2">
                          <span>{service.icon}</span>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{service.label}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
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
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Opportunities</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">For Shippers</a></li>
                <li><a href="#" className="hover:text-white">For Carriers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Find Freight Routes</a></li>
                <li><a href="#" className="hover:text-white">Maritime</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Terms of service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Contact us</a></li>
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
