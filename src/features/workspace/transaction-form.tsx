'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { categories } from '@/features/transactions/categories'
import { formatAmountInput, parseAmountToCents } from '@/features/transactions/presentation'
import type { CategoryId } from '@/features/transactions/types'
import { useLedger } from '@/features/workspace/ledger-provider'

type FormState = {
  amount: string
  categoryId: CategoryId
  merchant: string
  notes: string
  occurredOn: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

function makeFormState(transaction: ReturnType<typeof useLedger>['composerTransaction']): FormState {
  return transaction
    ? { amount: formatAmountInput(transaction.amountCents), categoryId: transaction.categoryId, merchant: transaction.merchant, notes: transaction.notes ?? '', occurredOn: transaction.occurredOn }
    : { amount: '', categoryId: 'groceries', merchant: '', notes: '', occurredOn: '2025-05-27' }
}

export function TransactionForm() {
  const { addTransaction, closeComposer, composerTransaction, isComposerOpen, updateTransaction } = useLedger()
  const [form, setForm] = useState<FormState>(makeFormState(composerTransaction))
  const [errors, setErrors] = useState<FormErrors>({})
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (isComposerOpen) {
      setForm(makeFormState(composerTransaction))
      setErrors({})
      setAnnouncement('')
    }
  }, [composerTransaction, isComposerOpen])

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    const amountCents = parseAmountToCents(form.amount)
    if (!form.merchant.trim()) nextErrors.merchant = 'Enter a merchant name.'
    if (amountCents <= 0) nextErrors.amount = 'Enter an amount greater than zero.'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.occurredOn)) nextErrors.occurredOn = 'Choose a valid date.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      merchant: form.merchant.trim(),
      amountCents,
      categoryId: form.categoryId,
      occurredOn: form.occurredOn,
      notes: form.notes.trim() || undefined,
    }

    if (composerTransaction) updateTransaction({ ...payload, id: composerTransaction.id })
    else addTransaction(payload)
    setAnnouncement(composerTransaction ? 'Transaction updated.' : 'Transaction added.')
    window.setTimeout(closeComposer, 180)
  }

  const title = composerTransaction ? 'Edit transaction' : 'Add transaction'

  return (
    <div aria-live="polite">
      <p className="sr-only">{announcement}</p>
      <form className="space-y-4" onSubmit={submit} noValidate>
        <Field label="Date" error={errors.occurredOn}>
          <span className="relative block">
            <Input type="date" value={form.occurredOn} aria-invalid={Boolean(errors.occurredOn)} onChange={(event) => updateField('occurredOn', event.target.value)} />
            <CalendarDays aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
          </span>
        </Field>
        <Field label="Merchant" error={errors.merchant}>
          <Input value={form.merchant} placeholder="e.g. Whole Foods Market" autoComplete="organization" aria-invalid={Boolean(errors.merchant)} onChange={(event) => updateField('merchant', event.target.value)} />
        </Field>
        <Field label="Amount" error={errors.amount}>
          <span className="relative block">
            <DollarSign aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input className="pl-9" inputMode="decimal" value={form.amount} placeholder="0.00" aria-invalid={Boolean(errors.amount)} onChange={(event) => updateField('amount', event.target.value)} />
          </span>
        </Field>
        <Field label="Category">
          <Select value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value as CategoryId)}>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </Select>
          <p className="mt-1 text-xs text-[var(--vellum-muted)]">Income is recorded automatically for the Income category.</p>
        </Field>
        <Field label="Notes">
          <Textarea value={form.notes} placeholder="Add a note (optional)" onChange={(event) => updateField('notes', event.target.value)} />
        </Field>
        <Button className="mt-2 w-full" type="submit">{title}</Button>
      </form>
    </div>
  )
}

function Field({ children, error, label }: { children: React.ReactNode, error?: string, label: string }) {
  return (
    <label className="block font-serif text-base">
      <span>{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {error ? <span className="mt-1 block font-sans text-xs text-[var(--vellum-expense)]">{error}</span> : null}
    </label>
  )
}
