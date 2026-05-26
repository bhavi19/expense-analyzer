import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Layers, TrendingUp, Wallet } from 'lucide-react'
import { formatCurrency } from '../lib/analyzer'
import type { ExpenseAnalysis } from '../lib/types'

interface MetricCardsProps {
  analysis: ExpenseAnalysis
}

interface Metric {
  label: string
  value: string
  sub: string
  icon: LucideIcon
  accent: string
}

export function MetricCards({ analysis }: MetricCardsProps) {
  const { currencySymbol, totalSpend, dailyAverage, biggestExpense, categoryCount } = analysis

  const metrics: Metric[] = [
    {
      label: 'Total Spend',
      value: formatCurrency(totalSpend, currencySymbol),
      sub: 'This month',
      icon: Wallet,
      accent: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    },
    {
      label: 'Daily Average',
      value: formatCurrency(dailyAverage, currencySymbol),
      sub: 'Per day (~30 days)',
      icon: CalendarDays,
      accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    },
    {
      label: 'Biggest Expense',
      value: biggestExpense ? formatCurrency(biggestExpense.amount, currencySymbol) : '—',
      sub: biggestExpense?.name ?? 'No data',
      icon: TrendingUp,
      accent: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
    },
    {
      label: 'Categories',
      value: String(categoryCount),
      sub: 'Spending areas',
      icon: Layers,
      accent: 'from-violet-500/20 to-violet-500/5 border-violet-500/20',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`rounded-2xl border bg-gradient-to-br p-5 ${metric.accent}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">{metric.label}</span>
            <metric.icon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-semibold tracking-tight text-white">{metric.value}</div>
          <div className="mt-1 truncate text-sm text-gray-500">{metric.sub}</div>
        </div>
      ))}
    </div>
  )
}
