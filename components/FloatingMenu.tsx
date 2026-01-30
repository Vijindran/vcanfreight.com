'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    { icon: 'dashboard', label: t('navigation.dashboard'), href: '/dashboard', id: 'dashboard' },
    { icon: 'search', label: t('navigation.search'), href: '/booking', id: 'booking' },
    { icon: 'schedule', label: t('schedules.title', 'Schedules'), href: '/schedules', id: 'schedules' },
    { icon: 'event_note', label: t('navigation.bookings'), href: '/bookings', id: 'bookings' },
    { icon: 'workspace_premium', label: 'Subscription', href: '/subscription', id: 'subscription' },
    { icon: 'chat', label: t('navigation.messages'), href: '#', id: 'messages' },
    { icon: 'settings', label: t('navigation.settings'), href: '/more', id: 'settings' },
    { icon: 'help', label: t('settings.help'), href: '#', id: 'help' },
  ];

  const handleItemClick = (href: string) => {
    if (href !== '#') {
      router.push(href);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Menu Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 sm:bottom-28 md:hidden z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        aria-label="Menu"
      >
        <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-24 right-4 md:hidden z-50 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2 max-h-96 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left ${
                      isActive ? 'bg-primary/10 dark:bg-primary/20' : ''
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
                      {item.icon}
                    </span>
                    <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

              {/* Logout */}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left text-red-600 dark:text-red-400"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="text-sm font-medium">{t('settings.logout')}</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

