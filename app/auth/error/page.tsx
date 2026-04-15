import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-6 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">Authentication error</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Something went wrong during sign-in. The link may have expired or already been used.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity text-center"
          >
            Back to sign in
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
