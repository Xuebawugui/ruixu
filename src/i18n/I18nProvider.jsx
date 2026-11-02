import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  LANGUAGES,
  formatMessage,
  messages,
  resolveMessage,
} from './messages.js';

const STORAGE_KEY = 'ruixu-locale';

const I18nContext = createContext(null);

function detectLocale() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && messages[saved]) return saved;
  const lang = (navigator.language || 'en').toLowerCase();
  if (lang.startsWith('zh')) {
    return lang.includes('tw') || lang.includes('hk') ? 'zh-TW' : 'zh-CN';
  }
  const short = lang.split('-')[0];
  const match = LANGUAGES.find((l) => l.code === short || l.code.startsWith(short));
  return match?.code || 'en';
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => detectLocale());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => {
    const dict = messages[locale] || messages.en;
    const t = (key, vars) => {
      const raw = resolveMessage(dict, key) ?? resolveMessage(messages.en, key) ?? key;
      return typeof raw === 'string' ? formatMessage(raw, vars) : key;
    };
    return {
      locale,
      languages: LANGUAGES,
      setLocale: setLocaleState,
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
