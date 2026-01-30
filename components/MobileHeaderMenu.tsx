'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function MobileHeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    { icon: 'dashboard', label: t('navigation.dashboard'), href: '/dashboard' },
    { icon: 'search', label: t('navigation.search'), href: '/booking' },
    { icon: 'schedule', label: t('schedules.title', 'Schedules'), href: '/schedules' },
    { icon: 'event_note', label: t('navigation.bookings'), href: '/bookings' },
    { icon: 'chat', label: t('navigation.messages'), href: '#' },
    { icon: 'settings', label: t('navigation.settings'), href: '/more' },
    { icon: 'language', label: t('navigation.language'), href: '#' },
    { icon: 'dark_mode', label: t('navigation.theme'), href: '#' },
  ];

  const handleItemClick = (href: string) => {
    if (href !== '#') {
      router.push(href);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Sidebar Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 z-50 shadow-2xl transform transition-transform duration-300 md:hidden overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">VCANFreight</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                </button>
              </div>

              {/* User Profile */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.href === '#') {
                  // Special handling for language and theme
                  if (item.icon === 'language') {
                    return (
                      <div key={item.label} className="p-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{item.label}</p>
                        <LanguageSelector />
                      </div>
                    );
                  }
                  if (item.icon === 'dark_mode') {
                    return (
                      <div key={item.label} className="p-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{item.label}</p>
                        <div className="flex items-center justify-between">
                          <ThemeToggle />
                        </div>
                      </div>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={item.href}
                    onClick={() => handleItemClick(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                      isActive
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto material-symbols-outlined text-primary">check</span>
                    )}
                  </button>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

              {/* Logout */}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left text-red-600 dark:text-red-400"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="font-medium">{t('settings.logout')}</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

