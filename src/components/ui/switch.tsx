'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, className, onCheckedChange, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        'relative h-7 w-12 rounded-full border border-[var(--vellum-line-strong)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vellum-forest)]',
        checked ? 'bg-[var(--vellum-forest)]' : 'bg-[var(--vellum-wash)]',
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <span className={cn('block size-5 rounded-full bg-[var(--vellum-paper)] shadow-sm transition-transform', checked ? 'translate-x-5' : 'translate-x-1')} />
    </button>
  )
}
