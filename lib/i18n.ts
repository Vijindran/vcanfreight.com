import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

if (!i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/common.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        // Convert en-GB, en-US, etc. to just 'en'
        convertDetectedLanguage: (lng: string) => {
          if (lng.startsWith('en')) return 'en';
          if (lng.startsWith('es')) return 'es';
          if (lng.startsWith('fr')) return 'fr';
          if (lng.startsWith('de')) return 'de';
          if (lng.startsWith('zh')) return 'zh';
          if (lng.startsWith('ja')) return 'ja';
          if (lng.startsWith('pt')) return 'pt';
          if (lng.startsWith('ru')) return 'ru';
          if (lng.startsWith('ar')) return 'ar';
          if (lng.startsWith('hi')) return 'hi';
          return lng.split('-')[0]; // Fallback to first part
        },
      },
      react: {
        useSuspense: false, // Disable suspense to prevent hydration issues
      },
    });
}

export default i18n;

