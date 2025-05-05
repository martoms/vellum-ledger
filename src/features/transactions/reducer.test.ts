import { describe, expect, it } from 'vitest'
import { transactionReducer } from './reducer'
import { seedTransactions } from './seed'

describe('transactionReducer', () => {
  it('adds, updates, and removes transactions while preserving existing state', () => {
    const original = [seedTransactions[0]]
    const created = { ...seedTransactions[1], id: 'new', occurredOn: '2025-05-28' }
    const added = transactionReducer(original, { type: 'add', payload: created })

    expect(added.map((transaction) => transaction.id)).toEqual(['new', 'seed-01'])
    expect(original).toEqual([seedTransactions[0]])

    const edited = { ...created, merchant: 'Updated merchant', amountCents: 500, occurredOn: '2025-05-01' }
    const updated = transactionReducer(added, { type: 'update', payload: edited })

    expect(updated).toEqual([seedTransactions[0], edited])
    expect(added[0]).toEqual(created)
    expect(transactionReducer(updated, { type: 'remove', payload: 'new' })).toEqual(original)
  })

  it('replaces with a sorted copy and supports an empty ledger', () => {
    const replacement = [seedTransactions[1], seedTransactions[0]]
    const replaced = transactionReducer([], { type: 'replace', payload: replacement })

    expect(replaced).toEqual([seedTransactions[0], seedTransactions[1]])
    expect(replaced).not.toBe(replacement)
    expect(transactionReducer(replaced, { type: 'replace', payload: [] })).toEqual([])
  })
})
