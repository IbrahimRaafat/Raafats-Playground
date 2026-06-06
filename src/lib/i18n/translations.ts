import { en } from './en'
import { ar } from './ar'
import type { Locale } from './types'

export const translations: Record<Locale, typeof en> = { en, ar }
