import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vellum Ledger',
  description: 'A calm, local-first ledger for everyday money',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
