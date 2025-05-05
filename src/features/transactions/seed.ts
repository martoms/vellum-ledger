import type { Transaction } from './types'

export const initialMonth = '2025-05'

export const seedTransactions: Transaction[] = [
  { id: 'seed-01', merchant: 'Whole Foods Market', amountCents: 8624, categoryId: 'groceries', occurredOn: '2025-05-27' },
  { id: 'seed-02', merchant: 'Metro Transit', amountCents: 275, categoryId: 'transport', occurredOn: '2025-05-26' },
  { id: 'seed-03', merchant: 'Prima Coffee', amountCents: 540, categoryId: 'dining', occurredOn: '2025-05-25' },
  { id: 'seed-04', merchant: 'Everlane', amountCents: 12800, categoryId: 'shopping', occurredOn: '2025-05-24' },
  { id: 'seed-05', merchant: 'Salary', amountCents: 320000, categoryId: 'income', occurredOn: '2025-05-23' },
  { id: 'seed-06', merchant: 'Riverside Books', amountCents: 2499, categoryId: 'education', occurredOn: '2025-05-22' },
  { id: 'seed-07', merchant: 'Apple', amountCents: 999, categoryId: 'subscriptions', occurredOn: '2025-05-21' },
  { id: 'seed-08', merchant: 'Hawthorn Fitness', amountCents: 4800, categoryId: 'health', occurredOn: '2025-05-20' },
  { id: 'seed-09', merchant: 'Elm Apothecary', amountCents: 2316, categoryId: 'health', occurredOn: '2025-05-19' },
  { id: 'seed-10', merchant: 'Taco Verde', amountCents: 1850, categoryId: 'dining', occurredOn: '2025-05-18' },
  { id: 'seed-11', merchant: 'City Market', amountCents: 7231, categoryId: 'groceries', occurredOn: '2025-05-17' },
  { id: 'seed-12', merchant: 'Transfer to Savings', amountCents: 25000, categoryId: 'transfers', occurredOn: '2025-05-16' },
  { id: 'seed-13', merchant: 'Northside Utilities', amountCents: 11386, categoryId: 'home', occurredOn: '2025-05-15' },
]
