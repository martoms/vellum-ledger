import { describe, expect, it } from 'vitest'
import { seedTransactions } from './seed'
import { formatMoney, formatSignedAmount, getCategoryBreakdown, getSummary, selectTransactions, sortTransactions } from './selectors'
import type { Transaction } from './types'

describe('transaction selectors', () => {
  it('sorts by descending date, then ascending merchant without mutating input', () => {
    const original: Transaction[] = [
      { ...seedTransactions[0], id: 'b', merchant: 'Zulu', occurredOn: '2025-05-28' },
      { ...seedTransactions[0], id: 'a', merchant: 'Alpha', occurredOn: '2025-05-28' },
      { ...seedTransactions[0], id: 'c', occurredOn: '2025-05-27' },
    ]

    expect(sortTransactions(original).map((transaction) => transaction.id)).toEqual(['a', 'b', 'c'])
    expect(original[0].id).toBe('b')
  })

  it('calculates the exact May reference balance and excludes another month', () => {
    const transactions = [...seedTransactions, { ...seedTransactions[4], id: 'june', occurredOn: '2025-06-01' }]

    expect(getSummary(transactions, '2025-05')).toEqual({
      incomeCents: 320000,
      expenseCents: 78320,
      balanceCents: 241680,
      count: 13,
    })
    expect(getSummary(transactions, '2025-04')).toEqual({ incomeCents: 0, expenseCents: 0, balanceCents: 0, count: 0 })
  })

  it('combines month, category, and case insensitive merchant or notes search', () => {
    const transactions = seedTransactions.map((transaction) => ({ ...transaction, notes: transaction.id === 'seed-01' ? 'Weekly pantry' : '' }))

    expect(selectTransactions(transactions, { month: '2025-05', categoryId: 'groceries', search: ' PANTRY ' }).map((transaction) => transaction.id)).toEqual(['seed-01'])
    expect(selectTransactions(transactions, { search: 'metro' }).map((transaction) => transaction.id)).toEqual(['seed-02'])
    expect(selectTransactions(transactions, { month: '2025-06' })).toEqual([])
  })

  it('totals expense categories and orders them by spending', () => {
    const breakdown = getCategoryBreakdown(seedTransactions, '2025-05')

    expect(breakdown[0]).toMatchObject({ id: 'transfers', amountCents: 25000, count: 1 })
    expect(breakdown.find((category) => category.id === 'groceries')).toMatchObject({ amountCents: 15855, count: 2 })
    expect(breakdown.find((category) => category.id === 'health')).toMatchObject({ amountCents: 7116, count: 2 })
    expect(breakdown.some((category) => category.id === 'income')).toBe(false)
    expect(breakdown.reduce((total, category) => total + category.amountCents, 0)).toBe(78320)
  })

  it('formats integer cents as USD and signs income and expense amounts', () => {
    expect(formatMoney(241680)).toBe('$2,416.80')
    expect(formatMoney(1)).toBe('$0.01')
    expect(formatMoney(0)).toBe('$0.00')
    expect(formatMoney(-275)).toBe('-$2.75')
    expect(formatSignedAmount(seedTransactions[0])).toBe('-$86.24')
    expect(formatSignedAmount(seedTransactions[4])).toBe('+$3,200.00')
  })
})
