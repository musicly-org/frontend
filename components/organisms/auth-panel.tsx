'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, UserPlus, LogIn, LogOut, Music } from 'lucide-react'
import { hasPermission, primaryRoleLabel } from '@/lib/auth'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'register'

export function AuthPanel() {
  const { session, isLoading, login, register, logout, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ email, password, displayName })
      }

      router.push('/')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    setIsSubmitting(true)
    setError(null)

    try {
      await logout()
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'Unable to sign out right now')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl bg-surface-elevated ring-1 ring-white/5 p-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Checking your session…</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && session) {
    return (
      <div className="w-full rounded-3xl bg-surface-elevated ring-1 ring-white/5 p-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-accent ring-1 ring-accent/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Signed in
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                  {session.displayName || session.email || 'Musicly account'}
                </h2>
                {session.email && <p className="mt-1 text-sm text-muted-foreground">{session.email}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {session.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-white/10"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-surface-elevated px-4 py-2.5 text-sm font-medium text-foreground ring-1 ring-white/10 transition-all hover:ring-white/20 hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          {/* Capabilities */}
          <div className="grid gap-4 sm:grid-cols-2">
            <CapabilityCard
              label="Access level"
              value={primaryRoleLabel(session) ?? 'Signed in'}
              hint={
                hasPermission(session, 'catalog:write')
                  ? 'This account can manage catalog content.'
                  : 'This account can browse the catalog.'
              }
            />
            <CapabilityCard
              label="Session expires"
              value={new Date(session.expiresAt).toLocaleDateString()}
              hint="Secure HTTP-only session cookie."
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-3xl bg-surface-elevated ring-1 ring-white/5 p-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center">
          <Music className="w-7 h-7 text-accent" />
        </div>
      </div>
      
      {/* Mode tabs */}
      <div className="flex gap-1 rounded-2xl bg-background p-1.5 ring-1 ring-white/5">
        <ModeButton
          active={mode === 'login'}
          label="Sign In"
          icon={<LogIn className="h-4 w-4" />}
          onClick={() => setMode('login')}
        />
        <ModeButton
          active={mode === 'register'}
          label="Create Account"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={() => setMode('register')}
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === 'register' && (
          <Field
            label="Display name"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Your name on Musicly"
            autoComplete="name"
          />
        )}

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={mode === 'register' ? 'Choose a password' : 'Enter your password'}
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          required
        />

        {error && (
          <div className="rounded-xl bg-destructive/10 ring-1 ring-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {isSubmitting ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  autoComplete?: string
  required?: boolean
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-12 w-full rounded-xl bg-background px-4 text-sm text-foreground ring-1 ring-white/10 transition-all placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </label>
  )
}

function ModeButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all',
        active 
          ? 'bg-surface-elevated text-foreground ring-1 ring-white/10 shadow-sm' 
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function CapabilityCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-2xl bg-background p-4 ring-1 ring-white/5">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
