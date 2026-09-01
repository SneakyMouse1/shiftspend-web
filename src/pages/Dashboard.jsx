import { useState, useMemo } from "react";
import { format, parseISO, subDays } from "date-fns";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  ArrowUpRight, ArrowDownRight, PiggyBank,
  RefreshCcw, AlertCircle, ArrowLeftRight, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { useAccounts } from "@/hooks/useAccounts";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { useTranslation } from "@/hooks/useLanguage";
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
          <div key={i} className="min-h-48 rounded-3xl border border-border/40 bg-card/50 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-8 w-32" />
            </div>
            <div className="h-10 flex items-center justify-between gap-4 border-t border-border/30 pt-2">
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-5 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Recent Activity (Full Width, 3 cols) */}
      <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonBlock key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>

      {/* Row 3: Chart Area */}
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

      {/* Row 4: 3 detailed widget cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4 h-64">
          <SkeletonBlock className="h-5 w-32" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4 h-64">
          <SkeletonBlock className="h-5 w-36" />
          <div className="flex items-center gap-6 pt-2">
            <SkeletonBlock className="h-28 w-28 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card/50 p-6 space-y-4 h-64">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="h-36 w-full" />
        </div>
      </div>
    </div>
  );
}

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

export default function Dashboard() {
  const { t } = useTranslation();
  const isDark = useIsDarkMode();
  const { data, isLoading, isError, refetch } = useDashboard();
  const { data: accounts = [] } = useAccounts();
  const [activeAllocationSlice, setActiveAllocationSlice] = useState(null);

  const summary = data?.summary ?? {};
  const chartRaw = useMemo(() => data?.chart ?? [], [data]);
  const topCategories = useMemo(() => data?.top_categories ?? [], [data]);
  const recentTx = useMemo(() => data?.recent_transactions ?? [], [data]);

  const totalBalance = summary.total_balance ?? 0;
  const monthIncome = summary.month_income ?? 0;
  const monthExpense = summary.month_expense ?? 0;
  const monthSavings = summary.month_savings ?? 0;
  const primaryCurrency = summary.balances?.[0]?.currency_code ?? "EUR";

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

  // ApexCharts Configs
  const areaSeries = useMemo(() => [
    { name: t("dashboard.inflow"), data: chartData.map((d) => d.income) },
    { name: t("dashboard.outflow"), data: chartData.map((d) => d.expense) },
  ], [chartData, t]);

  const areaOptions = useMemo(() => ({
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      zoom: { enabled: false },
    },
    colors: isDark ? ["#4ADE80", "#FB923C"] : ["#16A34A", "#EA580C"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: isDark ? 0.35 : 0.25,
        opacityTo: 0.02,
        stops: [0, 95, 100],
      },
    },
    grid: {
      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: chartData.map((d) => d.label),
      tickAmount: chartData.length > 20 ? 6 : Math.min(chartData.length, 6),
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#64748B",
          fontSize: "11px",
        },
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#64748B",
          fontSize: "11px",
        },
        formatter: (val) => formatCompact(val, primaryCurrency),
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      x: { show: true },
      y: {
        formatter: (val) => formatCurrency(val, primaryCurrency),
      },
    },
    legend: { show: false },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: { height: 220 },
        xaxis: {
          tickAmount: 3,
          labels: {
            style: { fontSize: "10px" },
            rotate: 0,
          },
        },
        yaxis: { labels: { style: { fontSize: "10px" } } },
      },
    }],
  }), [isDark, chartData, primaryCurrency]);

  const donutSeries = useMemo(() => allocationData.map((d) => d.value), [allocationData]);
  const donutOptions = useMemo(() => ({
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    labels: allocationData.map((d) => d.name),
    colors: allocationData.map((d) => d.color),
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      show: true,
      colors: [isDark ? "#131316" : "#FFFFFF"],
      width: 2,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t("common.total"),
              fontSize: "11px",
              fontWeight: 600,
              color: isDark ? "#9CA3AF" : "#64748B",
              formatter: () => formatCompact(totalBalance, primaryCurrency),
            },
            value: {
              fontSize: "15px",
              fontWeight: 700,
              color: isDark ? "#F3F4F6" : "#0F172A",
              formatter: (val) => formatCompact(val, primaryCurrency),
            },
          },
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => formatCurrency(val, primaryCurrency),
      },
    },
  }), [isDark, allocationData, totalBalance, primaryCurrency, t]);

  const weeklySeries = useMemo(() => [
    { name: t("dashboard.outflow"), data: weeklyData.map((d) => d.expense) },
    { name: t("dashboard.inflow"), data: weeklyData.map((d) => d.income) },
  ], [weeklyData, t]);

  const weeklyOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: isDark ? ["#FB923C", "#4ADE80"] : ["#EA580C", "#16A34A"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: weeklyData.map((d) => d.label),
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#64748B",
          fontSize: "10px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#64748B",
          fontSize: "10px",
        },
        formatter: (val) => formatCompact(val, primaryCurrency),
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => formatCurrency(val, primaryCurrency),
      },
    },
    legend: { show: false },
  }), [isDark, weeklyData, primaryCurrency]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <p className="text-lg font-bold">{t("common.error")}</p>
        <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl gap-2">
          <RefreshCcw className="h-4 w-4" />
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      {/* Bento Grid — Row 1: 3 Balanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Worth */}
        <section className="rounded-3xl border border-border/40 bg-card p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("dashboard.netWorth")}</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {formatCurrency(totalBalance, primaryCurrency)}
            </div>
          </div>
          <div className="border-t border-border/30 pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("settings.defaultCurrency")}</span>
            <span className="font-bold text-foreground font-mono bg-secondary/60 px-2 py-0.5 rounded-md">
              {primaryCurrency}
            </span>
          </div>
        </section>

        {/* Monthly Flow KPI */}
        <section className="rounded-3xl border border-border/40 bg-card p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("dashboard.thisMonthFlow")}</span>
            <div className="text-xs text-muted-foreground mt-0.5">{t("dashboard.cashFlowTrend")}</div>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-3 border-t border-border/30">
            <div className="flex flex-col items-center space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("dashboard.inflow")}</span>
              <div className="text-income font-bold text-sm sm:text-base flex items-center gap-0.5 font-mono">
                <ArrowUpRight className="h-4 w-4 shrink-0" />
                {formatCompact(monthIncome, primaryCurrency)}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-0.5 border-x border-border/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("dashboard.outflow")}</span>
              <div className="text-expense font-bold text-sm sm:text-base flex items-center gap-0.5 font-mono">
                <ArrowDownRight className="h-4 w-4 shrink-0" />
                {formatCompact(monthExpense, primaryCurrency)}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("dashboard.netSavings")}</span>
              <div className="text-chart-3 font-bold text-sm sm:text-base flex items-center gap-0.5 font-mono">
                <PiggyBank className="h-4 w-4 shrink-0" />
                {formatCompact(monthSavings, primaryCurrency)}
              </div>
            </div>
          </div>
        </section>

        {/* Accounts list */}
        <section className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("nav.accounts")}</span>
            <Link to="/accounts" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-0.5">
              <span>{t("dashboard.viewAll")}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {accounts.filter((a) => !a.is_archived).slice(0, 4).map((acc) => {
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
      </div>

      {/* Row 2: Recent Activity */}
      <section className="rounded-3xl border border-border/40 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">{t("dashboard.recentActivity")}</h2>
            <p className="text-xs text-muted-foreground">{t("dashboard.recentActivity")}</p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-xl border border-border/30 transition-all"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentTx.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">{t("dashboard.noRecentTransactions")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTx.slice(0, 9).map((tx) => (
              <div
                key={tx.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-secondary/30 border border-border/30 hover:border-border/60 hover:bg-secondary/50 transition-all flex items-center justify-between gap-3 min-w-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === "income"
                        ? "bg-income/10 text-income"
                        : tx.type === "expense"
                        ? "bg-expense/10 text-expense"
                        : "bg-chart-3/10 text-chart-3"
                    }`}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : tx.type === "expense" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowLeftRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold truncate text-foreground">
                      {tx.comment || tx.category || (tx.type === "transfer" ? t("transactions.types.transfer") : "—")}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {tx.date ? format(parseISO(tx.date), "MMM d") : ""} · {tx.account || t("common.account")}
                    </p>
                  </div>
                </div>
                <span className={`text-xs sm:text-sm font-mono font-bold shrink-0 ${getTransactionColor(tx.type)}`}>
                  {getTransactionPrefix(tx.type)}{formatCompact(tx.amount, tx.currency_code)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Row 3: Area Chart */}
      <section className="rounded-3xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">{t("dashboard.cashFlowTrend")}</h2>
            <p className="text-xs text-muted-foreground">{t("dashboard.thisMonthFlow")}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-income" />
              {t("dashboard.inflow")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-expense" />
              {t("dashboard.outflow")}
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              {t("common.noData")}
            </div>
          ) : (
            <Chart options={areaOptions} series={areaSeries} type="area" height="100%" />
          )}
        </div>

        <div className="border-t border-border/30 pt-3 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">{t("dashboard.inflow")}</span>
            <span className="text-income font-bold text-base sm:text-lg font-mono flex items-center gap-0.5">
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              {formatCurrency(monthIncome, primaryCurrency)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">{t("dashboard.outflow")}</span>
            <span className="text-expense font-bold text-base sm:text-lg font-mono flex items-center gap-0.5">
              <ArrowDownRight className="h-4 w-4 shrink-0" />
              {formatCurrency(monthExpense, primaryCurrency)}
            </span>
          </div>
        </div>
      </section>

      {/* Row 4: Top Categories + Asset Allocation + Weekly Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Categories */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold">{t("dashboard.topCategories")}</h2>
            <p className="text-xs text-muted-foreground">{t("dashboard.topCategoriesSubtitle")}</p>
          </div>

          {topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{t("dashboard.noExpenseData")}</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map((cat, i) => {
                const pct = Math.round((cat.total / topCatTotal) * 100);
                const hue = [0, 30, 200, 270, 140][i % 5];
                const color = `hsl(${hue}, 70%, 60%)`;
                return (
                  <div key={cat.category ?? i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold truncate max-w-35">{cat.category ?? t("common.all")}</span>
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
            <h2 className="text-lg font-bold">{t("dashboard.assetAllocation")}</h2>
            <p className="text-xs text-muted-foreground">{t("dashboard.assetAllocationSubtitle")}</p>
          </div>

          {allocationData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{t("dashboard.noAccountsWithBalance")}</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative h-44 w-44 shrink-0 mx-auto">
                <Chart options={donutOptions} series={donutSeries} type="donut" height="100%" />
              </div>

              <div className="flex-1 space-y-2 min-w-0 w-full">
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
            <h2 className="text-lg font-bold">{t("dashboard.weeklyPulse")}</h2>
            <p className="text-xs text-muted-foreground">{t("dashboard.weeklyPulseSubtitle")}</p>
          </div>

          <div className="h-40 w-full">
            <Chart options={weeklyOptions} series={weeklySeries} type="bar" height="100%" />
          </div>

          <div className="border-t border-border/30 pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-expense" />
                <span className="text-muted-foreground">{t("dashboard.outflow")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-income opacity-50" />
                <span className="text-muted-foreground">{t("dashboard.inflow")}</span>
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
