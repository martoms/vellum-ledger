import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'default' | 'icon' | 'small'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--vellum-forest)] text-[var(--vellum-paper)] hover:bg-[var(--vellum-forest-deep)]',
  outline: 'border border-[var(--vellum-line-strong)] text-[var(--vellum-ink)] hover:bg-[var(--vellum-wash)]',
  ghost: 'text-[var(--vellum-ink)] hover:bg-[var(--vellum-wash)]',
  danger: 'border border-[var(--vellum-expense)]/35 text-[var(--vellum-expense)] hover:bg-[var(--vellum-expense)]/10',
}

const sizes: Record<ButtonSize, string> = {
  default: 'min-h-11 px-4 text-sm',
  small: 'min-h-9 px-3 text-xs',
  icon: 'size-11 p-0',
}

export function Button({ className, variant = 'primary', size = 'default', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vellum-forest)] disabled:pointer-events-none disabled:opacity-45',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
