import { describe, expect, it } from 'vitest'
import { seedTransactions } from './seed'
import { clearTransactions, loadTransactions, parseTransactions, saveTransactions, serializeTransactions, STORAGE_KEY, STORAGE_VERSION } from './storage'
import type { TransactionStorage } from './storage'

const createStorage = (): TransactionStorage => {
  const values = new Map<string, string>()

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value) },
    removeItem: (key) => { values.delete(key) },
  }
}

const stored = (transaction: unknown): string => JSON.stringify({ version: STORAGE_VERSION, transactions: [transaction] })

describe('transaction storage', () => {
  it('round trips valid transactions, including an intentionally empty ledger', () => {
    const storage = createStorage()

    expect(loadTransactions(storage)).toBeNull()
    expect(saveTransactions(seedTransactions, storage)).toBe(true)
    expect(storage.getItem(STORAGE_KEY)).toBe(serializeTransactions(seedTransactions))
    expect(loadTransactions(storage)).toEqual(seedTransactions)
    expect(saveTransactions([], storage)).toBe(true)
    expect(loadTransactions(storage)).toEqual([])
    expect(clearTransactions(storage)).toBe(true)
    expect(loadTransactions(storage)).toBeNull()
  })

  it.each([
    null,
    '{broken',
    'null',
    '[]',
    JSON.stringify({ version: 0, transactions: seedTransactions }),
    JSON.stringify({ version: STORAGE_VERSION, transactions: {} }),
    stored(null),
    stored({ ...seedTransactions[0], id: '' }),
    stored({ ...seedTransactions[0], merchant: 42 }),
    stored({ ...seedTransactions[0], merchant: '   ' }),
    stored({ ...seedTransactions[0], amountCents: 0 }),
    stored({ ...seedTransactions[0], amountCents: -1 }),
    stored({ ...seedTransactions[0], amountCents: 1.5 }),
    stored({ ...seedTransactions[0], amountCents: '8624' }),
    stored({ ...seedTransactions[0], amountCents: Number.MAX_SAFE_INTEGER + 1 }),
    stored({ ...seedTransactions[0], categoryId: 'unknown' }),
    stored({ ...seedTransactions[0], categoryId: 'toString' }),
    stored({ ...seedTransactions[0], occurredOn: '2025-02-30' }),
    stored({ ...seedTransactions[0], occurredOn: '2025-5-27' }),
    stored({ ...seedTransactions[0], occurredOn: 'not-a-date' }),
    stored({ ...seedTransactions[0], notes: 42 }),
    JSON.stringify({ version: STORAGE_VERSION, transactions: [seedTransactions[0], seedTransactions[0]] }),
  ])('returns null for malformed or unsupported stored data: %s', (raw) => {
    expect(parseTransactions(raw)).toBeNull()
  })

  it('handles browser storage errors without throwing', () => {
    const storage: TransactionStorage = {
      getItem: () => { throw new Error('unavailable') },
      setItem: () => { throw new Error('full') },
      removeItem: () => { throw new Error('unavailable') },
    }

    expect(loadTransactions(storage)).toBeNull()
    expect(saveTransactions(seedTransactions, storage)).toBe(false)
    expect(clearTransactions(storage)).toBe(false)
  })
})
