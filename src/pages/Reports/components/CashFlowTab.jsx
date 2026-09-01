import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { formatCurrency, formatCompact } from "@/config/currencies";
import { useTranslation } from "@/hooks/useLanguage";

export default function CashFlowTab({ timelineData, metrics, primaryCurrency, formattedDateRange }) {
  const isDark = useIsDarkMode();
  const { t } = useTranslation();

  const series = useMemo(() => [
    { name: t("dashboard.inflow"), data: timelineData.map((d) => d.income) },
    { name: t("dashboard.outflow"), data: timelineData.map((d) => d.expense) },
  ], [timelineData, t]);

  const options = useMemo(() => ({
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
      categories: timelineData.map((d) => d.label),
      tickAmount: timelineData.length > 20 ? 6 : Math.min(timelineData.length, 6),
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
        chart: { height: 230 },
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
  }), [isDark, timelineData, primaryCurrency]);

  return (
    <div className="space-y-6">
      {/* Cash Flow Timeline Area Chart */}
      <div className="rounded-3xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold">{t("reports.cashFlowTimeline")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("reports.cashFlowTimelineSubtitle")} {formattedDateRange ? `(${formattedDateRange})` : ""}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-income" />
              <span>{t("dashboard.inflow")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-expense" />
              <span>{t("dashboard.outflow")}</span>
            </div>
          </div>
        </div>

        {timelineData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-xs text-muted-foreground">
            {t("common.noData")}
          </div>
        ) : (
          <div className="h-64 sm:h-72 w-full pt-2">
            <Chart options={options} series={series} type="area" height="100%" />
          </div>
        )}
      </div>

      {/* Cash Flow Highlights & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border/40 bg-card p-5 space-y-2 shadow-xs">
          <p className="text-xs font-bold text-muted-foreground uppercase">{t("reports.totalInflow")}</p>
          <p className="text-xl font-extrabold font-mono text-income">
            {formatCurrency(metrics.income, primaryCurrency)}
          </p>
          <p className="text-[11px] text-muted-foreground">{t("reports.earnedMoney")}</p>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card p-5 space-y-2 shadow-xs">
          <p className="text-xs font-bold text-muted-foreground uppercase">{t("reports.totalOutflow")}</p>
          <p className="text-xl font-extrabold font-mono text-expense">
            {formatCurrency(metrics.expenses, primaryCurrency)}
          </p>
          <p className="text-[11px] text-muted-foreground">{t("reports.spentMoney")}</p>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card p-5 space-y-2 shadow-xs">
          <p className="text-xs font-bold text-muted-foreground uppercase">{t("reports.netDifference")}</p>
          <p className={`text-xl font-extrabold font-mono ${metrics.netSavings >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(metrics.netSavings, primaryCurrency)}
          </p>
          <p className="text-[11px] text-muted-foreground">{t("reports.periodBalance")}</p>
        </div>
      </div>
    </div>
  );
}
