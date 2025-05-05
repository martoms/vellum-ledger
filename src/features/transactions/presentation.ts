export function formatLedgerDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${isoDate}T12:00:00`))
}

export function formatMonth(month: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
    .format(new Date(`${month}-01T12:00:00`))
}

export function getMonthOffset(month: string, offset: number) {
  const date = new Date(`${month}-01T12:00:00`)
  date.setMonth(date.getMonth() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatAmountInput(amountCents: number) {
  return (amountCents / 100).toFixed(2)
}

export function parseAmountToCents(value: string) {
  const amount = Number(value)
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0
}
