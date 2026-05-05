import Image from 'next/image'
import { cn } from '@/lib/utils'

interface EntityHeroProps {
  title: string
  subtitle?: React.ReactNode
  metadata?: string[]
  imageUrl?: string
  imageAlt?: string
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function EntityHero({
  title,
  subtitle,
  metadata = [],
  imageUrl,
  imageAlt,
  size = 'md',
  children,
}: EntityHeroProps) {
  const imageSizes = {
    sm: 'h-24 w-24 sm:h-32 sm:w-32',
    md: 'h-32 w-32 sm:h-48 sm:w-48',
    lg: 'h-40 w-40 sm:h-56 sm:w-56',
  }

  return (
    <section className="flex flex-col sm:flex-row gap-6 sm:gap-8">
      {imageUrl ? (
        <div className={cn('relative shrink-0 overflow-hidden rounded-lg bg-muted shadow-md', imageSizes[size])}>
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
        <div className={cn('shrink-0 rounded-lg bg-muted flex items-center justify-center shadow-md', imageSizes[size])}>
          <span className="text-4xl sm:text-5xl font-light text-muted-foreground/40">
            {title.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex flex-col justify-center gap-2">
        {subtitle && (
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground text-balance">
          {title}
        </h1>
        {metadata.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {metadata.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {item}
                {index < metadata.length - 1 && (
                  <span className="text-border">·</span>
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
