export type BudgetBucket = 'needs' | 'wants' | 'savings'

export type ExpenseCategory =
  | 'Housing'
  | 'Food & Groceries'
  | 'Transport'
  | 'Utilities'
  | 'Healthcare'
  | 'Insurance'
  | 'Entertainment'
  | 'Dining Out'
  | 'Shopping'
  | 'Subscriptions'
  | 'Travel'
  | 'Education'
  | 'Savings & Investments'
  | 'Other'

export interface Expense {
  id: string
  name: string
  amount: number
  category: ExpenseCategory
  bucket: BudgetBucket
}

export interface CategorySummary {
  category: ExpenseCategory
  amount: number
  percentage: number
  color: string
}

export interface BudgetRuleSummary {
  bucket: BudgetBucket
  label: string
  actual: number
  actualPercent: number
  idealPercent: number
  idealAmount: number
  delta: number
}

export interface ExpenseAnalysis {
  expenses: Expense[]
  totalSpend: number
  dailyAverage: number
  biggestExpense: Expense | null
  categoryCount: number
  categories: CategorySummary[]
  budgetRule: BudgetRuleSummary[]
  currencySymbol: string
}

export interface Insight {
  id: string
  type: 'warning' | 'success' | 'info' | 'tip'
  title: string
  body: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}
