'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { transactionReducer } from '@/features/transactions/reducer'
import { initialMonth, seedTransactions } from '@/features/transactions/seed'
import { clearTransactions, loadTransactions, saveTransactions } from '@/features/transactions/storage'
import type { CreateTransactionPayload, Transaction } from '@/features/transactions/types'

type ThemePreference = 'light' | 'dark' | 'system'

type LedgerContextValue = {
  composerTransaction: Transaction | null
  isComposerOpen: boolean
  isHydrated: boolean
  selectedMonth: string
  theme: ThemePreference
  transactions: Transaction[]
  addTransaction: (payload: CreateTransactionPayload) => void
  closeComposer: () => void
  openComposer: (transaction?: Transaction) => void
  removeTransaction: (id: string) => void
  resetDemoData: () => void
  setSelectedMonth: (month: string) => void
  setTheme: (theme: ThemePreference) => void
  updateTransaction: (transaction: Transaction) => void
}

const LedgerContext = createContext<LedgerContextValue | null>(null)
const themeStorageKey = 'vellum.theme.v1'

function getThemePreference(): ThemePreference {
  try {
    const savedTheme = window.localStorage?.getItem(themeStorageKey)
    return savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system' ? savedTheme : 'system'
  } catch {
    return 'system'
  }
}

function saveThemePreference(preference: ThemePreference) {
  try {
    window.localStorage?.setItem(themeStorageKey, preference)
  } catch {
    // A blocked browser storage area should not prevent the active theme from updating.
  }
}

function applyTheme(preference: ThemePreference) {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
  document.documentElement.classList.toggle('dark', preference === 'dark' || (preference === 'system' && prefersDark))
}

function createTransactionId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `vellum-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [transactions, dispatch] = useReducer(transactionReducer, seedTransactions)
  const [selectedMonth, setSelectedMonth] = useState(initialMonth)
  const [theme, setThemeState] = useState<ThemePreference>('system')
  const [isHydrated, setIsHydrated] = useState(false)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [composerTransaction, setComposerTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const stored = loadTransactions()
    if (stored) dispatch({ type: 'replace', payload: stored })
    const preference = getThemePreference()
    setThemeState(preference)
    applyTheme(preference)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    saveTransactions(transactions)
  }, [isHydrated, transactions])

  useEffect(() => {
    if (!isHydrated) return
    applyTheme(theme)
    saveThemePreference(theme)
    const query = window.matchMedia?.('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => {
      if (theme === 'system') applyTheme('system')
    }
    query?.addEventListener('change', syncSystemTheme)
    return () => query?.removeEventListener('change', syncSystemTheme)
  }, [isHydrated, theme])

  const value = useMemo<LedgerContextValue>(() => ({
    transactions,
    selectedMonth,
    theme,
    isHydrated,
    isComposerOpen,
    composerTransaction,
    setSelectedMonth,
    setTheme: setThemeState,
    addTransaction: (payload) => dispatch({ type: 'add', payload: { ...payload, id: createTransactionId() } }),
    updateTransaction: (transaction) => dispatch({ type: 'update', payload: transaction }),
    removeTransaction: (id) => dispatch({ type: 'remove', payload: id }),
    resetDemoData: () => {
      clearTransactions()
      dispatch({ type: 'replace', payload: seedTransactions })
    },
    openComposer: (transaction) => {
      setComposerTransaction(transaction ?? null)
      setIsComposerOpen(true)
    },
    closeComposer: () => {
      setIsComposerOpen(false)
      setComposerTransaction(null)
    },
  }), [composerTransaction, isComposerOpen, isHydrated, selectedMonth, theme, transactions])

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
}

export function useLedger() {
  const context = useContext(LedgerContext)
  if (!context) throw new Error('useLedger must be used inside LedgerProvider')
  return context
}
