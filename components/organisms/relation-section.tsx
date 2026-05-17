import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface RelationSectionProps {
  title: string
  count?: number
  children: React.ReactNode
  viewAllHref?: string
  emptyMessage?: string
}

export function RelationSection({
  title,
  count,
  children,
  viewAllHref,
  emptyMessage = 'No items available',
}: RelationSectionProps) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
          {title}
          {count !== undefined && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-medium text-muted-foreground">
              {count}
            </span>
          )}
        </h2>
        {viewAllHref && hasChildren && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {hasChildren ? (
        <div className="space-y-1">{children}</div>
      ) : (
        <div className="flex items-center justify-center py-12 px-6 bg-secondary/30 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      )}
    </section>
  )
}
