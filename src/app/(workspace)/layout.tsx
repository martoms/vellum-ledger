import { LedgerProvider } from '@/features/workspace/ledger-provider'
import { WorkspaceShell } from '@/features/workspace/workspace-shell'

export default function WorkspaceLayout({ children }: LayoutProps<'/'>) {
  return <LedgerProvider><WorkspaceShell>{children}</WorkspaceShell></LedgerProvider>
}
