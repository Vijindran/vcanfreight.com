'use client';
import React, { useState } from 'react';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: 'q1',
      category: 'Shipping',
      question: 'What is the difference between FCL and LCL shipping?',
      answer: 'FCL (Full Container Load) is when you rent an entire container, while LCL (Less than Container Load) is when you share a container with other shippers. FCL is more cost-effective for large shipments, while LCL is ideal for smaller cargo.'
    },
    {
      id: 'q2',
      category: 'Shipping',
      question: 'How long does sea freight typically take?',
      answer: 'Sea freight typically takes 15-30 days depending on the route and distance. For example, US to Asia takes around 20-25 days, while US to Europe takes 10-15 days. Factors like port congestion and weather can affect delivery times.'
    },
    {
      id: 'q3',
      category: 'Shipping',
      question: 'Can I track my shipment?',
      answer: 'Yes! All shipments include real-time GPS tracking. You can monitor your cargo 24/7 through our platform with live location updates and status notifications.'
    },
    {
      id: 'q4',
      category: 'Pricing',
      question: 'How are shipping rates calculated?',
      answer: 'Shipping rates depend on several factors: cargo weight and volume, distance, container type, time of year (peak season vs off-season), and fuel surcharges. We provide transparent rate breakdowns so you see exactly what you\'re paying for.'
    },
    {
      id: 'q5',
      category: 'Pricing',
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees! Our quotes include all applicable charges. The price you see is the price you pay. We provide itemized breakdowns including base freight, fuel surcharge, port fees, and any additional services.'
    },
    {
      id: 'q6',
      category: 'Pricing',
      question: 'Do you offer volume discounts?',
      answer: 'Yes, we offer competitive volume discounts for regular and large shipments. The more you ship, the better rates you get. Contact our sales team for custom pricing on bulk shipments.'
    },
    {
      id: 'q7',
      category: 'Documentation',
      question: 'What documents do I need for international shipping?',
      answer: 'You\'ll typically need a commercial invoice, packing list, bill of lading, and relevant certificates of origin. For some products, additional documents like health certificates may be required. Our team can guide you through the documentation process.'
    },
    {
      id: 'q8',
      category: 'Documentation',
      question: 'Can you help with customs clearance?',
      answer: 'Absolutely! Our customs clearance service handles all the paperwork and coordination with customs authorities. We have experts in major ports who ensure smooth clearance and minimize delays.'
    },
    {
      id: 'q9',
      category: 'Documentation',
      question: 'Do you provide cargo insurance?',
      answer: 'Yes, we offer comprehensive cargo insurance covering loss, damage, and theft. Insurance is optional but recommended for valuable shipments. Rates typically range from 1-3% of the shipment value.'
    },
    {
      id: 'q10',
      category: 'Booking',
      question: 'How do I book a shipment?',
      answer: 'Simply use our shipping calculator to get a quote, select your preferred option, and complete the booking form. You\'ll receive a confirmation with all shipment details and tracking information within 24 hours.'
    },
    {
      id: 'q11',
      category: 'Booking',
      question: 'Can I modify my shipment after booking?',
      answer: 'Yes, shipments can be modified up to 48 hours before the vessel departs. Changes may incur additional fees depending on the nature of the modification. Contact our support team for assistance.'
    },
    {
      id: 'q12',
      category: 'Support',
      question: 'What hours is customer support available?',
      answer: 'Our customer support team is available 24/7 via phone, email, and live chat. We have offices in major shipping hubs worldwide with local language support.'
    }
  ];

  const categories = [...new Set(faqs.map(f => f.category))];
  const filteredFAQs = activeCategory
    ? faqs.filter(f => f.category === activeCategory)
    : faqs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Find answers to common questions about our shipping services, pricing, documentation, and support
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
            >
              <button
                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white text-left">
                    {faq.question}
                  </h3>
                </div>
                <div className={`text-2xl text-slate-400 dark:text-slate-500 flex-shrink-0 transition-transform ${
                  activeId === faq.id ? 'rotate-180' : ''
                }`}>
                  ⌄
                </div>
              </button>
              {activeId === faq.id && (
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Support Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-lg opacity-90 mb-8">
            Our expert support team is available 24/7 to help you with any questions or concerns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">Email Support</h3>
              <p className="text-sm opacity-90">support@vcanfreight.com</p>
              <p className="text-xs opacity-75 mt-1">Response within 1 hour</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-sm opacity-90">Available 24/7 on our website</p>
              <p className="text-xs opacity-75 mt-1">Instant support</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Phone Support</h3>
              <p className="text-sm opacity-90">+1 (800) VCAN-FREIGHT</p>
              <p className="text-xs opacity-75 mt-1">Speak to an agent</p>
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
