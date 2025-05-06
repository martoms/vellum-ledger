import {
  ArrowDownLeft,
  ArrowLeftRight,
  BookOpen,
  Coffee,
  HeartPulse,
  House,
  Repeat2,
  ShoppingBag,
  ShoppingBasket,
  TrainFront,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryId } from '@/features/transactions/types'

const icons: Record<CategoryId, LucideIcon> = {
  groceries: ShoppingBasket,
  transport: TrainFront,
  dining: Coffee,
  shopping: ShoppingBag,
  income: ArrowDownLeft,
  education: BookOpen,
  subscriptions: Repeat2,
  health: HeartPulse,
  transfers: ArrowLeftRight,
  home: House,
}

export function TransactionCategoryIcon({ categoryId, className }: { categoryId: CategoryId, className?: string }) {
  const Icon = icons[categoryId]
  return <Icon aria-hidden className={className} strokeWidth={1.6} />
}
