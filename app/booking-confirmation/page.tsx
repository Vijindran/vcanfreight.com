'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';

export default function BookingConfirmation() {
  const { state } = useBooking();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const bookingNumber = 'N°29300656';

  // Send confirmation emails when component mounts
  useEffect(() => {
    const sendConfirmationEmails = async () => {
      try {
        // Get customer data from booking context or form
        const customerData = {
          bookingNumber: bookingNumber.replace('N°', ''),
          customerName: 'Vijindran Subramaniam',
          customerEmail: 'vijindran@vcanfreight.com',
          origin: state?.origin || 'Felixstowe, GB',
          destination: state?.destination || 'Bangkok, TH',
          containerType: '20 Standard',
          noOfContainers: 1,
          commodity: '25-27',
          commodityDetails: 'Mineral Products',
          cargoReadyDate: '2/9/2026',
          shippingType: 'FCL',
          totalAmount: 3025,
          validity: {
            from: '04 Feb 2026',
            to: '28 Mar 2026',
          },
        };

        const response = await fetch('/api/bookings/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });

        if (response.ok) {
          setEmailSent(true);
          console.log('✅ Confirmation emails sent successfully');
        } else {
          const errorData = await response.json() as { error?: string };
          setEmailError(`Failed to send emails: ${errorData.error || 'Unknown error'}`);
          console.error('Email error:', errorData);
        }
      } catch (error: unknown) {
        console.error('Error sending confirmation emails:', error);
        setEmailError('Email sending service temporarily unavailable');
      }
    };

    // Send emails on component mount
    if (!emailSent && !emailError) {
      sendConfirmationEmails();
    }
  }, [emailSent, emailError, bookingNumber, state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-24">
        {/* Confirmation Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 md:p-16 text-center border border-slate-200 dark:border-slate-700 mb-12">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center animate-bounce">
              <span className="text-4xl">✓</span>
            </div>
          </div>

          {/* Booking Number */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Booking
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            {bookingNumber}
          </h2>

          {/* Confirmation Message */}
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-12">
            Has been created! Please check your e-mail.
          </p>

          {/* Email Status Indicator */}
          {emailSent && (
            <div className="mb-8 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="text-lg">✓</span>
              <span className="text-sm font-semibold">Confirmation emails sent</span>
            </div>
          )}

          {emailError && (
            <div className="mb-8 inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-semibold">{emailError}</span>
            </div>
          )}
          <div className="h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent my-12"></div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-lg">
              Track booking status
            </button>
            <Link href="/quotes" className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-lg">
              Find new tariff →
            </Link>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Booking Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Route */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Route</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Felixstowe, GB</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Bangkok, TH</p>
                </div>
              </div>
            </div>

            {/* Carrier */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Carrier</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚢</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">CMA CGM</p>
              </div>
            </div>

            {/* Shipping Type */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Shipping Type</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">FCL 20'ST</p>
            </div>

            {/* Ready to Load */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Ready to Load</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">09 Feb, 2026</p>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">USD 3,025</p>
            </div>

            {/* Quote Validity */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Validity</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">04 Feb 2026 - 28 Mar 2026</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">ℹ️</span>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">What's next?</h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                A confirmation email with all booking details has been sent to your registered email address. You can track your shipment status in real-time using your booking number. Our team will contact you with further instructions within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-24">
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
