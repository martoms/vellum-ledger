import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-11 w-full rounded-md border border-[var(--vellum-line-strong)] bg-transparent px-3 font-sans text-sm text-[var(--vellum-ink)] outline-none placeholder:text-[var(--vellum-muted)] focus:border-[var(--vellum-forest)] focus:ring-2 focus:ring-[var(--vellum-forest)]/20',
        className,
      )}
      {...props}
    />
  )
}
