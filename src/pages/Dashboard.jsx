import { useState, useMemo } from "react";
import { format, parseISO, subDays } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, PiggyBank,
  RefreshCcw, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { useAccounts } from "@/hooks/useAccounts";
import { getAccountType } from "@/config/accountTypes";
import { formatCurrency, formatCompact } from "@/config/currencies";



function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-secondary/40 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-64" />
      </div>

      {/* Row 1: 3 equal cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-h-55 rounded-3xl border border-border/40 bg-card/50 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-8 w-32" />
            </div>
            <div className="h-12 flex items-center justify-between gap-4 border-t border-border/30 pt-2">
              <SkeletonBlock className="h-6 w-full" />
              <SkeletonBlock className="h-6 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Chart Area */}
      <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-3 w-64" />
          </div>
          <div className="flex gap-4">
            <SkeletonBlock className="h-4 w-12" />
            <SkeletonBlock className="h-4 w-12" />
          </div>
        </div>
        <SkeletonBlock className="h-65 w-full" />
      </div>

      {/* Row 3: 3 detailed widget cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Categories Skeleton */}
        <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4 h-64">
          <SkeletonBlock className="h-5 w-32" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-4 w-12" />
                </div>
                <SkeletonBlock className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Asset Allocation Skeleton */}
        <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4 h-64">
          <SkeletonBlock className="h-5 w-36" />
          <div className="flex items-center gap-6 pt-2">
            <SkeletonBlock className="h-28 w-28 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
        </div>

        {/* Weekly Pulse Skeleton */}
        <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4 h-64 flex flex-col justify-between">
          <SkeletonBlock className="h-5 w-28" />
          <div className="h-32 flex items-end gap-3 justify-center pb-2">
            {[30, 60, 45, 90, 50, 75, 40].map((h, i) => (
              <SkeletonBlock key={i} className="w-3 rounded" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/40 rounded-xl p-3 text-xs shadow-lg space-y-1.5">
      <p className="font-bold text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-mono font-bold">{formatCompact(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const expense = payload.find((p) => p.dataKey === "expense")?.value ?? 0;
  const income = payload.find((p) => p.dataKey === "income")?.value ?? 0;
  return (
    <div className="bg-card border border-border/40 rounded-xl p-3 text-xs shadow-lg space-y-1.5">
      <p className="font-bold text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-expense shrink-0" />
        <span className="text-muted-foreground">Expense:</span>
        <span className="font-mono font-bold text-expense">{formatCompact(expense)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-income shrink-0" />
        <span className="text-muted-foreground">Income:</span>
        <span className="font-mono font-bold text-income">{formatCompact(income)}</span>
      </div>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-card border border-border/40 rounded-xl p-3 text-xs shadow-lg space-y-1">
      <p className="font-bold">{entry.name}</p>
      <p className="text-muted-foreground">
        <span className="font-mono font-bold text-foreground">{formatCompact(entry.value, entry.payload.currency)}</span>
        {" "}·{" "}
        <span className="font-mono">{entry.payload.percent}%</span>
      </p>
    </div>
  );
};

// Pure helpers — no deps on component state, safe to define at module level
const getTransactionColor = (type) => {
  if (type === "income") return "text-income";
  if (type === "expense") return "text-expense";
  return "text-foreground";
};

const getTransactionPrefix = (type) => {
  if (type === "income") return "+";
  if (type === "expense") return "-";
  return "";
};

// Stable tooltip element references — prevents Recharts from remounting
// the tooltip on every render when content={<Component />} creates a new ref
const AREA_TOOLTIP = <CustomAreaTooltip />;
const BAR_TOOLTIP = <CustomBarTooltip />;
const PIE_TOOLTIP = <CustomPieTooltip />;

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const { data: accounts = [] } = useAccounts();
  const [activeAllocationSlice, setActiveAllocationSlice] = useState(null);

  // Data extracted with safe defaults — works even when data is undefined (loading/error)
  const summary = data?.summary ?? {};

  // Wrapped in useMemo: "?? []" would otherwise create a NEW array on every render,
  // making all downstream useMemo hooks think their deps changed and recomputing needlessly
  const chartRaw = useMemo(() => data?.chart ?? [], [data]);
  const topCategories = useMemo(() => data?.top_categories ?? [], [data]);
  const recentTx = useMemo(() => data?.recent_transactions ?? [], [data]);

  const totalBalance = summary.total_balance ?? 0;
  const monthIncome = summary.month_income ?? 0;
  const monthExpense = summary.month_expense ?? 0;
  const monthSavings = summary.month_savings ?? 0;
  const primaryCurrency = summary.balances?.[0]?.currency_code ?? "EUR";

  // useMemo: these are expensive derivations — recompute only when source data changes,
  // not on every render (e.g. clicking the allocation pie triggers a re-render too)
  // NOTE: all useMemo calls are before early returns — required by Rules of Hooks
  const chartData = useMemo(
    () => chartRaw.map((item) => ({ ...item, label: format(parseISO(item.date), "MMM d") })),
    [chartRaw]
  );

  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { dayStr: format(d, "yyyy-MM-dd"), label: format(d, "EEE") };
    });
    return days.map(({ dayStr, label }) => {
      const found = chartRaw.find((r) => r.date === dayStr);
      return { label, expense: found?.expense ?? 0, income: found?.income ?? 0 };
    });
  }, [chartRaw]);

  const maxWeekly = useMemo(
    () => Math.max(...weeklyData.map((d) => d.expense), 1),
    [weeklyData]
  );

  const allocationData = useMemo(() => {
    const activeAccounts = accounts.filter((a) => !a.is_archived && a.balance > 0);
    const grouped = {};
    for (const acc of activeAccounts) {
      const type = acc.type || "other";
      if (!grouped[type]) grouped[type] = { total: 0, currency: acc.currency_code };
      grouped[type].total += parseFloat(acc.balance);
    }
    const grandTotal = Object.values(grouped).reduce((s, v) => s + v.total, 0) || 1;
    return Object.entries(grouped).map(([type, val]) => {
      const t = getAccountType(type);
      return {
        name: t.label,
        value: val.total,
        percent: Math.round((val.total / grandTotal) * 100),
        color: t.color,
        currency: val.currency,
        type,
      };
    });
  }, [accounts]);

  const topCatTotal = useMemo(
    () => topCategories.reduce((s, c) => s + c.total, 0) || 1,
    [topCategories]
  );

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <p className="text-lg font-bold">Failed to load dashboard</p>
        <p className="text-sm text-muted-foreground">Could not reach the server. Check your connection.</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {summary.period
              ? `${format(parseISO(summary.period.from), "MMM d")} – ${format(parseISO(summary.period.to), "MMM d, yyyy")}`
              : "Your financial overview"}
          </p>
        </div>
      </div>

      {/* Bento Grid — Row 1: 3 equal columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Worth — spans 2 cols */}
        <section className="min-h-55 rounded-3xl border border-border/40 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Net Worth</span>
            <div className="flex items-end gap-3 mt-1">
              <h2 className="text-4xl font-extrabold tracking-tight font-mono glow-balance">
                {formatCurrency(totalBalance, primaryCurrency)}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
            <div className="flex flex-col items-center space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Income</span>
              <div className="text-income font-bold text-base flex items-center gap-0.5 font-mono">
                <ArrowUpRight className="h-4 w-4 shrink-0" />
                {formatCompact(monthIncome, primaryCurrency)}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-0.5 border-x border-border/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expenses</span>
              <div className="text-expense font-bold text-base flex items-center gap-0.5 font-mono">
                <ArrowDownRight className="h-4 w-4 shrink-0" />
                {formatCompact(monthExpense, primaryCurrency)}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Saved</span>
              <div className="text-chart-3 font-bold text-base flex items-center gap-0.5 font-mono">
                <PiggyBank className="h-4 w-4 shrink-0" />
                {formatCompact(monthSavings, primaryCurrency)}
              </div>
            </div>
          </div>
        </section>

        {/* Accounts list */}
        <section className="min-h-55 rounded-3xl border border-border/40 bg-card p-5 shadow-sm flex flex-col gap-2 overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Accounts</span>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-40">
            {accounts.filter((a) => !a.is_archived).slice(0, 5).map((acc) => {
              const Icon = getAccountType(acc.type).icon;
              return (
                <div key={acc.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-semibold truncate">{acc.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold shrink-0">
                    {formatCompact(acc.balance, acc.currency_code)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Transactions mini */}
        <section className="min-h-55 rounded-3xl border border-border/40 bg-card p-5 shadow-sm flex flex-col gap-2 overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</span>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-40">
            {recentTx.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">
                    {tx.comment || tx.category || (tx.type === "transfer" ? "Transfer" : "—")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{tx.account}</p>
                </div>
                <span className={`text-xs font-mono font-bold shrink-0 ${getTransactionColor(tx.type)}`}>
                  {getTransactionPrefix(tx.type)}{formatCompact(tx.amount, tx.currency_code)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bento Grid — Row 2: Area Chart (full width) */}
      <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Income vs Expenses</h2>
            <p className="text-xs text-muted-foreground">Daily activity — last 30 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-income" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-expense" />
              Expenses
            </span>
          </div>
        </div>

        <div className="h-65 w-full">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No chart data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--income)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--income)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => formatCompact(v)} />
                <Tooltip content={AREA_TOOLTIP} />
                <Area type="monotone" dataKey="income" stroke="var(--income)" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="expense" stroke="var(--expense)" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border-t border-border/30 pt-3 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Total Inflow</span>
            <span className="text-income font-bold text-lg font-mono flex items-center gap-0.5">
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              {formatCurrency(monthIncome, primaryCurrency)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Total Outflow</span>
            <span className="text-expense font-bold text-lg font-mono flex items-center gap-0.5">
              <ArrowDownRight className="h-4 w-4 shrink-0" />
              {formatCurrency(monthExpense, primaryCurrency)}
            </span>
          </div>
        </div>
      </section>

      {/* Bento Grid — Row 3: Top Categories + Asset Allocation + Weekly Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Categories */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold">Top Categories</h2>
            <p className="text-xs text-muted-foreground">Biggest expenses this month</p>
          </div>

          {topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No expense data this month</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map((cat, i) => {
                const pct = Math.round((cat.total / topCatTotal) * 100);
                const hue = [0, 30, 200, 270, 140][i % 5];
                const color = `hsl(${hue}, 70%, 60%)`;
                return (
                  <div key={cat.category ?? i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold truncate max-w-35">{cat.category ?? "Uncategorized"}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground font-mono">{pct}%</span>
                        <span className="font-mono font-bold">{formatCompact(cat.total, primaryCurrency)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Asset Allocation */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold">Asset Allocation</h2>
            <p className="text-xs text-muted-foreground">Portfolio distribution by account type</p>
          </div>

          {allocationData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No accounts with balance</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative h-35 w-35 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                      onClick={(_, index) =>
                        setActiveAllocationSlice(activeAllocationSlice === index ? null : index)
                      }
                      stroke="none"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={activeAllocationSlice === null || activeAllocationSlice === index ? 1 : 0.3}
                          style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={PIE_TOOLTIP} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total</span>
                  <span className="text-base font-bold font-mono">
                    {formatCompact(totalBalance, primaryCurrency)}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                {allocationData.map((entry, index) => (
                  <button
                    key={entry.name}
                    onClick={() => setActiveAllocationSlice(activeAllocationSlice === index ? null : index)}
                    className={`w-full flex items-center justify-between text-xs transition-all duration-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-secondary/40 ${
                      activeAllocationSlice !== null && activeAllocationSlice !== index ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="font-semibold truncate">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      <span className="text-muted-foreground">{entry.percent}%</span>
                    </div>
                  </button>
                ))}
                {activeAllocationSlice !== null && allocationData[activeAllocationSlice] && (
                  <div className="mt-2 pt-2 border-t border-border/30 text-xs space-y-0.5">
                    <p className="font-bold">{allocationData[activeAllocationSlice].name}</p>
                    <p className="font-mono text-muted-foreground">
                      {formatCurrency(allocationData[activeAllocationSlice].value, allocationData[activeAllocationSlice].currency)}
                      {" · "}
                      {allocationData[activeAllocationSlice].percent}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Weekly Pulse */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold">Weekly Pulse</h2>
            <p className="text-xs text-muted-foreground">Spending & income — last 7 days</p>
          </div>

          <div className="h-35 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={10} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.2} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip content={BAR_TOOLTIP} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Bar dataKey="expense" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`expense-${index}`}
                      fill={entry.expense === maxWeekly && entry.expense > 0 ? "var(--expense)" : "var(--muted)"}
                    />
                  ))}
                </Bar>
                {/* All income bars share the same static color — no need for per-item Cell map */}
                <Bar dataKey="income" radius={[4, 4, 0, 0]} fill="var(--income)" fillOpacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-border/30 pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-expense" />
                <span className="text-muted-foreground">Spent</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-income opacity-50" />
                <span className="text-muted-foreground">Earned</span>
              </span>
            </div>
            <span className="text-muted-foreground font-mono">
              {format(subDays(new Date(), 6), "MMM d")} – {format(new Date(), "MMM d")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
