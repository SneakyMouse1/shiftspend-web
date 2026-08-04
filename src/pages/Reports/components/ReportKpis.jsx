import { ArrowUpRight, ArrowDownRight, PiggyBank, Zap } from "lucide-react";
import { formatCurrency } from "@/config/currencies";

export default function ReportKpis({ metrics, primaryCurrency, formattedDateRange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Income</span>
          <div className="h-8 w-8 rounded-xl bg-income/10 flex items-center justify-center text-income">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold font-mono text-income tracking-tight">
            {formatCurrency(metrics.income, primaryCurrency)}
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            {formattedDateRange || "Inflow total"}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-income rounded-full" style={{ width: metrics.income > 0 ? "100%" : "0%" }} />
        </div>
      </div>

      {/* Total Expenses */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Expenses</span>
          <div className="h-8 w-8 rounded-xl bg-expense/10 flex items-center justify-center text-expense">
            <ArrowDownRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold font-mono text-expense tracking-tight">
            {formatCurrency(metrics.expenses, primaryCurrency)}
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            {formattedDateRange || "Outflow total"}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-expense rounded-full" style={{ width: metrics.expenses > 0 ? "100%" : "0%" }} />
        </div>
      </div>

      {/* Net Savings & Savings Rate */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Net Savings</span>
          <div className="h-8 w-8 rounded-xl bg-chart-3/10 flex items-center justify-center text-chart-3">
            <PiggyBank className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className={`text-2xl font-extrabold font-mono tracking-tight ${metrics.netSavings >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(metrics.netSavings, primaryCurrency)}
          </h2>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <span>Rate: <strong className="text-foreground font-mono">{metrics.savingsRate}%</strong></span>
            {formattedDateRange && <span>· {formattedDateRange}</span>}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${metrics.savingsRate > 50 ? "bg-income" : "bg-chart-3"}`}
            style={{ width: `${Math.min(100, Math.max(0, metrics.savingsRate))}%` }}
          />
        </div>
      </div>

      {/* Daily Average Spend */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily Avg Spend</span>
          <div className="h-8 w-8 rounded-xl bg-chart-4/10 flex items-center justify-center text-chart-4">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold font-mono text-foreground tracking-tight">
            {formatCurrency(metrics.dailyAverageSpend, primaryCurrency)}
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            {formattedDateRange || "Estimated daily spend"}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-chart-4 rounded-full" style={{ width: "70%" }} />
        </div>
      </div>
    </div>
  );
}
