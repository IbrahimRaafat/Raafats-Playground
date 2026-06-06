import type { Metadata } from 'next'
import { SiteNavbar } from '@/components/organisms/site-navbar/site-navbar'
import { SiteFooter } from '@/components/atoms/site-footer/site-footer'
import { QuestionsContent } from './_components/questions-content'

export const metadata: Metadata = {
  title: 'Interview Questions — TS Playground',
  description: 'Coding challenges and theoretical questions from top tech companies like Google, Meta, Amazon, and Microsoft.',
}

export default function QuestionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <SiteNavbar />
      <div className="flex-1">
        <QuestionsContent />
      </div>
      <SiteFooter />
    </div>
  )
}
