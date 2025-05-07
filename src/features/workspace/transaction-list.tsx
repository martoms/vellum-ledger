'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionCategoryIcon } from '@/components/transaction-category-icon'
import { getCategory } from '@/features/transactions/categories'
import { formatLedgerDate } from '@/features/transactions/presentation'
import { formatSignedAmount } from '@/features/transactions/selectors'
import type { Transaction } from '@/features/transactions/types'

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onRemove: (id: string) => void
}

export function TransactionList({ onEdit, onRemove, transactions }: TransactionListProps) {
  if (transactions.length === 0) return <EmptyLedger />

  return (
    <>
      <div className="ledger-corner hidden overflow-x-auto border-y md:block">
        <table className="min-w-full table-fixed border-collapse text-left">
          <thead className="border-b border-[var(--vellum-line-strong)]">
            <tr className="h-10 text-[10px] uppercase tracking-[0.16em] text-[var(--vellum-muted)]">
              <th className="w-[22%] pl-6 font-medium lg:pl-11">Date</th>
              <th className="w-[28%] border-l px-3 font-medium lg:px-6">Merchant</th>
              <th className="w-[29%] border-l px-3 font-medium lg:px-6">Category</th>
              <th className="w-[21%] border-l px-3 text-right font-medium lg:px-5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} onEdit={onEdit} onRemove={onRemove} />)}
          </tbody>
        </table>
      </div>
      <ol className="space-y-2 md:hidden" aria-label="Transactions">
        {transactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} onEdit={onEdit} onRemove={onRemove} />)}
      </ol>
    </>
  )
}

function TransactionRow({ onEdit, onRemove, transaction }: Omit<TransactionListProps, 'transactions'> & { transaction: Transaction }) {
  const category = getCategory(transaction.categoryId)
  const income = category.kind === 'income'
  return (
    <tr className="group h-[58px] border-b text-sm lg:text-[15px]">
      <td className="whitespace-nowrap pl-6 font-serif lg:pl-11">{formatLedgerDate(transaction.occurredOn)}</td>
      <td className="whitespace-nowrap border-l px-3 font-serif lg:px-6">{transaction.merchant}</td>
      <td className="border-l px-3 lg:px-6">
        <span className="flex items-center gap-2 whitespace-nowrap font-serif lg:gap-3"><TransactionCategoryIcon categoryId={transaction.categoryId} className="size-4 lg:size-[18px]" />{category.label}</span>
      </td>
      <td className="border-l px-3 text-right font-serif lg:px-5">
        <span className={income ? 'text-[var(--vellum-income)]' : 'text-[var(--vellum-expense)]'}><span className="sr-only">{income ? 'Income ' : 'Expense '}</span>{formatSignedAmount(transaction)}</span>
        <span className="ml-2 hidden gap-1 align-middle group-hover:inline-flex focus-within:inline-flex">
          <Button aria-label={`Edit ${transaction.merchant}`} variant="ghost" size="icon" className="size-7" onClick={() => onEdit(transaction)}><Pencil aria-hidden className="size-3.5" /></Button>
          <Button aria-label={`Delete ${transaction.merchant}`} variant="ghost" size="icon" className="size-7 text-[var(--vellum-expense)]" onClick={() => onRemove(transaction.id)}><Trash2 aria-hidden className="size-3.5" /></Button>
        </span>
      </td>
    </tr>
  )
}

function TransactionCard({ onEdit, onRemove, transaction }: Omit<TransactionListProps, 'transactions'> & { transaction: Transaction }) {
  const category = getCategory(transaction.categoryId)
  const income = category.kind === 'income'
  return (
    <li className="rounded-lg border bg-[var(--vellum-paper)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vellum-wash)]"><TransactionCategoryIcon categoryId={transaction.categoryId} className="size-5" /></span>
          <div className="min-w-0">
            <p className="truncate font-serif text-lg leading-5">{transaction.merchant}</p>
            <p className="mt-1 text-xs text-[var(--vellum-muted)]">{formatLedgerDate(transaction.occurredOn)} · {category.label}</p>
          </div>
        </div>
        <span className={`shrink-0 font-serif text-lg ${income ? 'text-[var(--vellum-income)]' : 'text-[var(--vellum-expense)]'}`}><span className="sr-only">{income ? 'Income ' : 'Expense '}</span>{formatSignedAmount(transaction)}</span>
      </div>
      <div className="mt-3 flex justify-end gap-1 border-t pt-2">
        <Button variant="ghost" size="small" onClick={() => onEdit(transaction)}><Pencil aria-hidden className="size-3.5" />Edit</Button>
        <Button variant="ghost" size="small" className="text-[var(--vellum-expense)]" onClick={() => onRemove(transaction.id)}><Trash2 aria-hidden className="size-3.5" />Delete</Button>
      </div>
    </li>
  )
}

function EmptyLedger() {
  return <div className="rounded-lg border border-dashed p-10 text-center"><p className="font-serif text-2xl">No entries found</p><p className="mt-2 text-sm text-[var(--vellum-muted)]">Try another filter or add your first transaction.</p></div>
}
