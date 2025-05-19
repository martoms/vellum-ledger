'use client'

import { useMemo, useState } from 'react'
import { TransactionCategoryIcon } from '@/components/transaction-category-icon'
import { getCategoryBreakdown, selectTransactions, formatMoney } from '@/features/transactions/selectors'
import type { CategoryId } from '@/features/transactions/types'
import { PageHeading } from '@/features/workspace/page-heading'
import { TransactionList } from '@/features/workspace/transaction-list'
import { useLedger } from '@/features/workspace/ledger-provider'

export function CategoriesPage() {
  const { openComposer, removeTransaction, selectedMonth, transactions } = useLedger()
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null)
  const breakdown = getCategoryBreakdown(transactions, selectedMonth)
  const selectedTransactions = useMemo(() => selectTransactions(transactions, { month: selectedMonth, categoryId: activeCategory ?? 'all' }), [activeCategory, selectedMonth, transactions])

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeading eyebrow="Expense map" title="Categories"><p className="text-sm leading-6 text-[var(--vellum-muted)]">Choose a category to inspect its ledger entries.</p></PageHeading>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
        <section aria-label="Category totals" className="rounded-xl border">
          {breakdown.length === 0 ? <p className="p-6 text-sm text-[var(--vellum-muted)]">No spending for this month.</p> : breakdown.map((category) => <button key={category.id} type="button" onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)} className={`focus-ring flex min-h-16 w-full items-center gap-3 border-b px-4 text-left last:border-b-0 ${activeCategory === category.id ? 'bg-[var(--vellum-wash)]' : 'hover:bg-[var(--vellum-wash)]'}`}><span className="grid size-9 place-items-center rounded-full bg-[var(--vellum-paper-deep)]"><TransactionCategoryIcon categoryId={category.id} className="size-4" /></span><span className="min-w-0 flex-1"><span className="block font-serif text-lg">{category.label}</span><span className="text-xs text-[var(--vellum-muted)]">{category.count} {category.count === 1 ? 'entry' : 'entries'}</span></span><span className="font-serif text-lg">{formatMoney(category.amountCents)}</span></button>)}</section>
        <section><h2 className="mb-3 font-serif text-2xl">{activeCategory ? `${breakdown.find((category) => category.id === activeCategory)?.label} entries` : 'All entries'}</h2><TransactionList transactions={selectedTransactions} onEdit={openComposer} onRemove={removeTransaction} /></section>
      </div>
    </div>
  )
}
