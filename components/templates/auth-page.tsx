import { AuthPanel } from '@/components/organisms/auth-panel'
import { Music, Shield, Zap } from 'lucide-react'

export function AuthPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-20">
        {/* Left content */}
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 ring-1 ring-accent/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            <Music className="w-3.5 h-3.5" />
            Musicly Access
          </div>
          
          <h1 className="mt-8 max-w-xl text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Your music journey starts here.
          </h1>
          
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Sign in to access the full Musicly catalog, save your favorite releases, and unlock personalized discovery features.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="Secure Access"
              description="Your session is protected with HTTP-only cookies and secure backend authentication."
            />
            <FeatureCard
              icon={<Music className="w-5 h-5" />}
              title="Full Catalog"
              description="Browse artists, releases, and tracks from our curated music database."
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="Role-Based"
              description="Access features based on your account permissions and role."
            />
          </div>
        </section>

        {/* Right panel */}
        <section className="flex items-center lg:pt-8">
          <AuthPanel />
        </section>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <article className="group rounded-2xl bg-surface-elevated ring-1 ring-white/5 p-5 transition-all hover:ring-white/10">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  )
}
