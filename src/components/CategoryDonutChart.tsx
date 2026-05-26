import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../lib/analyzer'
import type { ExpenseAnalysis } from '../lib/types'

interface CategoryDonutChartProps {
  analysis: ExpenseAnalysis
}

export function CategoryDonutChart({ analysis }: CategoryDonutChartProps) {
  const data = analysis.categories.map((item) => ({
    name: item.category,
    value: item.amount,
    color: item.color,
    percentage: item.percentage,
  }))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-1 text-lg font-medium text-white">Spending Breakdown</h3>
      <p className="mb-4 text-sm text-gray-500">Share of each category</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="mx-auto h-56 w-56 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                formatter={(value, _name, props) => [
                  `${formatCurrency(Number(value), analysis.currencySymbol)} (${props.payload.percentage.toFixed(1)}%)`,
                  props.payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid flex-1 gap-2 sm:grid-cols-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-gray-300">{item.name}</span>
              <span className="ml-auto text-gray-500">{item.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
