'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/types'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved === 'en' || saved === 'ar') setLocaleState(saved)
  }, [])

  useEffect(() => {
    const isRtl = locale === 'ar'
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', locale)
    document.cookie = `locale=${locale};path=/;max-age=31536000`
    localStorage.setItem('locale', locale)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale: setLocaleState }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useTranslation() {
  const { locale } = useLocale()
  const dict = translations[locale]

  function t(key: string, vars?: Record<string, string | number>): string {
    let str = dict[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, String(v))
      }
    }
    return str
  }

  return { t, locale }
}
