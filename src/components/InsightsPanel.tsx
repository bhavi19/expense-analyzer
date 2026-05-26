import { AlertCircle, Sparkles } from 'lucide-react'
import type { Insight } from '../lib/types'

interface InsightsPanelProps {
  insights: Insight[]
}

const TYPE_STYLES: Record<Insight['type'], string> = {
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  tip: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-400" />
        <div>
          <h3 className="text-lg font-medium text-white">AI Insights</h3>
          <p className="text-sm text-gray-500">Personalized tips based on your spending</p>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-xl border p-4 ${TYPE_STYLES[insight.type]}`}
          >
            <div className="mb-1 font-medium">{insight.title}</div>
            <p className="text-sm leading-relaxed opacity-90">{insight.body}</p>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 p-4 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            Add expenses to generate insights.
          </div>
        )}
      </div>
    </div>
  )
}
