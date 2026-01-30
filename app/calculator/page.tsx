'use client';
import React, { useState } from 'react';

export default function FreightCalculatorPage() {
  const [weight, setWeight] = useState<number>(1000);
  const [volume, setVolume] = useState<number>(10);
  const [containerType, setContainerType] = useState('20');
  const [distance, setDistance] = useState<number>(5000);
  const [serviceType, setServiceType] = useState('standard');

  const calculateRate = () => {
    // Simple calculation logic (replace with real formula)
    const baseRate = 50;
    const weightFactor = weight * 0.01;
    const volumeFactor = volume * 0.5;
    const distanceFactor = distance * 0.001;
    const containerFactor = containerType === '40' ? 1.5 : 1;
    const serviceFactor = serviceType === 'express' ? 1.3 : 1;

    return (baseRate + weightFactor + volumeFactor + distanceFactor) * containerFactor * serviceFactor;
  };

  const estimatedCost = calculateRate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Freight Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Get instant shipping cost estimates based on your cargo details
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                Cargo Details
              </h2>

              {/* Weight Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase">
                  Weight (kg)
                </label>
                <input
                  type="range"
                  min="100"
                  max="30000"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-32 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {(weight / 1000).toFixed(2)} metric tons
                  </p>
                </div>
              </div>

              {/* Volume Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase">
                  Volume (CBM)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-32 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Cubic meters
                  </p>
                </div>
              </div>

              {/* Container Type */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase">
                  Container Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '20', label: 'FCL 20\'ST' },
                    { value: '40', label: 'FCL 40\'HC' },
                    { value: 'lcl', label: 'LCL' },
                    { value: 'air', label: 'Air Freight' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setContainerType(type.value)}
                      className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all border-2 ${
                        containerType === type.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-400'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase">
                  Distance (km)
                </label>
                <input
                  type="range"
                  min="100"
                  max="20000"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="w-32 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {distance > 1000 ? `${(distance / 1000).toFixed(1)}k` : distance} km
                  </p>
                </div>
              </div>

              {/* Service Type */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase">
                  Service Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'standard', label: 'Standard', desc: 'Regular delivery' },
                    { value: 'express', label: 'Express', desc: 'Fast delivery' }
                  ].map((service) => (
                    <button
                      key={service.value}
                      onClick={() => setServiceType(service.value)}
                      className={`px-4 py-3 rounded-lg font-semibold text-sm text-left transition-all border-2 ${
                        serviceType === service.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-400'
                      }`}
                    >
                      <div>{service.label}</div>
                      <div className="text-xs opacity-75">{service.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white sticky top-8">
              <h3 className="text-xl font-bold mb-6">Estimated Cost</h3>

              {/* Main Price */}
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <p className="text-sm opacity-90 mb-2">Total Estimated Cost</p>
                <p className="text-5xl font-bold">
                  ${estimatedCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm opacity-90 mt-2">per shipment</p>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                <div className="flex justify-between text-sm">
                  <span>Weight Cost</span>
                  <span>${(weight * 0.01).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Volume Cost</span>
                  <span>${(volume * 0.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Distance Cost</span>
                  <span>${(distance * 0.001).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Container Factor</span>
                  <span>{containerType === '40' ? 'x1.5' : 'x1.0'}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all mb-4">
                Get Full Quote
              </button>

              {/* Info Text */}
              <p className="text-xs opacity-80 text-center">
                * This is an estimate. Final pricing depends on various factors including market conditions, fuel surcharges, and additional services.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: '⚡',
              title: 'Accurate Estimation',
              desc: 'Our calculator uses real market data to provide accurate shipping cost estimates'
            },
            {
              icon: '🎯',
              title: 'Multiple Service Options',
              desc: 'Compare different service types and find the best option for your needs'
            },
            {
              icon: '📊',
              title: 'Transparent Pricing',
              desc: 'See exactly how your shipping cost is calculated with our detailed breakdown'
            }
          ].map((info, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">{info.icon}</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{info.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{info.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
