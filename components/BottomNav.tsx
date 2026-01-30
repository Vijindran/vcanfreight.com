'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
        { label: 'Search', icon: 'search', href: '/booking' },
        { label: 'Schedules', icon: 'schedule', href: '/schedules' },
        { label: 'Messages', icon: 'chat', href: '#' },
        { label: 'More', icon: 'more_horiz', href: '/more' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-[#101822]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] pt-2 px-2 z-50 lg:hidden shadow-lg">
            <div className="flex justify-around items-center h-14 sm:h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`group relative flex flex-col items-center gap-0.5 sm:gap-1 w-14 sm:w-16 transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <span className={`material-symbols-outlined text-[20px] sm:text-[24px] transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                            <span className={`text-[9px] sm:text-[10px] transition-all duration-300 ${isActive ? 'font-bold scale-105' : 'font-medium'}`}>{item.label}</span>
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-t-full"></div>
                            )}
                        </Link>
                    );
                })}
            </div>
            {/* Safe Area Spacer for mobile home bar */}
            <div className="h-4 sm:h-6 w-full bg-white/95 dark:bg-[#101822]/95 backdrop-blur-md"></div>
        </nav>
    );
}
