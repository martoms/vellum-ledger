'use client'

import { formatMoney, getCategoryBreakdown, getSummary } from '@/features/transactions/selectors'
import { PageHeading } from '@/features/workspace/page-heading'
import { useLedger } from '@/features/workspace/ledger-provider'

export function ReportsPage() {
  const { selectedMonth, transactions } = useLedger()
  const summary = getSummary(transactions, selectedMonth)
  const categories = getCategoryBreakdown(transactions, selectedMonth)
  const largestExpense = categories[0]?.amountCents || 1
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading eyebrow="Selected month" title="Reports"><p className="text-sm leading-6 text-[var(--vellum-muted)]">A quiet record of what came in, what went out, and where spending landed.</p></PageHeading>
      <dl className="grid gap-3 sm:grid-cols-3"><Metric label="Income" value={formatMoney(summary.incomeCents)} tone="income" /><Metric label="Expenses" value={formatMoney(summary.expenseCents)} tone="expense" /><Metric label="Net balance" value={formatMoney(summary.balanceCents)} /></dl>
      <section className="mt-7 rounded-xl border p-5 md:p-7"><h2 className="font-serif text-3xl">Spending by category</h2><div className="mt-6 space-y-5">{categories.length === 0 ? <p className="text-sm text-[var(--vellum-muted)]">No expenses in this month.</p> : categories.map((category) => { const value = Math.round((category.amountCents / largestExpense) * 100); return <div key={category.id}><div className="flex justify-between gap-4 text-sm"><span>{category.label}<span className="ml-2 text-[var(--vellum-muted)]">{category.count} entries</span></span><span className="font-serif text-base">{formatMoney(category.amountCents)}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--vellum-wash)]" role="progressbar" aria-label={`${category.label} spending`} aria-valuemin={0} aria-valuemax={largestExpense} aria-valuenow={category.amountCents}><div className="h-full rounded-full bg-[var(--vellum-forest)]" style={{ width: `${value}%` }} /></div></div> })}</div></section>
    </div>
  )
}

function Metric({ label, tone, value }: { label: string, tone?: 'income' | 'expense', value: string }) {
  return <div className="rounded-xl border p-5"><dt className="text-[10px] uppercase tracking-[.16em] text-[var(--vellum-muted)]">{label}</dt><dd className={`mt-2 font-serif text-3xl ${tone === 'income' ? 'text-[var(--vellum-income)]' : tone === 'expense' ? 'text-[var(--vellum-expense)]' : ''}`}>{value}</dd></div>
}
