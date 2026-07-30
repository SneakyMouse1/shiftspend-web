import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/config/currencies";

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-3 text-xs shadow-xl space-y-1">
      <p className="font-bold text-muted-foreground">{label}</p>
      <p className="font-mono font-bold text-foreground">{formatCurrency(val)}</p>
    </div>
  );
};

export default function SpendingHabitsTab({
  dayOfWeekData,
  topExpenseTransactions,
  primaryCurrency,
  formattedDateRange,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Day of Week Spending Bar Chart */}
      <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold">Spending by Day of Week</h3>
          <p className="text-xs text-muted-foreground">
            Distribution of expenses {formattedDateRange ? `(${formattedDateRange})` : "across weekdays"}
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayOfWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="amount" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Expense Transactions */}
      <div className="lg:col-span-1 rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold">Largest Expenses</h3>
          <p className="text-xs text-muted-foreground">
            Top expense items {formattedDateRange ? `(${formattedDateRange})` : ""}
          </p>
        </div>

        {topExpenseTransactions.length === 0 ? (
          <p className="text-xs text-muted-foreground py-12 text-center">No expense transactions found</p>
        ) : (
          <div className="space-y-3">
            {topExpenseTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/30"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold truncate">{tx.comment || tx.category?.name || "Expense"}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {tx.date ? format(parseISO(tx.date), "MMM d, yyyy") : ""} · {tx.category?.name || "Uncategorized"}
                  </p>
                </div>
                <span className="font-mono font-bold text-xs text-expense shrink-0 ml-2">
                  -{formatCurrency(tx.amount, tx.currency_code || primaryCurrency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
