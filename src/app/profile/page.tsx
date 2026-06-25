'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, LogOut, User, BookOpen, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider/auth-provider'
import { getAllProgress } from '@/lib/progress/store'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState<Record<string, string>>({})
  const [progressLoading, setProgressLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      getAllProgress().then((p) => { setProgress(p); setProgressLoading(false) })
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const displayName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? ''
  const initials = displayName.slice(0, 2).toUpperCase()
  const completedCount = Object.values(progress).filter((s) => s === 'completed').length
  const inProgressCount = Object.values(progress).filter((s) => s === 'in-progress').length

  async function handleSignOut() {
    await signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center px-6 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex-1" />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-2 ring-border" />
          ) : (
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold ring-2 ring-border">
              {initials || <User className="h-7 w-7" />}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {user.email && displayName !== user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-3xl font-bold">{progressLoading ? '—' : completedCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">lessons</p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">In progress</span>
            </div>
            <p className="text-3xl font-bold">{progressLoading ? '—' : inProgressCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">lessons</p>
          </div>
        </div>

        {/* Completed lessons list */}
        {!progressLoading && completedCount > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Completed lessons
            </h2>
            <ul className="space-y-1.5">
              {Object.entries(progress)
                .filter(([, s]) => s === 'completed')
                .map(([lessonId]) => {
                  const [trackSlug, ...rest] = lessonId.split('/')
                  const lessonSlug = rest.join('/')
                  return (
                    <li key={lessonId}>
                      <Link
                        href={`/learn/${lessonId}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span className="text-muted-foreground text-xs capitalize">{trackSlug}</span>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <span className="capitalize">{lessonSlug.replace(/-/g, ' ')}</span>
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>
        )}

        {!progressLoading && completedCount === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No lessons completed yet.</p>
            <Link href="/learn" className="mt-3 inline-block text-sm underline underline-offset-2">
              Start learning
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
