'use client';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsToggling(true);

    // Toggle theme (this will update state and apply styles)
    toggleTheme();

    // Small delay to allow animation to play
    setTimeout(() => {
      setIsToggling(false);
    }, 300);
  };

  if (!mounted) {
    // Return a placeholder to prevent layout shift
    return (
      <button
        className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
        aria-label="Toggle theme"
        disabled
      >
        <span className="material-symbols-outlined text-[20px]">brightness_medium</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`group relative p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${resolvedTheme === 'light'
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        } ${isToggling ? 'opacity-50 cursor-wait' : ''}`}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      title={`Current: ${resolvedTheme === 'light' ? 'Light' : 'Dark'} mode - Click to switch`}
    >
      <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${isToggling ? 'animate-spin' : 'group-hover:rotate-180'}`}>
        {resolvedTheme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
      {/* Visual indicator */}
      <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${resolvedTheme === 'light' ? 'bg-yellow-400' : 'bg-blue-400'
        }`}></span>
    </button>
  );
}
