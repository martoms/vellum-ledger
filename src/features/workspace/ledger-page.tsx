'use client'

import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { BotanicalSprig } from '@/components/botanical-sprig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { categories } from '@/features/transactions/categories'
import { formatMonth } from '@/features/transactions/presentation'
import { formatMoney, getSummary, selectTransactions } from '@/features/transactions/selectors'
import type { CategoryId } from '@/features/transactions/types'
import { useLedger } from '@/features/workspace/ledger-provider'
import { MonthSwitcher } from '@/features/workspace/month-switcher'
import { TransactionList } from '@/features/workspace/transaction-list'

export function LedgerPage() {
  const { openComposer, removeTransaction, selectedMonth, transactions } = useLedger()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<CategoryId | 'all'>('all')
  const summary = getSummary(transactions, selectedMonth)
  const visibleTransactions = useMemo(() => selectTransactions(transactions, { month: selectedMonth, search, categoryId }), [categoryId, search, selectedMonth, transactions])

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex items-center justify-end border-b pb-4"><MonthSwitcher /></header>
      <section className="relative grid gap-7 overflow-hidden border-b py-7 md:grid-cols-[1fr_auto] md:items-center md:py-5">
        <BotanicalSprig className="pointer-events-none absolute -right-8 top-1 w-48 opacity-20 md:hidden" />
        <div>
          <p className="font-serif text-2xl">{formatMonth(selectedMonth).split(' ')[0]} balance</p>
          <h1 className="mt-1 font-serif text-[clamp(3.4rem,8vw,5.7rem)] leading-[.82] tracking-[-.065em]">{formatMoney(summary.balanceCents)}</h1>
        </div>
        <div className="hidden items-center gap-4 pr-6 md:flex">
          <BotanicalSprig className="w-40 opacity-80" />
          <p className="font-serif text-xl italic leading-6 tracking-wide">Same money.<br />A clearer story.</p>
        </div>
      </section>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <label className="relative min-w-0 flex-1"><span className="sr-only">Search transactions</span><Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--vellum-muted)]" /><Input className="pl-9" value={search} placeholder="Search entries" onChange={(event) => setSearch(event.target.value)} /></label>
          <Select aria-label="Filter by category" className="w-36" value={categoryId} onChange={(event) => setCategoryId(event.target.value as CategoryId | 'all')}><option value="all">All</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</Select>
        </div>
        <Button onClick={() => openComposer()}><Plus aria-hidden className="size-4" />Add transaction</Button>
      </div>
      <TransactionList transactions={visibleTransactions} onEdit={openComposer} onRemove={removeTransaction} />
    </div>
  )
}
