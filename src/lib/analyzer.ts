import { getCategoryColor } from './categorizer'
import type {
  BudgetRuleSummary,
  CategorySummary,
  Expense,
  ExpenseAnalysis,
} from './types'

const BUDGET_LABELS = {
  needs: 'Needs',
  wants: 'Wants',
  savings: 'Savings',
} as const

const IDEAL_PERCENTAGES = {
  needs: 50,
  wants: 30,
  savings: 20,
} as const

function sumByBucket(expenses: Expense[], bucket: Expense['bucket']): number {
  return expenses
    .filter((expense) => expense.bucket === bucket)
    .reduce((total, expense) => total + expense.amount, 0)
}

function buildCategorySummaries(
  expenses: Expense[],
  totalSpend: number,
): CategorySummary[] {
  const totals = new Map<string, number>()

  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }

  return [...totals.entries()]
    .map(([category, amount]) => ({
      category: category as CategorySummary['category'],
      amount,
      percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
      color: getCategoryColor(category as CategorySummary['category']),
    }))
    .sort((a, b) => b.amount - a.amount)
}

function buildBudgetRule(expenses: Expense[], totalSpend: number): BudgetRuleSummary[] {
  const buckets: Expense['bucket'][] = ['needs', 'wants', 'savings']

  return buckets.map((bucket) => {
    const actual = sumByBucket(expenses, bucket)
    const actualPercent = totalSpend > 0 ? (actual / totalSpend) * 100 : 0
    const idealPercent = IDEAL_PERCENTAGES[bucket]
    const idealAmount = (totalSpend * idealPercent) / 100

    return {
      bucket,
      label: BUDGET_LABELS[bucket],
      actual,
      actualPercent,
      idealPercent,
      idealAmount,
      delta: actual - idealAmount,
    }
  })
}

export function analyzeExpenses(
  expenses: Expense[],
  currencySymbol: string,
  daysInMonth = 30,
): ExpenseAnalysis {
  const totalSpend = expenses.reduce((total, expense) => total + expense.amount, 0)
  const biggestExpense =
    expenses.length > 0
      ? expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max))
      : null

  return {
    expenses,
    totalSpend,
    dailyAverage: totalSpend / daysInMonth,
    biggestExpense,
    categoryCount: new Set(expenses.map((expense) => expense.category)).size,
    categories: buildCategorySummaries(expenses, totalSpend),
    budgetRule: buildBudgetRule(expenses, totalSpend),
    currencySymbol,
  }
}

export function formatCurrency(amount: number, symbol: string): string {
  const formatted = amount.toLocaleString(undefined, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  })
  return `${symbol}${formatted}`
}
