// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { TransactionForm } from '@/features/workspace/transaction-form'
import { LedgerProvider, useLedger } from '@/features/workspace/ledger-provider'

function FormHarness() {
  const { transactions } = useLedger()
  return <><output data-testid="transaction-count">{transactions.length}</output><TransactionForm /></>
}

describe('TransactionForm', () => {
  afterEach(cleanup)
  beforeEach(() => window.localStorage.clear())

  it('shows visible validation errors for an empty transaction', () => {
    render(<LedgerProvider><FormHarness /></LedgerProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }))
    expect(screen.getByText('Enter a merchant name.')).toBeTruthy()
    expect(screen.getByText('Enter an amount greater than zero.')).toBeTruthy()
  })

  it('adds a valid transaction to the shared ledger', async () => {
    render(<LedgerProvider><FormHarness /></LedgerProvider>)
    fireEvent.change(screen.getByLabelText('Merchant'), { target: { value: 'Paper & Ink' } })
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '12.50' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }))
    await waitFor(() => expect(screen.getByTestId('transaction-count').textContent).toBe('14'))
  })
})
