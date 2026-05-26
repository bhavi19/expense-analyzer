import { formatCurrency } from './analyzer'
import type { ExpenseAnalysis } from './types'

function findCategoryAmount(analysis: ExpenseAnalysis, keywords: string[]): number {
  return analysis.categories
    .filter((item) =>
      keywords.some((keyword) => item.category.toLowerCase().includes(keyword)),
    )
    .reduce((total, item) => total + item.amount, 0)
}

export function answerQuestion(question: string, analysis: ExpenseAnalysis): string {
  const q = question.toLowerCase().trim()
  const { currencySymbol, totalSpend, categories, budgetRule, dailyAverage } = analysis

  if (!q) {
    return 'Ask me something like "How can I save ₹3000 this month?" or "Where am I overspending?"'
  }

  if (/save|cut|reduce|lower/.test(q)) {
    const amountMatch = q.match(/([\d,]+)/)
    const target = amountMatch ? Number.parseFloat(amountMatch[1].replace(/,/g, '')) : 3000

    const dining = findCategoryAmount(analysis, ['dining'])
    const shopping = findCategoryAmount(analysis, ['shopping'])
    const entertainment = findCategoryAmount(analysis, ['entertainment', 'subscription', 'travel'])

    const suggestions: string[] = []
    if (dining > 0) suggestions.push(`Reduce dining out by 40% → save ~${formatCurrency(dining * 0.4, currencySymbol)}`)
    if (shopping > 0) suggestions.push(`Cut discretionary shopping by 30% → save ~${formatCurrency(shopping * 0.3, currencySymbol)}`)
    if (entertainment > 0) suggestions.push(`Trim entertainment/subscriptions by 25% → save ~${formatCurrency(entertainment * 0.25, currencySymbol)}`)

    const totalPossible = dining * 0.4 + shopping * 0.3 + entertainment * 0.25
    if (totalPossible >= target) {
      return `To save ${formatCurrency(target, currencySymbol)}, try:\n• ${suggestions.join('\n• ')}\nCombined, these changes could free up ~${formatCurrency(totalPossible, currencySymbol)}/month.`
    }

    return `To reach ${formatCurrency(target, currencySymbol)}, focus on wants first:\n• ${suggestions.join('\n• ') || 'Review subscriptions and impulse purchases'}\nYou may also need a temporary cap on non-essential categories.`
  }

  if (/overspend|too much|where.*spend|biggest|highest/.test(q)) {
    const top3 = categories.slice(0, 3)
    return `Your top spending areas:\n${top3
      .map(
        (item, index) =>
          `${index + 1}. ${item.category}: ${formatCurrency(item.amount, currencySymbol)} (${item.percentage.toFixed(1)}%)`,
      )
      .join('\n')}\nStart with #1 for the fastest impact.`
  }

  if (/50.?30.?20|budget rule|needs|wants|savings/.test(q)) {
    return budgetRule
      .map(
        (item) =>
          `${item.label}: ${item.actualPercent.toFixed(1)}% actual vs ${item.idealPercent}% ideal (${item.delta > 0 ? '+' : ''}${formatCurrency(item.delta, currencySymbol)})`,
      )
      .join('\n')
  }

  if (/daily|per day|average/.test(q)) {
    return `You spend about ${formatCurrency(dailyAverage, currencySymbol)}/day on average (${formatCurrency(totalSpend, currencySymbol)} over ~30 days).`
  }

  if (/total|monthly|spend all/.test(q)) {
    return `Your total monthly spend is ${formatCurrency(totalSpend, currencySymbol)} across ${categories.length} categories.`
  }

  if (/subscription|netflix|gym/.test(q)) {
    const subs = categories.find((item) => item.category === 'Subscriptions')
    if (!subs) return 'No subscription expenses detected. Add items like Netflix, Gym, etc. to track them.'
    return `Subscriptions total ${formatCurrency(subs.amount, currencySymbol)} (${subs.percentage.toFixed(1)}% of spend). Review each one — cancel anything unused in the last month.`
  }

  if (/food|grocer|dining|eat/.test(q)) {
    const groceries = categories.find((item) => item.category === 'Food & Groceries')
    const dining = categories.find((item) => item.category === 'Dining Out')
    return [
      groceries ? `Groceries: ${formatCurrency(groceries.amount, currencySymbol)}` : null,
      dining ? `Dining out: ${formatCurrency(dining.amount, currencySymbol)}` : null,
      'Tip: Meal planning usually cuts food costs 15–25%.',
    ]
      .filter(Boolean)
      .join('\n')
  }

  return `Based on your data (${formatCurrency(totalSpend, currencySymbol)} total), try asking:\n• "How can I save ₹3000?"\n• "Where am I overspending?"\n• "How does my 50/30/20 split look?"\n• "What's my daily average?"`
}
