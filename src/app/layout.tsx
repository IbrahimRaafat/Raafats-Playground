import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider/theme-provider'
import { LocaleProvider } from '@/components/providers/locale-provider/locale-provider'

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] })
const cairo = Cairo({ variable: '--font-arabic', subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'TS Playground — Learn TypeScript & React',
  description: 'An interactive playground and learning platform for TypeScript and React.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} h-full dark`} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground antialiased">
        <ThemeProvider>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
