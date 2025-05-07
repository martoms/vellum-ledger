'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpen, ChartNoAxesCombined, Landmark, Menu, Settings2, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { TransactionForm } from '@/features/workspace/transaction-form'
import { useLedger } from '@/features/workspace/ledger-provider'

const navigation = [
  { href: '/ledger', label: 'Ledger', icon: BookOpen },
  { href: '/accounts', label: 'Accounts', icon: Landmark },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/reports', label: 'Reports', icon: ChartNoAxesCombined },
  { href: '/settings', label: 'Settings', icon: Settings2 },
]

function isCurrentPath(pathname: string, href: string) {
  return href === '/ledger' ? pathname === '/' || pathname === '/ledger' : pathname === href
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const { closeComposer, composerTransaction, isComposerOpen, isHydrated } = useLedger()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isContentReady = isMounted && isHydrated

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="vellum-paper min-h-dvh">
      <div className="grid min-h-dvh md:grid-cols-[76px_1fr] lg:grid-cols-[218px_1fr]">
        <DesktopSidebar pathname={pathname} />
        <section className="min-w-0">
          <MobileHeader onMenuOpen={() => setMenuOpen(true)} />
          <main id="main-content" aria-busy={!isContentReady} className="px-5 pb-12 pt-5 md:px-8 md:pt-7 lg:px-10">
            {isContentReady ? children : <WorkspaceLoading />}
          </main>
        </section>
      </div>
      <Sheet open={isComposerOpen} onOpenChange={(open) => { if (!open) closeComposer() }} title={composerTransaction ? 'Edit transaction' : 'Add transaction'}>
        <TransactionForm />
      </Sheet>
      <MobileNavigation pathname={pathname} open={menuOpen} onOpenChange={setMenuOpen} />
    </div>
  )
}

function WorkspaceLoading() {
  return (
    <div className="grid min-h-80 place-items-center" aria-live="polite">
      <p className="font-serif text-xl text-[var(--vellum-muted)]">Opening your ledger…</p>
    </div>
  )
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden border-r md:flex md:flex-col">
      <Link href="/ledger" className="px-4 py-7 text-center font-serif text-2xl tracking-tight lg:px-7 lg:text-left"><span className="lg:hidden">V</span><span className="hidden lg:inline">Vellum Ledger</span></Link>
      <nav aria-label="Primary navigation" className="mt-6 space-y-1 px-3 lg:px-4">
        {navigation.map(({ href, icon: Icon, label }) => {
          const active = isCurrentPath(pathname, href)
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined} title={label} className={cn('focus-ring flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors', active ? 'border-l-2 border-[var(--vellum-forest)] bg-[var(--vellum-wash)] font-medium' : 'hover:bg-[var(--vellum-wash)]')}>
              <Icon aria-hidden className="size-[18px] shrink-0" strokeWidth={1.6} />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          )
        })}
      </nav>
      <p className="mt-auto hidden px-10 pb-10 font-serif text-lg italic leading-6 text-[var(--vellum-muted)] lg:block">“A calmer<br />way to keep<br />track of money.”<br /><span className="not-italic">—</span></p>
    </aside>
  )
}

function MobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="flex items-center justify-between border-b px-5 py-5 md:hidden">
      <Link href="/ledger" className="font-serif text-2xl tracking-tight">Vellum Ledger</Link>
      <Button aria-label="Open navigation" variant="ghost" size="icon" onClick={onMenuOpen}><Menu aria-hidden className="size-5" /></Button>
    </header>
  )
}

function MobileNavigation({ onOpenChange, open, pathname }: { onOpenChange: (open: boolean) => void, open: boolean, pathname: string }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Vellum Ledger">
      <nav aria-label="Mobile navigation" className="space-y-1">
        {navigation.map(({ href, icon: Icon, label }) => {
          const active = isCurrentPath(pathname, href)
          return <Link key={href} href={href} aria-current={active ? 'page' : undefined} onClick={() => onOpenChange(false)} className={cn('focus-ring flex min-h-12 items-center gap-3 rounded-md px-3', active && 'bg-[var(--vellum-wash)] font-medium')}><Icon aria-hidden className="size-5" />{label}</Link>
        })}
      </nav>
    </Sheet>
  )
}
