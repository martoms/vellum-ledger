'use client'

import { WalletCards } from 'lucide-react'
import { formatMoney, getSummary } from '@/features/transactions/selectors'
import { PageHeading } from '@/features/workspace/page-heading'
import { useLedger } from '@/features/workspace/ledger-provider'

export function AccountsPage() {
  const { selectedMonth, transactions } = useLedger()
  const summary = getSummary(transactions, selectedMonth)
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading eyebrow="Local overview" title="Everyday funds"><p className="max-w-xl text-sm leading-6 text-[var(--vellum-muted)]">A simple view of money in this ledger. Vellum never connects to your bank.</p></PageHeading>
      <section className="overflow-hidden rounded-xl border bg-[var(--vellum-paper)]">
        <div className="flex items-center gap-4 border-b p-5"><span className="grid size-11 place-items-center rounded-full bg-[var(--vellum-wash)]"><WalletCards aria-hidden className="size-5" /></span><div><h2 className="font-serif text-2xl">Everyday funds</h2><p className="text-sm text-[var(--vellum-muted)]">Derived from your saved ledger entries</p></div></div>
        <dl className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <BalanceItem label="Available balance" value={formatMoney(summary.balanceCents)} emphasis />
          <BalanceItem label="Income this month" value={formatMoney(summary.incomeCents)} />
          <BalanceItem label="Committed spending" value={formatMoney(summary.expenseCents)} />
        </dl>
      </section>
      <p className="mt-5 text-xs leading-5 text-[var(--vellum-muted)]">This view stays on this device and recalculates from the selected month’s transactions.</p>
    </div>
  )
}

function BalanceItem({ emphasis, label, value }: { emphasis?: boolean, label: string, value: string }) {
  return <div className="p-5"><dt className="text-xs uppercase tracking-[.14em] text-[var(--vellum-muted)]">{label}</dt><dd className={`mt-2 font-serif ${emphasis ? 'text-4xl' : 'text-2xl'}`}>{value}</dd></div>
}
