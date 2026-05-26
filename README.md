# Expense Analyzer

An AI-powered monthly expense analyzer. Paste your spending in any format and get rich visuals, budget insights, and actionable savings advice.

## Features

- **Smart parsing** — accepts `Name: Amount`, `Coffee 250`, tab-separated, and more
- **Metric cards** — total spend, daily average, biggest expense, category count
- **Donut chart** — spending breakdown by category
- **Bar chart** — side-by-side category comparison
- **50/30/20 rule** — Needs / Wants / Savings vs ideal budget
- **AI insights** — personalized tips based on your data
- **Follow-up chat** — ask things like "How can I save ₹3000 this month?"

## Quick start

```bash
cd expense-analyzer
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

1. Paste your monthly expenses (one per line)
2. Click **Analyze Expenses** or load the sample data
3. Explore charts, insights, and ask follow-up questions

Example input:

```
Rent: 18000
Groceries: 6500
Swiggy: 4200
Netflix: 649
SIP Investment: 5000
```

## Ideas to add next

- Month-over-month comparison
- Savings goal tracker
- Budget limit alerts
- CSV/Excel import
- "What if" simulator
- Recurring vs one-time tagging
- Export to PDF

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Recharts
- Lucide icons
