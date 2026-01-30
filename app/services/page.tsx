'use client';
import React from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
}

export default function ServicesPage() {
  const services: Service[] = [
    {
      id: 'fcl',
      title: 'FCL Shipping',
      description: 'Full Container Load - Ideal for large volume shipments',
      icon: '📦',
      features: [
        'Dedicated container',
        'Cost-effective for large volumes',
        '20\' and 40\' containers',
        'Flexible scheduling',
        'Dedicated support',
        'Real-time tracking'
      ],
      price: 'From $1,200'
    },
    {
      id: 'lcl',
      title: 'LCL Shipping',
      description: 'Less than Container Load - Perfect for smaller shipments',
      icon: '🚚',
      features: [
        'Consolidated shipments',
        'Cost-efficient rates',
        'Flexible space',
        'Multiple departures',
        'Inventory tracking',
        'Door-to-door service'
      ],
      price: 'From $300'
    },
    {
      id: 'air',
      title: 'Air Freight',
      description: 'Fast international shipping for time-sensitive cargo',
      icon: '✈️',
      features: [
        'Fastest delivery',
        'Reliable service',
        'Worldwide coverage',
        'Secure handling',
        'Customs clearance',
        'Insurance included'
      ],
      price: 'From $5/kg'
    },
    {
      id: 'customs',
      title: 'Customs Clearance',
      description: 'Expert assistance with import/export documentation',
      icon: '📋',
      features: [
        'Expert consultation',
        'Document preparation',
        'Regulatory compliance',
        'Fast clearance',
        'Duty optimization',
        'Multi-country support'
      ],
      price: 'From $100'
    },
    {
      id: 'warehousing',
      title: 'Warehousing',
      description: 'Secure storage and inventory management solutions',
      icon: '🏢',
      features: [
        'Climate controlled',
        'Inventory tracking',
        'Cross-docking',
        'Pick & pack',
        'Quality control',
        '24/7 monitoring'
      ],
      price: 'From $0.50/sqft'
    },
    {
      id: 'insurance',
      title: 'Cargo Insurance',
      description: 'Comprehensive protection for your valuable shipments',
      icon: '🛡️',
      features: [
        'Full coverage',
        'Competitive rates',
        'Quick claims',
        'All cargo types',
        'Global coverage',
        'Flexible terms'
      ],
      price: 'From 1% value'
    }
  ];

  const additionalServices = [
    {
      title: 'Temperature Control',
      desc: 'Refrigerated containers for perishable goods',
      icon: '❄️'
    },
    {
      title: 'Hazmat Handling',
      desc: 'Safe transport of dangerous goods',
      icon: '⚠️'
    },
    {
      title: 'White Glove Service',
      desc: 'Premium handling and setup at destination',
      icon: '⭐'
    },
    {
      title: 'Project Cargo',
      desc: 'Specialized handling for oversized equipment',
      icon: '🏗️'
    },
    {
      title: 'Door-to-Door',
      desc: 'Complete pickup and delivery service',
      icon: '🚪'
    },
    {
      title: 'Express Shipping',
      desc: 'Priority handling and fastest routes',
      icon: '⚡'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Comprehensive shipping solutions tailored to your freight needs
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all"
            >
              {/* Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

              <div className="p-8">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">✓</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {service.price}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all text-sm">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Additional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Get Quote',
                desc: 'Submit your cargo details and get instant rate quotes from multiple carriers'
              },
              {
                step: '2',
                title: 'Book Shipment',
                desc: 'Choose your preferred option and book your shipment in minutes'
              },
              {
                step: '3',
                title: 'Real-time Tracking',
                desc: 'Monitor your shipment with live GPS tracking and status updates'
              },
              {
                step: '4',
                title: 'Delivery',
                desc: 'Receive your cargo safely at the destination with full documentation'
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Service Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-4 font-bold text-slate-900 dark:text-white">Feature</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-900 dark:text-white">FCL</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-900 dark:text-white">LCL</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-900 dark:text-white">Air Freight</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Speed', fcl: '15-30 days', lcl: '15-30 days', air: '2-5 days' },
                  { feature: 'Cost', fcl: '$$$', lcl: '$$', air: '$$$$$' },
                  { feature: 'Capacity', fcl: '20-40 CBM', lcl: '1-10 CBM', air: 'Flexible' },
                  { feature: 'Reliability', fcl: '99.5%', lcl: '99%', air: '99.8%' },
                  { feature: 'Insurance', fcl: 'Available', lcl: 'Available', air: 'Included' },
                  { feature: 'Tracking', fcl: '24/7', lcl: '24/7', air: '24/7' }
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <td className="text-left px-4 py-4 font-semibold text-slate-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="text-center px-4 py-4 text-slate-600 dark:text-slate-400">
                      {row.fcl}
                    </td>
                    <td className="text-center px-4 py-4 text-slate-600 dark:text-slate-400">
                      {row.lcl}
                    </td>
                    <td className="text-center px-4 py-4 text-slate-600 dark:text-slate-400">
                      {row.air}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Ship?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Get instant quotes and book your shipment today. Our team is here to help with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
