export type Locale = 'en' | 'ar'

export type TranslationDict = Record<string, string>

export const LOCALES: { value: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { value: 'en', label: 'EN', dir: 'ltr' },
  { value: 'ar', label: 'AR', dir: 'rtl' },
]
