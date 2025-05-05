import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Select({ children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select
        className={cn(
          'min-h-11 w-full appearance-none rounded-md border border-[var(--vellum-line-strong)] bg-transparent px-3 pr-10 font-sans text-sm text-[var(--vellum-ink)] outline-none focus:border-[var(--vellum-forest)] focus:ring-2 focus:ring-[var(--vellum-forest)]/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
    </span>
  )
}
