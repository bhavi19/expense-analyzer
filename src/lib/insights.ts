import { formatCurrency } from './analyzer'
import type { ExpenseAnalysis, Insight } from './types'

export function generateInsights(analysis: ExpenseAnalysis): Insight[] {
  const insights: Insight[] = []
  const { currencySymbol, totalSpend, categories, budgetRule, biggestExpense, dailyAverage } =
    analysis

  if (totalSpend === 0) return insights

  const topCategory = categories[0]
  if (topCategory) {
    insights.push({
      id: 'top-category',
      type: 'info',
      title: `${topCategory.category} is your biggest spend`,
      body: `You spent ${formatCurrency(topCategory.amount, currencySymbol)} (${topCategory.percentage.toFixed(1)}%) here. Review if this aligns with your priorities.`,
    })
  }

  const wants = budgetRule.find((item) => item.bucket === 'wants')
  if (wants && wants.actualPercent > wants.idealPercent + 5) {
    insights.push({
      id: 'wants-over',
      type: 'warning',
      title: 'Wants spending is above the 30% target',
      body: `You're at ${wants.actualPercent.toFixed(1)}% on wants vs the ideal 30%. Cutting ${formatCurrency(Math.max(wants.delta, 0), currencySymbol)} would bring you closer to the 50/30/20 rule.`,
    })
  }

  const savings = budgetRule.find((item) => item.bucket === 'savings')
  if (savings) {
    if (savings.actualPercent >= savings.idealPercent) {
      insights.push({
        id: 'savings-good',
        type: 'success',
        title: 'Strong savings rate',
        body: `You're saving/investing ${savings.actualPercent.toFixed(1)}% of your spend — at or above the 20% benchmark. Keep this up!`,
      })
    } else {
      insights.push({
        id: 'savings-low',
        type: 'warning',
        title: 'Savings below the 20% target',
        body: `Only ${savings.actualPercent.toFixed(1)}% went to savings. Try auto-transferring ${formatCurrency(Math.abs(savings.delta), currencySymbol)} on payday.`,
      })
    }
  }

  const dining = categories.find((item) => item.category === 'Dining Out')
  if (dining && dining.percentage > 12) {
    insights.push({
      id: 'dining-high',
      type: 'tip',
      title: 'Dining out adds up fast',
      body: `${formatCurrency(dining.amount, currencySymbol)} on eating out (${dining.percentage.toFixed(1)}%). Cooking 2–3 more meals at home could save ~${formatCurrency(dining.amount * 0.35, currencySymbol)}/month.`,
    })
  }

  const subscriptions = categories.find((item) => item.category === 'Subscriptions')
  if (subscriptions && subscriptions.amount > 0) {
    insights.push({
      id: 'subscriptions',
      type: 'tip',
      title: 'Audit your subscriptions',
      body: `${formatCurrency(subscriptions.amount, currencySymbol)} on subscriptions. Cancel anything unused for 30+ days — small recurring charges compound.`,
    })
  }

  if (biggestExpense) {
    insights.push({
      id: 'daily-average',
      type: 'info',
      title: `Daily burn: ${formatCurrency(dailyAverage, currencySymbol)}`,
      body: `Your largest single expense is ${biggestExpense.name} at ${formatCurrency(biggestExpense.amount, currencySymbol)}. Total monthly spend: ${formatCurrency(totalSpend, currencySymbol)}.`,
    })
  }

  const needs = budgetRule.find((item) => item.bucket === 'needs')
  if (needs && needs.actualPercent <= needs.idealPercent + 3) {
    insights.push({
      id: 'needs-balanced',
      type: 'success',
      title: 'Essentials are well controlled',
      body: `Needs are at ${needs.actualPercent.toFixed(1)}% — close to the 50% guideline. That gives you room to optimize wants and savings.`,
    })
  }

  return insights.slice(0, 6)
}
