import { categorizeExpense } from './categorizer'
import type { Expense } from './types'

const AMOUNT_PATTERN = /(?:₹|rs\.?|inr|\$|€|£)?\s*([\d,]+(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr|\$|€|£)?/i

function detectCurrencySymbol(text: string): string {
  if (/₹|rs\.?|inr/i.test(text)) return '₹'
  if (/\$|usd/i.test(text)) return '$'
  if (/€|eur/i.test(text)) return '€'
  if (/£|gbp/i.test(text)) return '£'
  return '₹'
}

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/,/g, '').trim()
  const value = Number.parseFloat(cleaned)
  return Number.isFinite(value) ? value : 0
}

function createExpense(name: string, amount: number): Expense {
  const { category, bucket } = categorizeExpense(name)
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    amount,
    category,
    bucket,
  }
}

function parseLine(line: string): Expense | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  const separators = [':', '-', '|', '\t']
  for (const separator of separators) {
    if (trimmed.includes(separator)) {
      const [rawName, ...rest] = trimmed.split(separator)
      const amountMatch = rest.join(separator).match(AMOUNT_PATTERN)
      if (rawName && amountMatch) {
        const amount = parseAmount(amountMatch[1])
        if (amount > 0) return createExpense(rawName, amount)
      }
    }
  }

  const trailingAmount = trimmed.match(/^(.+?)\s+([\d,]+(?:\.\d{1,2})?)$/)
  if (trailingAmount) {
    const amount = parseAmount(trailingAmount[2])
    if (amount > 0) return createExpense(trailingAmount[1], amount)
  }

  const leadingAmount = trimmed.match(/^([\d,]+(?:\.\d{1,2})?)\s+(.+)$/)
  if (leadingAmount) {
    const amount = parseAmount(leadingAmount[1])
    if (amount > 0) return createExpense(leadingAmount[2], amount)
  }

  const inlineAmount = trimmed.match(/^(.+?)\s+(?:₹|rs\.?|inr|\$|€|£)\s*([\d,]+(?:\.\d{1,2})?)/i)
  if (inlineAmount) {
    const amount = parseAmount(inlineAmount[2])
    if (amount > 0) return createExpense(inlineAmount[1], amount)
  }

  return null
}

export function parseExpenses(input: string): {
  expenses: Expense[]
  currencySymbol: string
  parseErrors: string[]
} {
  const lines = input.split(/\r?\n/)
  const expenses: Expense[] = []
  const parseErrors: string[] = []
  const currencySymbol = detectCurrencySymbol(input)

  for (const line of lines) {
    const expense = parseLine(line)
    if (expense) {
      expenses.push(expense)
    } else if (line.trim() && !line.trim().startsWith('#')) {
      parseErrors.push(`Could not parse: "${line.trim()}"`)
    }
  }

  return { expenses, currencySymbol, parseErrors }
}

export const SAMPLE_EXPENSES = `Rent: 18000
Groceries: 6500
Electricity: 1200
Internet: 899
Petrol: 3500
Swiggy/Zomato: 4200
Netflix: 649
Amazon shopping: 2800
Gym: 1500
Doctor visit: 800
SIP Investment: 5000
Uber/Ola: 1800
Coffee & cafes: 1200`
