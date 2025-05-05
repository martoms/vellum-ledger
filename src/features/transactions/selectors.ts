import { categories, getCategory } from './categories'
import type { CategoryBreakdown, Transaction, TransactionFilters, TransactionSummary } from './types'

export const sortTransactions = (transactions: readonly Transaction[]): Transaction[] =>
  [...transactions].sort((first, second) =>
    second.occurredOn.localeCompare(first.occurredOn) ||
    first.merchant.localeCompare(second.merchant) ||
    first.id.localeCompare(second.id),
  )

export const selectTransactions = (
  transactions: readonly Transaction[],
  { month, search = '', categoryId = 'all' }: TransactionFilters = {},
): Transaction[] => {
  const query = search.trim().toLocaleLowerCase('en-US')

  return sortTransactions(transactions.filter((transaction) =>
    (!month || transaction.occurredOn.slice(0, 7) === month) &&
    (categoryId === 'all' || transaction.categoryId === categoryId) &&
    (!query || `${transaction.merchant} ${transaction.notes ?? ''}`.toLocaleLowerCase('en-US').includes(query)),
  ))
}

export const getSummary = (
  transactions: readonly Transaction[],
  month?: string,
): TransactionSummary => {
  const selected = selectTransactions(transactions, { month })
  const incomeCents = selected.reduce((total, transaction) =>
    total + (getCategory(transaction.categoryId).kind === 'income' ? transaction.amountCents : 0), 0)
  const expenseCents = selected.reduce((total, transaction) =>
    total + (getCategory(transaction.categoryId).kind === 'expense' ? transaction.amountCents : 0), 0)

  return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents, count: selected.length }
}

export const getCategoryBreakdown = (
  transactions: readonly Transaction[],
  month?: string,
): CategoryBreakdown[] => {
  const selected = selectTransactions(transactions, { month })

  return categories.filter((category) => category.kind === 'expense').map((category) => {
    const matching = selected.filter((transaction) => transaction.categoryId === category.id)

    return {
      ...category,
      amountCents: matching.reduce((total, transaction) => total + transaction.amountCents, 0),
      count: matching.length,
    }
  }).filter((category) => category.count > 0)
    .sort((first, second) => second.amountCents - first.amountCents || first.label.localeCompare(second.label))
}

export const formatMoney = (amountCents: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountCents / 100)

export const formatSignedAmount = (transaction: Transaction): string =>
  `${getCategory(transaction.categoryId).kind === 'income' ? '+' : '-'}${formatMoney(transaction.amountCents)}`
