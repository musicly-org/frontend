'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, UserPlus, LogIn, LogOut } from 'lucide-react'
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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    )
  }

  if (isAuthenticated && session) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Signed in
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {session.displayName || session.email || 'Musicly account'}
              </h2>
              {session.email && <p className="mt-1 text-sm text-muted-foreground">{session.email}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {session.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
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
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CapabilityCard
            label="Access level"
            value={primaryRoleLabel(session) ?? 'Signed in'}
            hint={
              hasPermission(session, 'catalog:write')
                ? 'This account can manage catalog content.'
                : 'This account can browse the catalog and use reader features.'
            }
          />
          <CapabilityCard
            label="Token lifetime"
            value={new Date(session.expiresAt).toLocaleString()}
            hint="The frontend stores your backend-issued session in a secure same-origin cookie."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex gap-2 rounded-full bg-secondary p-1">
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          placeholder="listener@musicly.local"
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
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {isSubmitting ? 'Working…' : mode === 'login' ? 'Sign in to Musicly' : 'Create regular user account'}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        New registrations are created as regular users by default and receive read access to the catalog.
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
        className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
        'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
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
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  )
}
