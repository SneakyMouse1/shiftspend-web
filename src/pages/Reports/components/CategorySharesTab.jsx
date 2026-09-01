import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { formatCurrency, formatCompact } from "@/config/currencies";

export default function CategorySharesTab({ categoryBreakdown, primaryCurrency, formattedDateRange }) {
  const isDark = useIsDarkMode();

  const totalExpense = useMemo(
    () => categoryBreakdown.reduce((sum, item) => sum + (Number(item.total) || Number(item.value) || 0), 0),
    [categoryBreakdown]
  );

  const series = useMemo(
    () => categoryBreakdown.map((item) => Number(item.total) || Number(item.value) || 0),
    [categoryBreakdown]
  );

  const labels = useMemo(
    () => categoryBreakdown.map((item) => item.name),
    [categoryBreakdown]
  );

  const colors = useMemo(
    () => categoryBreakdown.map((item) => item.color || "#10B981"),
    [categoryBreakdown]
  );

  const options = useMemo(() => ({
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    labels,
    colors,
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
              label: "Total Spent",
              fontSize: "11px",
              fontWeight: 600,
              color: isDark ? "#9CA3AF" : "#64748B",
              formatter: () => formatCompact(totalExpense, primaryCurrency),
            },
            value: {
              fontSize: "16px",
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
  }), [isDark, labels, colors, totalExpense, primaryCurrency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Category Pie Chart (Sticky on Desktop) */}
      <div className="lg:col-span-1 lg:sticky lg:top-24 self-start rounded-3xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold">Category Distribution</h3>
          <p className="text-xs text-muted-foreground">
            {formattedDateRange || "Expense allocation across categories"}
          </p>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
            No category expense data available.
          </div>
        ) : (
          <div className="h-64 w-full relative flex items-center justify-center">
            <Chart options={options} series={series} type="donut" height={240} />
          </div>
        )}

        <div className="text-center pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Active Categories: <span className="font-mono font-bold text-foreground">{categoryBreakdown.length}</span>
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress Cards (Scrollable if long) */}
      <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold">Category Spending Breakdown</h3>
          <p className="text-xs text-muted-foreground">
            Detailed metrics by category {formattedDateRange ? `(${formattedDateRange})` : ""}
          </p>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">No category data to display</div>
        ) : (
          <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-2 p-3.5 rounded-2xl bg-secondary/30 border border-border/30">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold truncate">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">({cat.count} tx)</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold">{formatCurrency(cat.total, primaryCurrency)}</span>
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">{cat.percent}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
