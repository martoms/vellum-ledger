'use client'

import { useState } from 'react'
import { MoonStar, RotateCcw } from 'lucide-react'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { PageHeading } from '@/features/workspace/page-heading'
import { useLedger } from '@/features/workspace/ledger-provider'

export function SettingsPage() {
  const { resetDemoData, setTheme, theme } = useLedger()
  const [resetOpen, setResetOpen] = useState(false)
  const [notice, setNotice] = useState('')

  function confirmReset() {
    resetDemoData()
    setResetOpen(false)
    setNotice('Demo data restored.')
  }

  return (
    <div className="mx-auto max-w-3xl" aria-live="polite">
      <PageHeading eyebrow="Your workspace" title="Settings"><p className="text-sm leading-6 text-[var(--vellum-muted)]">Preferences stay on this browser. Vellum has no account or cloud sync.</p></PageHeading>
      <section className="rounded-xl border p-5"><div className="flex items-start gap-4"><span className="grid size-10 place-items-center rounded-full bg-[var(--vellum-wash)]"><MoonStar aria-hidden className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="font-serif text-2xl">Appearance</h2><p className="mt-1 text-sm leading-6 text-[var(--vellum-muted)]">Choose paper-light, night-dark, or follow your device.</p><label className="mt-4 block max-w-xs text-sm font-medium">Theme<Select className="mt-2" value={theme} onChange={(event) => setTheme(event.target.value as 'light' | 'dark' | 'system')}><option value="system">System setting</option><option value="light">Light</option><option value="dark">Dark</option></Select></label></div></div></section>
      <section className="mt-5 rounded-xl border border-[var(--vellum-expense)]/25 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-2xl">Restore demo ledger</h2><p className="mt-1 max-w-lg text-sm leading-6 text-[var(--vellum-muted)]">Replace this browser’s transactions with the reference May entries.</p></div><Button variant="danger" onClick={() => setResetOpen(true)}><RotateCcw aria-hidden className="size-4" />Restore demo data</Button></div></section>
      <p className="sr-only">{notice}</p>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen} title="Restore demo ledger" actionLabel="Restore data" onAction={confirmReset}>Your saved entries will be replaced with Vellum’s May demo ledger. This cannot be undone.</AlertDialog>
    </div>
  )
}
