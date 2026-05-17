import { AuthPanel } from '@/components/organisms/auth-panel'

export function AuthPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(199,151,61,0.16),_transparent_34%),linear-gradient(180deg,_transparent,_rgba(39,32,24,0.03))]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Musicly Access
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Sign in or create your Musicly account.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Authentication now runs through the backend auth module. New registrations are provisioned as regular
            users, while existing admin credentials continue to unlock catalog management capabilities.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              title="Regular by default"
              description="Frontend registration uses the backend /auth/register flow and lands new accounts in the regular-user role."
            />
            <FeatureCard
              title="Secure session"
              description="The browser talks to same-origin Next.js auth routes, which keep the backend token in an HTTP-only cookie."
            />
            <FeatureCard
              title="Role aware"
              description="The UI reflects backend-issued roles and permissions so future protected features have a single source of truth."
            />
          </div>
        </section>

        <section className="lg:pt-8">
          <AuthPanel />
        </section>
      </div>
    </main>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <article className="rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  )
}
