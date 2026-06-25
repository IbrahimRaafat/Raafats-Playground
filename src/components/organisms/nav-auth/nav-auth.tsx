'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { AuthModal } from '@/components/organisms/auth-modal/auth-modal'
import { useAuth } from '@/components/providers/auth-provider/auth-provider'

function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? ''
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {initials || <User className="h-3.5 w-3.5" />}
          </span>
        )}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full mt-1.5 z-50 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-xs font-semibold truncate">{displayName}</p>
              {user?.email && displayName !== user.email && (
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              )}
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Profile
            </Link>
            <button
              onClick={async () => { setOpen(false); await signOut() }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function NavAuth() {
  const { user, loading } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  if (loading) {
    return <div className="w-20 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
  }

  if (user) {
    return <UserMenu />
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="ms-2 hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
        style={{ background: '#cbf04f' }}
      >
        Sign in
      </button>
      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

export { NavAuth, UserMenu }
