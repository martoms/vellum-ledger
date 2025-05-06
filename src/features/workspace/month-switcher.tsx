'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatMonth, getMonthOffset } from '@/features/transactions/presentation'
import { useLedger } from '@/features/workspace/ledger-provider'

export function MonthSwitcher() {
  const { selectedMonth, setSelectedMonth } = useLedger()
  return (
    <div className="inline-flex h-10 items-center rounded-md border border-[var(--vellum-line-strong)]" aria-label="Selected month">
      <Button aria-label="Previous month" variant="ghost" size="icon" className="size-9" onClick={() => setSelectedMonth(getMonthOffset(selectedMonth, -1))}><ChevronLeft aria-hidden className="size-4" /></Button>
      <span className="min-w-28 text-center font-serif text-sm">{formatMonth(selectedMonth)}</span>
      <Button aria-label="Next month" variant="ghost" size="icon" className="size-9" onClick={() => setSelectedMonth(getMonthOffset(selectedMonth, 1))}><ChevronRight aria-hidden className="size-4" /></Button>
    </div>
  )
}
