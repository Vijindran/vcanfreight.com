'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useBooking, BookingType } from '@/context/BookingContext';

export default function BookingTypeSelection() {
    const { state, updateState, nextStep } = useBooking();

    const handleSelect = (type: BookingType) => {
        updateState({ bookingType: type });
        nextStep();
    };

    const handleContinue = () => {
        if (state.bookingType) {
            nextStep();
        }
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 pb-20 sm:pb-24 md:pb-32">
            <div className="px-1 sm:px-2 md:px-4">
                <h1 className="text-[#111418] dark:text-white tracking-tight text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-left">
                    Select shipping type
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg mt-2 sm:mt-3">
                    Choose the option that best fits your cargo volume and delivery requirements.
                </p>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 flex-1">
                {/* FCL Option */}
                <div 
                    onClick={() => handleSelect('FCL')}
                    className={`group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-[#1a222d] shadow-sm ring-1 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary cursor-pointer active:scale-[0.98] card-hover ${state.bookingType === 'FCL' ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'ring-slate-200 dark:ring-slate-700'}`}
                >
                    <div className="relative h-28 sm:h-32 md:h-40 lg:h-48 w-full overflow-hidden bg-blue-50">
                        <img
                            src="/images/fcl-ship.jpg"
                            alt="FCL Container Ship"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                              console.error('Failed to load FCL image:', e);
                              // Fallback to absolute URL if relative fails
                              e.currentTarget.src = 'https://vcanfreight.com/images/fcl-ship.jpg';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent z-10 group-hover:from-black/40 transition-all duration-300"></div>
                        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                <span className="material-symbols-outlined text-xl">directions_boat</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-wide drop-shadow-lg">FCL Booking</span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
                        <div className="mb-2 sm:mb-4">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:text-primary transition-colors">Full Container Load</h3>
                            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                                Exclusive use of a container. Best for large shipments (over 15 CBM) or fragile goods needing security.
                            </p>
                        </div>
                    </div>
                </div>

                {/* LCL Option */}
                <div 
                    onClick={() => handleSelect('LCL')}
                    className={`group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-[#1a222d] shadow-sm ring-1 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary cursor-pointer active:scale-[0.98] card-hover ${state.bookingType === 'LCL' ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'ring-slate-200 dark:ring-slate-700'}`}
                >
                    <div className="relative h-28 sm:h-32 md:h-40 lg:h-48 w-full overflow-hidden bg-indigo-50">
                        <img
                            src="/images/lcl-warehouse.jpg"
                            alt="LCL Warehouse"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                              console.error('Failed to load LCL image:', e);
                              // Fallback to absolute URL if relative fails
                              e.currentTarget.src = 'https://vcanfreight.com/images/lcl-warehouse.jpg';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent z-10 group-hover:from-black/40 transition-all duration-300"></div>
                        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                <span className="material-symbols-outlined text-xl">inventory_2</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-wide drop-shadow-lg">LCL Booking</span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
                        <div className="mb-2 sm:mb-4">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Less than Container Load</h3>
                            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                                Share container space with others. Cost-effective for smaller shipments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Airfreight Option */}
                <div 
                    onClick={() => handleSelect('AIR')}
                    className={`group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-[#1a222d] shadow-sm ring-1 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary cursor-pointer active:scale-[0.98] card-hover ${state.bookingType === 'AIR' ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'ring-slate-200 dark:ring-slate-700'}`}
                >
                    <div className="relative h-28 sm:h-32 md:h-40 lg:h-48 w-full overflow-hidden bg-sky-50">
                        <img
                            src="/images/airfreight.jpg"
                            alt="Airfreight Cargo"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                              console.error('Failed to load Airfreight image:', e);
                              // Fallback to absolute URL if relative fails
                              e.currentTarget.src = 'https://vcanfreight.com/images/airfreight.jpg';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent z-10 group-hover:from-black/40 transition-all duration-300"></div>
                        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                <span className="material-symbols-outlined text-xl">flight_takeoff</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-wide drop-shadow-lg">Airfreight</span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
                        <div className="mb-2 sm:mb-4">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Air Cargo</h3>
                            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                                Fastest shipping method. Ideal for urgent deliveries.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 mt-auto space-y-3 sm:space-y-4">
                {/* Continue button kept as backup, but cards now navigate directly */}
                <button
                    onClick={handleContinue}
                    disabled={!state.bookingType}
                    className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 font-bold h-11 sm:h-12 md:h-14 rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
                >
                    Continue
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px] md:text-[22px]">arrow_forward</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">headset_mic</span>
                    Not sure which to choose? Contact Support
                </button>
            </div>
        </div>
    );
}
