import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/analyzer'
import type { ExpenseAnalysis } from '../lib/types'

interface BudgetRuleChartProps {
  analysis: ExpenseAnalysis
}

const BUCKET_COLORS = {
  needs: '#10b981',
  wants: '#f59e0b',
  savings: '#3b82f6',
}

export function BudgetRuleChart({ analysis }: BudgetRuleChartProps) {
  const data = analysis.budgetRule.map((item) => ({
    name: item.label,
    actual: item.actualPercent,
    ideal: item.idealPercent,
    actualAmount: item.actual,
    idealAmount: item.idealAmount,
    bucket: item.bucket,
  }))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-1 text-lg font-medium text-white">50/30/20 Budget Rule</h3>
      <p className="mb-4 text-sm text-gray-500">How your spending compares to the ideal split</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 60]}
            />
            <Tooltip
              contentStyle={{
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              formatter={(value, name, props) => {
                const amount =
                  name === 'Actual'
                    ? props.payload.actualAmount
                    : props.payload.idealAmount
                return [
                  `${Number(value).toFixed(1)}% (${formatCurrency(amount, analysis.currencySymbol)})`,
                  name,
                ]
              }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Bar dataKey="actual" name="Actual" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.bucket} fill={BUCKET_COLORS[entry.bucket as keyof typeof BUCKET_COLORS]} />
              ))}
            </Bar>
            <Bar dataKey="ideal" name="Ideal" fill="rgba(255,255,255,0.15)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
