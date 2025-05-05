import { sortTransactions } from './selectors'
import type { Transaction } from './types'

export type TransactionAction =
  | { type: 'add', payload: Transaction }
  | { type: 'update', payload: Transaction }
  | { type: 'remove', payload: string }
  | { type: 'replace', payload: Transaction[] }

export const transactionReducer = (
  state: Transaction[],
  action: TransactionAction,
): Transaction[] => {
  switch (action.type) {
    case 'add':
      return sortTransactions([...state, action.payload])
    case 'update':
      return sortTransactions(state.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction))
    case 'remove':
      return state.filter((transaction) => transaction.id !== action.payload)
    case 'replace':
      return sortTransactions(action.payload)
  }
}
