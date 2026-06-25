import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <p className="text-4xl">⚠️</p>
        <h1 className="text-xl font-bold">Authentication error</h1>
        <p className="text-sm text-muted-foreground">Something went wrong during sign-in. Please try again.</p>
        <Link href="/" className="inline-block mt-2 text-sm underline underline-offset-2">Go home</Link>
      </div>
    </div>
  )
}
