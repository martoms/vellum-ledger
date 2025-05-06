'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

type AlertDialogProps = {
  actionLabel: string
  children: React.ReactNode
  open: boolean
  onAction: () => void
  onOpenChange: (open: boolean) => void
  title: string
}

export function AlertDialog({ actionLabel, children, open, onAction, onOpenChange, title }: AlertDialogProps) {
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => dialogRef.current?.focus(), 0)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-5" role="presentation">
      <section ref={dialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="alert-title" className="w-full max-w-sm rounded-2xl border border-[var(--vellum-line-strong)] bg-[var(--vellum-paper)] p-6 shadow-2xl">
        <h2 id="alert-title" className="font-serif text-3xl tracking-tight">{title}</h2>
        <div className="mt-3 text-sm leading-6 text-[var(--vellum-muted)]">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="danger" onClick={onAction}>{actionLabel}</Button>
        </div>
      </section>
    </div>
  )
}
