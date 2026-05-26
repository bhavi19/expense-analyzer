import type { BudgetBucket, ExpenseCategory } from './types'

const CATEGORY_RULES: Array<{
  category: ExpenseCategory
  bucket: BudgetBucket
  keywords: string[]
}> = [
  {
    category: 'Housing',
    bucket: 'needs',
    keywords: ['rent', 'mortgage', 'housing', 'home loan', 'maintenance', 'society', 'hoa'],
  },
  {
    category: 'Food & Groceries',
    bucket: 'needs',
    keywords: ['grocery', 'groceries', 'supermarket', 'bigbasket', 'blinkit', 'zepto', 'instamart', 'food mart'],
  },
  {
    category: 'Transport',
    bucket: 'needs',
    keywords: ['fuel', 'petrol', 'diesel', 'uber', 'ola', 'metro', 'bus', 'train', 'cab', 'parking', 'commute', 'rapido'],
  },
  {
    category: 'Utilities',
    bucket: 'needs',
    keywords: ['electric', 'electricity', 'water', 'gas', 'internet', 'wifi', 'broadband', 'mobile', 'phone bill', 'utility'],
  },
  {
    category: 'Healthcare',
    bucket: 'needs',
    keywords: ['doctor', 'hospital', 'pharmacy', 'medicine', 'medical', 'health', 'dental', 'clinic'],
  },
  {
    category: 'Insurance',
    bucket: 'needs',
    keywords: ['insurance', 'premium', 'lic', 'health cover'],
  },
  {
    category: 'Entertainment',
    bucket: 'wants',
    keywords: ['movie', 'cinema', 'game', 'gaming', 'concert', 'spotify', 'entertainment'],
  },
  {
    category: 'Dining Out',
    bucket: 'wants',
    keywords: ['restaurant', 'dining', 'zomato', 'swiggy', 'cafe', 'coffee', 'takeout', 'food delivery', 'dominos', 'pizza'],
  },
  {
    category: 'Shopping',
    bucket: 'wants',
    keywords: ['amazon', 'flipkart', 'myntra', 'shopping', 'clothes', 'clothing', 'shoes', 'mall', 'retail'],
  },
  {
    category: 'Subscriptions',
    bucket: 'wants',
    keywords: ['netflix', 'prime', 'hotstar', 'subscription', 'youtube', 'icloud', 'saas', 'gym'],
  },
  {
    category: 'Travel',
    bucket: 'wants',
    keywords: ['flight', 'hotel', 'travel', 'vacation', 'trip', 'airbnb', 'makemytrip', 'goibibo'],
  },
  {
    category: 'Education',
    bucket: 'needs',
    keywords: ['course', 'tuition', 'school', 'college', 'education', 'udemy', 'coursera', 'books'],
  },
  {
    category: 'Savings & Investments',
    bucket: 'savings',
    keywords: ['savings', 'investment', 'sip', 'mutual fund', 'fd', 'fixed deposit', 'ppf', 'nps', 'emergency fund'],
  },
]

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Housing: '#10b981',
  'Food & Groceries': '#34d399',
  Transport: '#3b82f6',
  Utilities: '#60a5fa',
  Healthcare: '#f472b6',
  Insurance: '#a78bfa',
  Entertainment: '#fbbf24',
  'Dining Out': '#fb923c',
  Shopping: '#f87171',
  Subscriptions: '#c084fc',
  Travel: '#38bdf8',
  Education: '#4ade80',
  'Savings & Investments': '#22d3ee',
  Other: '#94a3b8',
}

export function categorizeExpense(name: string): {
  category: ExpenseCategory
  bucket: BudgetBucket
  color: string
} {
  const normalized = name.toLowerCase().trim()

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        category: rule.category,
        bucket: rule.bucket,
        color: CATEGORY_COLORS[rule.category],
      }
    }
  }

  return {
    category: 'Other',
    bucket: 'wants',
    color: CATEGORY_COLORS.Other,
  }
}

export function getCategoryColor(category: ExpenseCategory): string {
  return CATEGORY_COLORS[category]
}
