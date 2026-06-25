'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider/auth-provider'

type Mode = 'sign-in' | 'sign-up'

type Props = {
  open: boolean
  onClose: () => void
}

function AuthModal({ open, onClose }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || !open) return null

  async function handleGoogleSignIn() {
    setLoading(true)
    await signInWithGoogle()
    // Page will redirect — no cleanup needed
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'sign-in') {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        setError(error)
        setLoading(false)
      } else {
        onClose()
      }
    } else {
      const { error } = await signUpWithEmail(email, password)
      if (error) {
        setError(error)
        setLoading(false)
      } else {
        setCheckEmail(true)
        setLoading(false)
      }
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {checkEmail ? (
          <div className="text-center space-y-2 py-4">
            <p className="text-2xl">📬</p>
            <p className="font-semibold">Check your email</p>
            <p className="text-sm text-muted-foreground">We sent a confirmation link to <strong>{email}</strong>.</p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{mode === 'sign-in' ? 'Sign in' : 'Create account'}</h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'sign-in' ? 'to sync your progress across devices' : 'to save your progress in the cloud'}
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />
              <span>or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Loading…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              {mode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setError(null) }}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

export { AuthModal }
