import { useMemo, useState } from 'react'
import { PieChart } from 'lucide-react'
import { analyzeExpenses } from './lib/analyzer'
import { parseExpenses } from './lib/expenseParser'
import { generateInsights } from './lib/insights'
import type { ExpenseAnalysis } from './lib/types'
import { BudgetRuleChart } from './components/BudgetRuleChart'
import { CategoryBarChart } from './components/CategoryBarChart'
import { CategoryDonutChart } from './components/CategoryDonutChart'
import { ChatBar } from './components/ChatBar'
import { ExpenseInput } from './components/ExpenseInput'
import { InsightsPanel } from './components/InsightsPanel'
import { MetricCards } from './components/MetricCards'

function App() {
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState<ExpenseAnalysis | null>(null)
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const insights = useMemo(
    () => (analysis ? generateInsights(analysis) : []),
    [analysis],
  )

  function handleAnalyze() {
    setLoading(true)
    window.setTimeout(() => {
      const { expenses, currencySymbol, parseErrors: errors } = parseExpenses(input)
      setParseErrors(errors)

      if (expenses.length === 0) {
        setAnalysis(null)
        setLoading(false)
        return
      }

      setAnalysis(analyzeExpenses(expenses, currencySymbol))
      setLoading(false)
    }, 600)
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
            <PieChart className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Expense Analyzer
            </h1>
            <p className="text-sm text-gray-500">
              AI-powered visuals & insights for your monthly spending
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ExpenseInput
            value={input}
            onChange={setInput}
            onAnalyze={handleAnalyze}
            parseErrors={parseErrors}
            loading={loading}
          />
        </div>

        <div className="space-y-6 lg:col-span-3">
          {analysis ? (
            <>
              <MetricCards analysis={analysis} />
              <div className="grid gap-6 xl:grid-cols-2">
                <CategoryDonutChart analysis={analysis} />
                <CategoryBarChart analysis={analysis} />
              </div>
              <BudgetRuleChart analysis={analysis} />
              <InsightsPanel insights={insights} />
              <ChatBar analysis={analysis} />
            </>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <PieChart className="mb-4 h-12 w-12 text-gray-700" />
              <h3 className="mb-2 text-lg font-medium text-gray-300">Your dashboard appears here</h3>
              <p className="max-w-md text-sm text-gray-500">
                Paste your monthly expenses on the left and hit Analyze. You'll get charts,
                budget breakdowns, and AI-powered savings tips instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
