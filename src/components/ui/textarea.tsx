import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-20 w-full resize-none rounded-md border border-[var(--vellum-line-strong)] bg-transparent px-3 py-2 font-sans text-sm text-[var(--vellum-ink)] outline-none placeholder:text-[var(--vellum-muted)] focus:border-[var(--vellum-forest)] focus:ring-2 focus:ring-[var(--vellum-forest)]/20',
        className,
      )}
      {...props}
    />
  )
}
