'use client';
import React, { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  status: 'integrated' | 'coming-soon';
  features: string[];
}

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'CRM',
      description: 'Sync shipments and customer data with Salesforce',
      logo: '☁️',
      status: 'integrated',
      features: ['Order sync', 'Customer data', 'Real-time updates']
    },
    {
      id: 'shopify',
      name: 'Shopify',
      category: 'E-commerce',
      description: 'Seamlessly integrate shipping into your Shopify store',
      logo: '🛍️',
      status: 'integrated',
      features: ['Order import', 'Tracking widget', 'Rates API']
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      category: 'Accounting',
      description: 'Sync invoices and shipping costs with QuickBooks',
      logo: '💰',
      status: 'integrated',
      features: ['Invoice sync', 'Cost tracking', 'Reporting']
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'Communication',
      description: 'Get shipment notifications directly in Slack',
      logo: '💬',
      status: 'integrated',
      features: ['Notifications', 'Status updates', 'Team alerts']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'Automation',
      description: 'Connect with 5000+ apps via Zapier',
      logo: '⚙️',
      status: 'integrated',
      features: ['Workflow automation', 'Multi-app sync', 'Custom triggers']
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      category: 'E-commerce',
      description: 'Full integration with WooCommerce stores',
      logo: '🏪',
      status: 'integrated',
      features: ['Product sync', 'Shipping labels', 'Tracking']
    },
    {
      id: 'email',
      name: 'Email',
      category: 'Communication',
      description: 'Automated email notifications for shipments',
      logo: '📧',
      status: 'integrated',
      features: ['Notifications', 'Custom templates', 'Batch sending']
    },
    {
      id: 'api',
      name: 'REST API',
      category: 'Developer',
      description: 'Build custom integrations with our REST API',
      logo: '🔌',
      status: 'integrated',
      features: ['Full access', 'Documentation', 'Support']
    }
  ];

  const categories = ['CRM', 'E-commerce', 'Accounting', 'Communication', 'Automation', 'Developer'];
  const filteredIntegrations = activeCategory
    ? integrations.filter(i => i.category === activeCategory)
    : integrations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Integrations
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Connect VCAN Freight with your favorite tools and platforms to streamline your shipping operations
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
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
              All Integrations
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

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all"
            >
              {/* Logo */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {integration.logo}
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {integration.name}
              </h3>

              {/* Category */}
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                {integration.category}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {integration.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {integration.features.slice(0, 2).map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Status and Button */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    integration.status === 'integrated'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {integration.status === 'integrated' ? '✓ Active' : 'Coming Soon'}
                </span>
                <button
                  disabled={integration.status === 'coming-soon'}
                  className={`text-xs font-bold px-3 py-2 rounded transition-all ${
                    integration.status === 'integrated'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {integration.status === 'integrated' ? 'Connect' : 'Notify'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* API Documentation Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">API Documentation</h2>
              <p className="text-lg opacity-90 mb-6">
                Build custom integrations with our comprehensive REST API. Full documentation and support available.
              </p>
              <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all">
                View API Docs
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold mb-2">Base URL</p>
                <p className="font-mono text-sm opacity-90">https://api.vcanfreight.com/v1</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold mb-2">Rate Limit</p>
                <p className="text-sm opacity-90">1000 requests per minute</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold mb-2">Authentication</p>
                <p className="text-sm opacity-90">OAuth 2.0 & API Key</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Partners Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Top Integration Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Salesforce Integration',
                desc: 'Sync shipments with your CRM for better customer insights'
              },
              {
                name: 'E-commerce Platform Sync',
                desc: 'Auto-import orders and ship directly from your store'
              },
              {
                name: 'Accounting Software',
                desc: 'Automatic invoice and cost tracking in your accounting system'
              },
              {
                name: 'Communication Tools',
                desc: 'Get real-time notifications across all your platforms'
              },
              {
                name: 'Workflow Automation',
                desc: 'Build custom workflows with Zapier and Make'
              },
              {
                name: 'Custom Solutions',
                desc: 'Work with our team to build custom integrations'
              }
            ].map((partner, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{partner.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{partner.desc}</p>
                <button className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
