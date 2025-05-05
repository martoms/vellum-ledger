import type { Category, CategoryId } from './types'

export const categories: readonly Category[] = [
  { id: 'groceries', label: 'Groceries', iconKey: 'shopping-basket', kind: 'expense' },
  { id: 'transport', label: 'Transport', iconKey: 'train-front', kind: 'expense' },
  { id: 'dining', label: 'Dining', iconKey: 'coffee', kind: 'expense' },
  { id: 'shopping', label: 'Shopping', iconKey: 'shopping-bag', kind: 'expense' },
  { id: 'income', label: 'Income', iconKey: 'arrow-down-left', kind: 'income' },
  { id: 'education', label: 'Education', iconKey: 'book-open', kind: 'expense' },
  { id: 'subscriptions', label: 'Subscriptions', iconKey: 'repeat', kind: 'expense' },
  { id: 'health', label: 'Health', iconKey: 'heart-pulse', kind: 'expense' },
  { id: 'transfers', label: 'Transfers', iconKey: 'arrow-left-right', kind: 'expense' },
  { id: 'home', label: 'Home', iconKey: 'house', kind: 'expense' },
]

export const isCategoryId = (value: unknown): value is CategoryId =>
  typeof value === 'string' && categories.some((category) => category.id === value)

export const getCategory = (id: CategoryId): Category =>
  categories.find((category) => category.id === id)!
