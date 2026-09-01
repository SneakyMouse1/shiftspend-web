import { ArrowUpRight, ArrowDownRight, PiggyBank, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/config/currencies";
import { useTranslation } from "@/hooks/useLanguage";

function DeltaBadge({ delta, invertColor = false }) {
  if (!delta || !delta.percent) {
    return null;
  }

  const isUp = delta.trend === "up";
  const isPositive = invertColor ? !isUp : isUp;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all ${
        isPositive
          ? "bg-income/10 text-income border-income/20"
          : "bg-expense/10 text-expense border-expense/20"
      }`}
      title={`${delta.diff > 0 ? "+" : ""}${delta.diff} vs previous period`}
    >
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      <span>{delta.text}</span>
    </span>
  );
}

export default function ReportKpis({ metrics, primaryCurrency, formattedDateRange, deltas }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("reports.kpis.totalIncome")}</span>
          <div className="h-8 w-8 rounded-xl bg-income/10 flex items-center justify-center text-income">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-extrabold font-mono text-income tracking-tight">
              {formatCurrency(metrics.income, primaryCurrency)}
            </h2>
            {deltas?.income && <DeltaBadge delta={deltas.income} />}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {formattedDateRange || t("dashboard.inflow")}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-income rounded-full" style={{ width: metrics.income > 0 ? "100%" : "0%" }} />
        </div>
      </div>

      {/* Total Expenses */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("reports.kpis.totalExpenses")}</span>
          <div className="h-8 w-8 rounded-xl bg-expense/10 flex items-center justify-center text-expense">
            <ArrowDownRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-extrabold font-mono text-expense tracking-tight">
              {formatCurrency(metrics.expenses, primaryCurrency)}
            </h2>
            {deltas?.expenses && <DeltaBadge delta={deltas.expenses} invertColor={true} />}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {formattedDateRange || t("dashboard.outflow")}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-expense rounded-full" style={{ width: metrics.expenses > 0 ? "100%" : "0%" }} />
        </div>
      </div>

      {/* Net Savings & Savings Rate */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("reports.kpis.netSavings")}</span>
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <PiggyBank className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h2 className={`text-2xl font-extrabold font-mono tracking-tight ${metrics.netSavings >= 0 ? "text-income" : "text-expense"}`}>
              {formatCurrency(metrics.netSavings, primaryCurrency)}
            </h2>
            {deltas?.netSavings && <DeltaBadge delta={deltas.netSavings} />}
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <span>{t("reports.kpis.savingsRate")}: <strong className="text-foreground font-mono">{metrics.savingsRate}%</strong></span>
            {formattedDateRange && <span>· {formattedDateRange}</span>}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${metrics.savingsRate > 50 ? "bg-emerald-400" : "bg-cyan-400"}`}
            style={{ width: `${Math.min(100, Math.max(0, metrics.savingsRate))}%` }}
          />
        </div>
      </div>

      {/* Daily Average Spend */}
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("reports.kpis.dailyAvgSpend")}</span>
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-extrabold font-mono text-foreground tracking-tight">
              {formatCurrency(metrics.dailyAverageSpend, primaryCurrency)}
            </h2>
            {deltas?.dailyAverageSpend && <DeltaBadge delta={deltas.dailyAverageSpend} invertColor={true} />}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {formattedDateRange || t("reports.kpis.dailyAvgSpend")}
          </p>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: metrics.dailyAverageSpend > 0 ? "100%" : "0%" }} />
        </div>
      </div>
    </div>
  );
}
