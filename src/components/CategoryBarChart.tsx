import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/analyzer'
import type { ExpenseAnalysis } from '../lib/types'

interface CategoryBarChartProps {
  analysis: ExpenseAnalysis
}

export function CategoryBarChart({ analysis }: CategoryBarChartProps) {
  const data = analysis.categories.map((item) => ({
    name: item.category.length > 14 ? `${item.category.slice(0, 12)}…` : item.category,
    fullName: item.category,
    amount: item.amount,
    color: item.color,
  }))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-1 text-lg font-medium text-white">Category Comparison</h3>
      <p className="mb-4 text-sm text-gray-500">All spending categories side by side</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={60}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${analysis.currencySymbol}${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              formatter={(value, _name, props) => [
                formatCurrency(Number(value), analysis.currencySymbol),
                props.payload.fullName,
              ]}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.fullName} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
