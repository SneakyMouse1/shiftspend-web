import { useMemo } from "react";
import Chart from "react-apexcharts";
import { format, parseISO } from "date-fns";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { formatCurrency, formatCompact } from "@/config/currencies";
import { useTranslation } from "@/hooks/useLanguage";

export default function SpendingHabitsTab({
  dayOfWeekData,
  topExpenseTransactions,
  primaryCurrency,
  formattedDateRange,
}) {
  const isDark = useIsDarkMode();
  const { t } = useTranslation();

  const series = useMemo(() => [
    { name: t("dashboard.outflow"), data: dayOfWeekData.map((d) => d.amount) },
  ], [dayOfWeekData, t]);

  const options = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#F59E0B"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%",
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
      categories: dayOfWeekData.map((d) => d.name),
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#64748B",
          fontSize: "11px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
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
      y: {
        formatter: (val) => formatCurrency(val, primaryCurrency),
      },
    },
    legend: { show: false },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: { height: 230 },
        plotOptions: {
          bar: { columnWidth: "60%" },
        },
        xaxis: { labels: { style: { fontSize: "10px" } } },
        yaxis: { labels: { style: { fontSize: "10px" } } },
      },
    }],
  }), [isDark, dayOfWeekData, primaryCurrency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Day of Week Spending Bar Chart */}
      <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold">{t("reports.spendingByDay")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("reports.tabs.spendingHabits")} {formattedDateRange ? `(${formattedDateRange})` : ""}
          </p>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <Chart options={options} series={series} type="bar" height="100%" />
        </div>
      </div>

      {/* Top Expense Transactions */}
      <div className="lg:col-span-1 rounded-3xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold">{t("reports.largestExpenses")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("reports.tabs.spendingHabits")} {formattedDateRange ? `(${formattedDateRange})` : ""}
          </p>
        </div>

        {topExpenseTransactions.length === 0 ? (
          <p className="text-xs text-muted-foreground py-12 text-center">{t("common.noData")}</p>
        ) : (
          <div className="space-y-3">
            {topExpenseTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/30"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold truncate">{tx.comment || tx.category?.name || t("transactions.types.expense")}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {tx.date ? format(parseISO(tx.date), "MMM d, yyyy") : ""} · {tx.category?.name || t("common.category")}
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
