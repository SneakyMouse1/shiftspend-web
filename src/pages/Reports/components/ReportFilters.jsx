import { Button } from "@/components/ui/button";
import { Filter, CalendarDays, Wallet, Tag, Layers } from "lucide-react";

export default function ReportFilters({
  period,
  setPeriod,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  selectedAccountId,
  setSelectedAccountId,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedType,
  setSelectedType,
  accounts,
  categories,
  formattedDateRange,
}) {
  return (
    <div className="bg-card/40 border border-border/40 p-4 rounded-3xl shadow-sm space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-income" />
          <span>Report Filters</span>
        </div>
        {formattedDateRange && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-income bg-income/10 px-2.5 py-1 rounded-full border border-income/20">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{formattedDateRange}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Period Preset */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Period</label>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-2 rounded-2xl border border-border/30">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent text-xs font-semibold w-full focus:outline-none cursor-pointer"
            >
              <option value="last_month" className="bg-card text-foreground">This Month</option>
              <option value="previous_month" className="bg-card text-foreground">Last Month</option>
              <option value="3_months" className="bg-card text-foreground">3 Months</option>
              <option value="6_months" className="bg-card text-foreground">6 Months</option>
              <option value="this_year" className="bg-card text-foreground">This Year</option>
              <option value="custom" className="bg-card text-foreground">Custom Dates</option>
            </select>
          </div>
        </div>

        {/* Account Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Account</label>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-2 rounded-2xl border border-border/30">
            <Wallet className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="bg-transparent text-xs font-semibold w-full focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-card text-foreground">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-card text-foreground">
                  {acc.name} ({acc.currency_code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-2 rounded-2xl border border-border/30">
            <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="bg-transparent text-xs font-semibold w-full focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-card text-foreground">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-card text-foreground">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Transaction Type</label>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-2 rounded-2xl border border-border/30">
            <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs font-semibold w-full focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-card text-foreground">All Types</option>
              <option value="expense" className="bg-card text-foreground">Expenses Only</option>
              <option value="income" className="bg-card text-foreground">Income Only</option>
              <option value="transfer" className="bg-card text-foreground">Transfers</option>
            </select>
          </div>
        </div>

        {/* Custom Date Pickers if Custom chosen */}
        {period === "custom" ? (
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Date From / To</label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-secondary/50 border border-border/30 rounded-xl px-2 py-1 text-xs font-mono focus:outline-none w-1/2"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-secondary/50 border border-border/30 rounded-xl px-2 py-1 text-xs font-mono focus:outline-none w-1/2"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-end pb-1">
            <Button
              variant="ghost"
              onClick={() => {
                setPeriod("last_month");
                setSelectedAccountId("all");
                setSelectedCategoryId("all");
                setSelectedType("all");
                setDateFrom("");
                setDateTo("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground h-9 rounded-2xl w-full"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
