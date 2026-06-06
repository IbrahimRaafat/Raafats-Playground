'use client'

import { Button } from '@/components/atoms/button/button'
import { useLocale, useTranslation } from '@/components/providers/locale-provider/locale-provider'

function LanguageToggle() {
  const { locale, setLocale } = useLocale()
  const { t } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
      className="h-8 px-2.5 font-semibold text-xs tracking-wide"
      title={t('lang.current')}
    >
      {t('lang.switch')}
    </Button>
  )
}

export { LanguageToggle }
