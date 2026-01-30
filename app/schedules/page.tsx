'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import MobileHeaderMenu from '@/components/MobileHeaderMenu';

type ScheduleType = 'sea' | 'air';
type Schedule = {
  id: string;
  type: ScheduleType;
  origin: string;
  destination: string;
  carrier: string;
  departure: string;
  arrival: string;
  transitTime: number;
  frequency: string;
  vessel?: string;
  flight?: string;
  status: 'available' | 'full' | 'delayed';
};

export default function SchedulesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [scheduleType, setScheduleType] = useState<ScheduleType>('sea');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      alert(t('schedules.enterOriginDestination', 'Please enter both origin and destination'));
      return;
    }

    setIsLoading(true);
    try {
      // Call API endpoint - Now uses real SeaRates API for sea and Airlines API for air
      const params = new URLSearchParams({
        type: scheduleType,
        origin: origin.trim(),
        destination: destination.trim(),
      });
      
      const response = await fetch(`/api/schedules?${params}`);
      const data = await response.json() as any;
      
      if (response.ok && data.schedules) {
        setSchedules(data.schedules);
      } else {
        // Show error message
        console.error('API Error:', data.error || data.message);
        setSchedules([]);
        alert(data.error || t('schedules.fetchError', 'Failed to fetch schedules. Please try again.'));
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
      alert(t('schedules.fetchError', 'Failed to fetch schedules. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'full':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'delayed':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return t('schedules.status.available', 'Available');
      case 'full':
        return t('schedules.status.full', 'Full');
      case 'delayed':
        return t('schedules.status.delayed', 'Delayed');
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101822]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <MobileHeaderMenu />
            <button
              onClick={() => router.back()}
              className="hidden md:flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex-1 text-center">
            {t('schedules.title', 'Schedules')}
          </h1>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Schedule Type Toggle */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => {
                setScheduleType('sea');
                setSchedules([]);
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                scheduleType === 'sea'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined align-middle mr-2">directions_boat</span>
              {t('schedules.sea', 'Sea Freight')}
            </button>
            <button
              onClick={() => {
                setScheduleType('air');
                setSchedules([]);
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                scheduleType === 'air'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined align-middle mr-2">flight_takeoff</span>
              {t('schedules.air', 'Airfreight')}
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4">{t('schedules.searchTitle', 'Search Schedules')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('schedules.origin', 'Origin')}</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={t('schedules.originPlaceholder', 'e.g. Shanghai')}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('schedules.destination', 'Destination')}</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t('schedules.destinationPlaceholder', 'e.g. Los Angeles')}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    {t('common.loading', 'Loading...')}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">search</span>
                    {t('schedules.search', 'Search')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Schedules List */}
        {schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      schedule.type === 'sea' 
                        ? 'bg-blue-50 dark:bg-blue-900/30' 
                        : 'bg-sky-50 dark:bg-sky-900/30'
                    }`}>
                      <span className={`material-symbols-outlined text-2xl ${
                        schedule.type === 'sea' ? 'text-blue-600 dark:text-blue-400' : 'text-sky-600 dark:text-sky-400'
                      }`}>
                        {schedule.type === 'sea' ? 'directions_boat' : 'flight_takeoff'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{schedule.carrier}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {schedule.type === 'sea' ? schedule.vessel : schedule.flight}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(schedule.status)}`}>
                    {getStatusLabel(schedule.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">location_on</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t('schedules.origin', 'Origin')}</p>
                      <p className="font-semibold">{schedule.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">flag</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t('schedules.destination', 'Destination')}</p>
                      <p className="font-semibold">{schedule.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('schedules.departure', 'Departure')}</p>
                    <p className="font-semibold">{new Date(schedule.departure).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('schedules.arrival', 'Arrival')}</p>
                    <p className="font-semibold">{new Date(schedule.arrival).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('schedules.transitTime', 'Transit Time')}</p>
                    <p className="font-semibold">{schedule.transitTime} {t('schedules.days', 'days')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('schedules.frequency', 'Frequency')}</p>
                    <p className="font-semibold">{schedule.frequency}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    {t('schedules.bookNow', 'Book Now')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">schedule</span>
            <h3 className="text-lg font-bold mb-2">{t('schedules.noResults', 'No Schedules Found')}</h3>
            <p className="text-slate-500 dark:text-slate-400">{t('schedules.searchHint', 'Search for schedules by entering origin and destination')}</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

