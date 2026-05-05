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
        <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-sm font-normal text-muted-foreground">
              ({count})
            </span>
          )}
        </h2>
        {viewAllHref && hasChildren && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {hasChildren ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 px-4 bg-muted/50 rounded-lg">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}
