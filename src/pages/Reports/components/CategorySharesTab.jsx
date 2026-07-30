import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, formatCompact } from "@/config/currencies";

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-3.5 text-xs shadow-xl space-y-1">
      <p className="font-bold">{entry.name}</p>
      <p className="text-muted-foreground flex items-center gap-2">
        <span className="font-mono font-bold text-foreground">{formatCompact(entry.value)}</span>
        <span>·</span>
        <span className="font-mono text-emerald-400 font-bold">{entry.payload.percent}%</span>
      </p>
    </div>
  );
};

export default function CategorySharesTab({ categoryBreakdown, primaryCurrency, formattedDateRange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Category Pie Chart (Sticky on Desktop) */}
      <div className="lg:col-span-1 lg:sticky lg:top-24 self-start rounded-3xl border border-border/40 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold">Category Distribution</h3>
          <p className="text-xs text-muted-foreground">
            {formattedDateRange || "Expense allocation across categories"}
          </p>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
            No category expense data available.
          </div>
        ) : (
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="text-center pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Active Categories: <span className="font-mono font-bold text-foreground">{categoryBreakdown.length}</span>
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress Cards (Scrollable if long) */}
      <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold">Category Spending Breakdown</h3>
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
                    <span className="font-bold">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground">({cat.count} tx)</span>
                  </div>
                  <div className="text-right">
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
