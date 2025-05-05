import { isCategoryId } from './categories'
import type { Transaction } from './types'

export const STORAGE_KEY = 'vellum.transactions.v1'
export const STORAGE_VERSION = 1

export type TransactionStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isIsoDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const isTransaction = (value: unknown): value is Transaction =>
  isRecord(value) &&
  typeof value.id === 'string' && value.id.trim().length > 0 &&
  typeof value.merchant === 'string' && value.merchant.trim().length > 0 &&
  typeof value.amountCents === 'number' && Number.isSafeInteger(value.amountCents) && value.amountCents > 0 &&
  isCategoryId(value.categoryId) && isIsoDate(value.occurredOn) &&
  (value.notes === undefined || typeof value.notes === 'string')

export const parseTransactions = (raw: string | null): Transaction[] | null => {
  if (raw === null) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.transactions)) return null
    if (!parsed.transactions.every(isTransaction)) return null
    if (new Set(parsed.transactions.map((transaction) => transaction.id)).size !== parsed.transactions.length) return null

    return parsed.transactions
  } catch {
    return null
  }
}

export const serializeTransactions = (transactions: readonly Transaction[]): string =>
  JSON.stringify({ version: STORAGE_VERSION, transactions })

const getBrowserStorage = (): TransactionStorage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export const loadTransactions = (storage: TransactionStorage | undefined = getBrowserStorage()): Transaction[] | null => {
  try {
    return storage ? parseTransactions(storage.getItem(STORAGE_KEY)) : null
  } catch {
    return null
  }
}

export const saveTransactions = (
  transactions: readonly Transaction[],
  storage: TransactionStorage | undefined = getBrowserStorage(),
): boolean => {
  try {
    if (!storage) return false
    storage.setItem(STORAGE_KEY, serializeTransactions(transactions))
    return true
  } catch {
    return false
  }
}

export const clearTransactions = (storage: TransactionStorage | undefined = getBrowserStorage()): boolean => {
  try {
    if (!storage) return false
    storage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
