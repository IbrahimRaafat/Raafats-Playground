'use client'

import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/atoms/button/button'
import { useTheme } from '@/components/providers/theme-provider/theme-provider'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="h-8 w-8 p-0">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

export { ThemeToggle }
