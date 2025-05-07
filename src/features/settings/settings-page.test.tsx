// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { seedTransactions } from '@/features/transactions/seed'
import { serializeTransactions, STORAGE_KEY } from '@/features/transactions/storage'
import { LedgerProvider, useLedger } from '@/features/workspace/ledger-provider'
import { SettingsPage } from '@/features/settings/settings-page'

function Count() {
  const { transactions } = useLedger()
  return <output data-testid="count">{transactions.length}</output>
}

function SettingsHarness() {
  return <LedgerProvider><SettingsPage /><Count /></LedgerProvider>
}

describe('SettingsPage', () => {
  afterEach(cleanup)
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('persists a selected dark theme', async () => {
    render(<SettingsHarness />)
    fireEvent.change(screen.getByLabelText('Theme'), { target: { value: 'dark' } })
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true))
    expect(window.localStorage.getItem('vellum.theme.v1')).toBe('dark')
  })

  it('applies the selected theme when browser storage is unavailable', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => { throw new DOMException('Storage is unavailable') },
    })

    try {
      render(<SettingsHarness />)
      fireEvent.change(screen.getByLabelText('Theme'), { target: { value: 'dark' } })
      await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true))
    } finally {
      if (descriptor) Object.defineProperty(window, 'localStorage', descriptor)
    }
  })

  it('requires confirmation before restoring demo data', async () => {
    window.localStorage.setItem(STORAGE_KEY, serializeTransactions([...seedTransactions, { id: 'extra', merchant: 'Notebook', amountCents: 700, categoryId: 'shopping', occurredOn: '2025-05-28' }]))
    render(<SettingsHarness />)
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('14'))
    fireEvent.click(screen.getByRole('button', { name: 'Restore demo data' }))
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    expect(screen.getByTestId('count').textContent).toBe('14')
    fireEvent.click(screen.getByRole('button', { name: 'Restore data' }))
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('13'))
  })
})
