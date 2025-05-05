export type CategoryId =
  | 'groceries'
  | 'transport'
  | 'dining'
  | 'shopping'
  | 'income'
  | 'education'
  | 'subscriptions'
  | 'health'
  | 'transfers'
  | 'home'

export type TransactionKind = 'income' | 'expense'

export type Category = {
  id: CategoryId
  label: string
  iconKey: string
  kind: TransactionKind
}

export type Transaction = {
  id: string
  merchant: string
  amountCents: number
  categoryId: CategoryId
  occurredOn: string
  notes?: string
}

export type CreateTransactionPayload = Omit<Transaction, 'id'>

export type TransactionFilters = {
  month?: string
  search?: string
  categoryId?: CategoryId | 'all'
}

export type TransactionSummary = {
  incomeCents: number
  expenseCents: number
  balanceCents: number
  count: number
}

export type CategoryBreakdown = Category & {
  amountCents: number
  count: number
}
