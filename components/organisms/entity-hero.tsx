import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Play, Shuffle, Heart, Share2 } from 'lucide-react'

interface EntityHeroProps {
  title: string
  subtitle?: React.ReactNode
  metadata?: string[]
  imageUrl?: string
  imageAlt?: string
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  variant?: 'default' | 'immersive'
}

export function EntityHero({
  title,
  subtitle,
  metadata = [],
  imageUrl,
  imageAlt,
  size = 'md',
  children,
  variant = 'default',
}: EntityHeroProps) {
  const imageSizes = {
    sm: 'h-28 w-28 sm:h-36 sm:w-36',
    md: 'h-40 w-40 sm:h-52 sm:w-52',
    lg: 'h-48 w-48 sm:h-64 sm:w-64',
  }

  if (variant === 'immersive') {
    return (
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        {/* Background image with blur */}
        {imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover scale-110 blur-2xl opacity-30"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
        )}
        
        <div className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Image */}
            {imageUrl ? (
              <div className={cn(
                'relative shrink-0 overflow-hidden rounded-2xl bg-surface-elevated shadow-2xl ring-1 ring-white/10',
                imageSizes[size]
              )}>
                <Image
                  src={imageUrl}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 192px, 256px"
                  priority
                />
              </div>
            ) : (
              <div className={cn(
                'shrink-0 rounded-2xl bg-surface-elevated flex items-center justify-center shadow-2xl ring-1 ring-white/10',
                imageSizes[size]
              )}>
                <span className="text-6xl font-serif text-muted-foreground/30">
                  {title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Content */}
            <div className="flex flex-col justify-end gap-4">
              {subtitle && (
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
                  {subtitle}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground text-balance">
                {title}
              </h1>
              {metadata.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {metadata.map((item, index) => (
                    <span key={index} className="flex items-center gap-3">
                      {item}
                      {index < metadata.length - 1 && (
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      )}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                  <Play className="w-5 h-5 fill-current" />
                  Play
                </button>
                <button className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-surface-elevated ring-1 ring-white/10 text-muted-foreground hover:text-foreground hover:ring-white/20 transition-all">
                  <Shuffle className="w-5 h-5" />
                </button>
                <button className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-surface-elevated ring-1 ring-white/10 text-muted-foreground hover:text-foreground hover:ring-white/20 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-surface-elevated ring-1 ring-white/10 text-muted-foreground hover:text-foreground hover:ring-white/20 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              
              {children}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col sm:flex-row gap-6 sm:gap-8">
      {imageUrl ? (
        <div className={cn(
          'relative shrink-0 overflow-hidden rounded-2xl bg-surface-elevated shadow-xl ring-1 ring-white/10',
          imageSizes[size]
        )}>
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 160px, 224px"
            priority
          />
        </div>
      ) : (
        <div className={cn(
          'shrink-0 rounded-2xl bg-surface-elevated flex items-center justify-center shadow-xl ring-1 ring-white/10',
          imageSizes[size]
        )}>
          <span className="text-5xl font-serif text-muted-foreground/30">
            {title.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex flex-col justify-center gap-3">
        {subtitle && (
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
            {subtitle}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground text-balance">
          {title}
        </h1>
        {metadata.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {metadata.map((item, index) => (
              <span key={index} className="flex items-center gap-3">
                {item}
                {index < metadata.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                )}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
