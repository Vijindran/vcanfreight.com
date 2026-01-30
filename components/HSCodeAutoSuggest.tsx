'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface HSCodeSuggestion {
  code: string;
  description: string;
  confidence: number;
}

interface HSCodeAutoSuggestProps {
  value: string;
  onChange: (code: string) => void;
  commodity: string; // Item description/commodity name
  disabled?: boolean;
  className?: string;
}

export default function HSCodeAutoSuggest({
  value,
  onChange,
  commodity,
  disabled = false,
  className = '',
}: HSCodeAutoSuggestProps) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<HSCodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLocalSuggestions = (desc: string): HSCodeSuggestion[] => {
    const lower = desc.toLowerCase();
    const matches: HSCodeSuggestion[] = [];

    const pushOnce = (code: string, confidence = 0.9, description = '') => {
      if (!matches.some((s) => s.code === code)) {
        matches.push({ code, confidence, description });
      }
    };

    if (
      lower.includes('scrap metal') ||
      lower.includes('metal scrap') ||
      lower.includes('ferrous scrap') ||
      lower.includes('heavy melting scrap') ||
      lower.includes('hms')
    ) {
      pushOnce('7204.49.00', 0.9, 'Ferrous waste and scrap (HMS 1/2, iron or steel)');
    }

    return matches;
  };

  // Debounced HS code lookup
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only search if commodity has at least 3 characters
    if (!commodity || commodity.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/hs-code?description=${encodeURIComponent(commodity.trim())}`);
        let data: any = {};
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (_) {
          data = {};
        }

        const networkSuggestions: HSCodeSuggestion[] = response.ok && Array.isArray(data.suggestions)
          ? data.suggestions
          : [];

        const fallback = networkSuggestions.length > 0 ? networkSuggestions : getLocalSuggestions(commodity.trim());

        if (fallback.length > 0) {
          setSuggestions(fallback);
          setShowSuggestions(true);

          const topSuggestion = fallback[0];
          if (topSuggestion.confidence >= 0.8 && !value) {
            onChange(topSuggestion.code);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching HS code suggestions:', error);
        const localFallback = getLocalSuggestions(commodity.trim());
        setSuggestions(localFallback);
        setShowSuggestions(localFallback.length > 0);
        if (localFallback[0]?.confidence >= 0.8 && !value) {
          onChange(localFallback[0].code);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [commodity, value, onChange]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: HSCodeSuggestion) => {
    onChange(suggestion.code);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          handleSelectSuggestion(suggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return t('hsCode.highConfidence', 'High');
    if (confidence >= 0.6) return t('hsCode.mediumConfidence', 'Medium');
    return t('hsCode.lowConfidence', 'Low');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={t('hsCode.placeholder', 'Auto-detected or enter manually')}
          className={`w-full px-4 py-2 rounded-lg border ${
            disabled 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
          } focus:outline-none focus:ring-2 focus:ring-primary ${
            isLoading ? 'pr-10' : ''
          }`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        {!isLoading && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('hsCode.suggestions', 'HS Code Suggestions')}
            </p>
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.code}-${index}`}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                selectedIndex === index ? 'bg-primary/10 dark:bg-primary/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-sm">
                      {suggestion.code}
                    </span>
                    <span className={`text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                      {getConfidenceLabel(suggestion.confidence)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {suggestion.description}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-sm ml-2">
                  arrow_forward_ios
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {commodity && commodity.length >= 3 && !isLoading && suggestions.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('hsCode.noSuggestions', 'No suggestions found. Please enter HS code manually.')}
        </p>
      )}
      {commodity && commodity.length < 3 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('hsCode.enterMoreDetails', 'Enter at least 3 characters to get HS code suggestions')}
        </p>
      )}
    </div>
  );
}



