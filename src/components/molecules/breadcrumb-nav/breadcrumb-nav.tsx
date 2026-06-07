'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { LessonSearch } from '@/components/organisms/lesson-search/lesson-search'

type BreadcrumbItem = {
  label?: string
  labelKey?: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
  actions?: React.ReactNode
}

function BreadcrumbNav({ items, actions }: Props) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background/90 backdrop-blur-sm shrink-0">
      <Link href="/" className="text-sm font-bold tracking-tight shrink-0">
        <span className="text-primary">TS</span> Playground
      </Link>
      {items.map((item, i) => (
        <Fragment key={i}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 rtl:scale-x-[-1]" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              {item.labelKey ? t(item.labelKey) : item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium truncate">
              {item.labelKey ? t(item.labelKey) : item.label}
            </span>
          )}
        </Fragment>
      ))}
      <div className="ms-auto shrink-0 flex items-center gap-1">
        <LessonSearch />
        {actions}
      </div>
    </header>
  )
}

export { BreadcrumbNav }
