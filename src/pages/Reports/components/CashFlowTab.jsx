import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatCompact } from "@/config/currencies";

const AreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-3.5 text-xs shadow-xl space-y-1.5 min-w-36">
      <p className="font-bold text-muted-foreground pb-1 border-b border-border/30">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          </div>
          <span className="font-mono font-bold">{formatCompact(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function CashFlowTab({ timelineData, metrics, primaryCurrency, formattedDateRange }) {
  return (
    <div className="space-y-6">
      {/* Cash Flow Timeline Area Chart */}
      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold">Cash Flow Timeline</h3>
            <p className="text-xs text-muted-foreground">
              Inflow vs Outflow {formattedDateRange ? `(${formattedDateRange})` : "over time"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-income" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-expense" />
              <span>Expense</span>
            </div>
          </div>
        </div>

        {timelineData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-xs text-muted-foreground">
            No transaction data available for the selected filters.
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--income)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--income)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} />
                <Tooltip content={<AreaTooltip />} />
                <Area type="monotone" dataKey="income" stroke="var(--income)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="var(--expense)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Cash Flow Highlights & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border/40 bg-card/60 p-5 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Total Inflow</p>
          <p className="text-xl font-extrabold font-mono text-income">
            {formatCurrency(metrics.income, primaryCurrency)}
          </p>
          <p className="text-[11px] text-muted-foreground">Total money earned</p>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card/60 p-5 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Total Outflow</p>
          <p className="text-xl font-extrabold font-mono text-expense">
            {formatCurrency(metrics.expenses, primaryCurrency)}
          </p>
          <p className="text-[11px] text-muted-foreground">Total money spent</p>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card/60 p-5 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Net Difference</p>
          <p className={`text-xl font-extrabold font-mono ${metrics.netSavings >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(metrics.netSavings, primaryCurrency)}
          </p>
          <p className="text-[11px] text-muted-foreground">Overall Period Balance</p>
        </div>
      </div>
    </div>
  );
}
