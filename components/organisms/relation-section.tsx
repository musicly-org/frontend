import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface RelationSectionProps {
  title: string
  count?: number
  children: React.ReactNode
  viewAllHref?: string
  emptyMessage?: string
  variant?: 'list' | 'grid'
}

export function RelationSection({
  title,
  count,
  children,
  viewAllHref,
  emptyMessage = 'No items available',
  variant = 'list',
}: RelationSectionProps) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children)

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
          {title}
          {count !== undefined && (
            <span className="text-sm font-normal text-muted-foreground bg-surface-elevated px-2.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </h2>
        {viewAllHref && hasChildren && (
          <Link
            href={viewAllHref}
            className="group flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {hasChildren ? (
        <div className={variant === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-1'}>
          {children}
        </div>
      ) : (
        <div className="rounded-xl bg-surface-elevated ring-1 ring-white/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      )}
    </section>
  )
}
