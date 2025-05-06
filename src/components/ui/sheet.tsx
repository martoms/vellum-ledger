'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SheetProps = {
  children: React.ReactNode
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export function Sheet({ children, description, open, onOpenChange, title }: SheetProps) {
  const panelRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const timer = window.setTimeout(() => panelRef.current?.focus(), 0)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/35 p-0 backdrop-blur-[1px] md:items-center md:justify-end md:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        aria-describedby={description ? 'sheet-description' : undefined}
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl border border-[var(--vellum-line-strong)] bg-[var(--vellum-paper)] p-5 shadow-2xl md:max-h-[calc(100dvh-2.5rem)] md:max-w-md md:rounded-2xl md:p-7"
      >
        <header className="mb-6 flex items-start justify-between gap-5">
          <div>
            <h2 id="sheet-title" className="font-serif text-3xl leading-none tracking-tight">{title}</h2>
            {description ? <p id="sheet-description" className="mt-2 text-sm text-[var(--vellum-muted)]">{description}</p> : null}
          </div>
          <Button aria-label={`Close ${title.toLowerCase()}`} variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X aria-hidden className="size-5" />
          </Button>
        </header>
        {children}
      </section>
    </div>
  )
}
