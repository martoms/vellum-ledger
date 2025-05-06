import { MonthSwitcher } from '@/features/workspace/month-switcher'

export function PageHeading({ children, eyebrow, title }: { children?: React.ReactNode, eyebrow: string, title: string }) {
  return (
    <header className="mb-7 border-b pb-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--vellum-muted)]">{eyebrow}</p><h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">{title}</h1></div>
        <MonthSwitcher />
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </header>
  )
}
