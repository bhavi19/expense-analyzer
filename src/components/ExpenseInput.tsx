import { Sparkles, Wand2 } from 'lucide-react'
import { SAMPLE_EXPENSES } from '../lib/expenseParser'

interface ExpenseInputProps {
  value: string
  onChange: (value: string) => void
  onAnalyze: () => void
  parseErrors: string[]
  loading: boolean
}

export function ExpenseInput({
  value,
  onChange,
  onAnalyze,
  parseErrors,
  loading,
}: ExpenseInputProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-medium text-white">Paste your monthly expenses</h2>
          </div>
          <p className="text-sm text-gray-500">
            Any format works — try <code className="text-emerald-400/80">Name: Amount</code> or{' '}
            <code className="text-emerald-400/80">Coffee 250</code>
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(SAMPLE_EXPENSES)}
          className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition hover:border-emerald-500/30 hover:text-emerald-300"
        >
          Load sample
        </button>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        placeholder={`Rent: 18000\nGroceries: 6500\nSwiggy: 3200\nNetflix: 649\nSIP: 5000`}
        className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-emerald-500/40"
      />

      {parseErrors.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
          <p className="mb-1 font-medium">Could not parse some lines:</p>
          <ul className="list-inside list-disc text-amber-200/80">
            {parseErrors.slice(0, 3).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={!value.trim() || loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-40 sm:w-auto sm:px-8"
      >
        <Wand2 className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
        {loading ? 'Analyzing...' : 'Analyze Expenses'}
      </button>
    </div>
  )
}
