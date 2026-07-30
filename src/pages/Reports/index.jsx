import { useState, useMemo } from "react";
import { format, parseISO, subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval, getDay } from "date-fns";
import { TrendingUp, PieChart as PieIcon, RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReports, useExportReport, useReportExports, useDeleteReportExport } from "@/hooks/useReports";
import { downloadExportFileApi } from "@/api/reports";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";
import { toast } from "sonner";

import ReportsSkeleton from "./components/ReportsSkeleton";
import ReportHeader from "./components/ReportHeader";
import ReportFilters from "./components/ReportFilters";
import RecentExports from "./components/RecentExports";
import ReportKpis from "./components/ReportKpis";
import CashFlowTab from "./components/CashFlowTab";
import CategorySharesTab from "./components/CategorySharesTab";
import SpendingHabitsTab from "./components/SpendingHabitsTab";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Reports() {
  const [period, setPeriod] = useState("last_month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Construct filters payload for API endpoint /api/v1/reports
  const reportFilters = useMemo(() => {
    const filters = {};
    if (period !== "custom") {
      filters.period = period;
    } else {
      filters.period = "custom";
      if (dateFrom) filters.date_from = dateFrom;
      if (dateTo) filters.date_to = dateTo;
    }
    if (selectedAccountId !== "all") filters.account_id = selectedAccountId;
    if (selectedCategoryId !== "all") filters.category_id = selectedCategoryId;
    if (selectedType !== "all") filters.type = selectedType;
    return filters;
  }, [period, dateFrom, dateTo, selectedAccountId, selectedCategoryId, selectedType]);

  const { data: apiReportData, isLoading: isLoadingReport, isFetching: isFetchingReport, isError: isErrorReport, refetch } = useReports(reportFilters);
  const { mutate: exportReport, isPending: isExporting } = useExportReport();
  const { data: exportsList = [], isLoading: exportsLoading } = useReportExports();
  const deleteExportMutation = useDeleteReportExport();
  const [exportingFormat, setExportingFormat] = useState(null);

  const handleDownloadHistoryItem = async (item) => {
    try {
      const data = await downloadExportFileApi(item.key);
      const mimeTypes = {
        pdf: "application/pdf",
        excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        csv: "text/csv",
      };
      const extensions = { pdf: "pdf", excel: "xlsx", csv: "csv" };
      const format = item.format || "csv";
      const blob = new Blob([data], { type: mimeTypes[format] || "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financeflow_report_${format}_${item.key.slice(0, 8)}.${extensions[format] || "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to download file");
    }
  };

  const { data: txResponse } = useTransactions({ per_page: 500 });
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const rawTransactions = useMemo(() => {
    if (!txResponse) return [];
    if (Array.isArray(txResponse)) return txResponse;
    if (Array.isArray(txResponse.data)) return txResponse.data;
    return [];
  }, [txResponse]);

  const primaryCurrency = accounts[0]?.currency_code || "EUR";

  // Filter transactions locally for detailed tables and daily charts
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return rawTransactions.filter((tx) => {
      const accId = tx.account_id ?? tx.account?.id;
      if (selectedAccountId !== "all" && accId !== undefined && String(accId) !== String(selectedAccountId)) {
        return false;
      }

      const catId = tx.category_id ?? tx.category?.id;
      if (selectedCategoryId !== "all" && catId !== undefined && String(catId) !== String(selectedCategoryId)) {
        return false;
      }

      if (selectedType !== "all" && tx.type !== selectedType) {
        return false;
      }

      if (!tx.date) return true;
      const txDate = parseISO(tx.date);

      if (period === "last_month") {
        return isWithinInterval(txDate, { start: startOfMonth(now), end: endOfMonth(now) });
      }
      if (period === "previous_month") {
        const lastM = subMonths(now, 1);
        return isWithinInterval(txDate, { start: startOfMonth(lastM), end: endOfMonth(lastM) });
      }
      if (period === "3_months") {
        return isWithinInterval(txDate, { start: subDays(now, 90), end: now });
      }
      if (period === "6_months") {
        return isWithinInterval(txDate, { start: subDays(now, 180), end: now });
      }
      if (period === "this_year" || period === "1_year") {
        return txDate.getFullYear() === now.getFullYear();
      }
      if (period === "custom") {
        if (dateFrom && txDate < parseISO(dateFrom)) return false;
        if (dateTo && txDate > parseISO(dateTo)) return false;
      }
      return true;
    });
  }, [rawTransactions, period, dateFrom, dateTo, selectedAccountId, selectedCategoryId, selectedType]);

  // Combined Summary Metrics
  const metrics = useMemo(() => {
    if (apiReportData?.summary) {
      const inc = parseFloat(apiReportData.summary.income || 0);
      const exp = parseFloat(apiReportData.summary.expense || 0);
      const net = parseFloat(apiReportData.summary.net ?? (inc - exp));
      const rate = inc > 0 ? Math.max(0, Math.round((net / inc) * 100)) : 0;
      return {
        income: inc,
        expenses: exp,
        netSavings: net,
        savingsRate: rate,
        dailyAverageSpend: exp / 30,
        totalCount: filteredTransactions.length,
      };
    }

    let income = 0;
    let expenses = 0;
    filteredTransactions.forEach((tx) => {
      const amt = parseFloat(tx.amount || 0);
      if (tx.type === "income") income += amt;
      if (tx.type === "expense") expenses += amt;
    });

    const netSavings = income - expenses;
    const savingsRate = income > 0 ? Math.max(0, Math.round((netSavings / income) * 100)) : 0;
    const dailyAverageSpend = expenses / 30;

    return {
      income,
      expenses,
      netSavings,
      savingsRate,
      dailyAverageSpend,
      totalCount: filteredTransactions.length,
    };
  }, [apiReportData, filteredTransactions]);

  // Category breakdown for Pie Chart & Category Table
  const categoryBreakdown = useMemo(() => {
    if (apiReportData?.by_category && Array.isArray(apiReportData.by_category) && apiReportData.by_category.length > 0) {
      const colors = [
        "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#3B82F6",
        "#06B6D4", "#6366F1", "#F97316", "#14B8A6", "#A855F7"
      ];
      const totalExp = apiReportData.by_category.reduce((s, c) => s + parseFloat(c.total || c.amount || 0), 0) || 1;

      return apiReportData.by_category.map((cat, idx) => {
        const val = parseFloat(cat.total || cat.amount || 0);
        return {
          name: cat.category_name || cat.name || cat.category || "Uncategorized",
          total: val,
          value: val,
          count: cat.count || 1,
          percent: Math.round((val / totalExp) * 100),
          color: colors[idx % colors.length],
          avgTx: Math.round(val / (cat.count || 1)),
        };
      });
    }

    const expenseTx = filteredTransactions.filter((t) => t.type === "expense");
    const map = {};

    expenseTx.forEach((tx) => {
      const catName = tx.category?.name || tx.category || "Uncategorized";
      if (!map[catName]) {
        map[catName] = { name: catName, total: 0, count: 0 };
      }
      map[catName].total += parseFloat(tx.amount || 0);
      map[catName].count += 1;
    });

    const totalExpense = Object.values(map).reduce((s, c) => s + c.total, 0) || 1;
    const colors = [
      "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#3B82F6",
      "#06B6D4", "#6366F1", "#F97316", "#14B8A6", "#A855F7"
    ];

    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .map((cat, idx) => ({
        ...cat,
        value: cat.total,
        percent: Math.round((cat.total / totalExpense) * 100),
        color: colors[idx % colors.length],
        avgTx: Math.round(cat.total / (cat.count || 1)),
      }));
  }, [apiReportData, filteredTransactions]);

  // Cash flow timeline data for Area Chart
  const timelineData = useMemo(() => {
    const map = {};

    filteredTransactions.forEach((tx) => {
      if (!tx.date) return;
      const dateKey = tx.date.split("T")[0];
      if (!map[dateKey]) {
        map[dateKey] = { date: dateKey, income: 0, expense: 0 };
      }
      const amt = parseFloat(tx.amount || 0);
      if (tx.type === "income") map[dateKey].income += amt;
      if (tx.type === "expense") map[dateKey].expense += amt;
    });

    return Object.keys(map)
      .sort()
      .map((dateKey) => ({
        date: dateKey,
        label: format(parseISO(dateKey), "MMM d"),
        income: map[dateKey].income,
        expense: map[dateKey].expense,
        net: map[dateKey].income - map[dateKey].expense,
      }));
  }, [filteredTransactions]);

  // Spending by Day of Week
  const dayOfWeekData = useMemo(() => {
    const days = [0, 0, 0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    filteredTransactions
      .filter((t) => t.type === "expense" && t.date)
      .forEach((tx) => {
        const dayIdx = getDay(parseISO(tx.date));
        days[dayIdx] += parseFloat(tx.amount || 0);
        counts[dayIdx] += 1;
      });

    return DAYS_OF_WEEK.map((name, idx) => ({
      name,
      amount: days[idx],
      count: counts[idx],
    }));
  }, [filteredTransactions]);

  const topExpenseTransactions = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => parseFloat(b.amount || 0) - parseFloat(a.amount || 0))
      .slice(0, 5);
  }, [filteredTransactions]);

  const formattedDateRange = useMemo(() => {
    const now = new Date();
    let start, end;

    if (period === "last_month") {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else if (period === "previous_month") {
      const lastM = subMonths(now, 1);
      start = startOfMonth(lastM);
      end = endOfMonth(lastM);
    } else if (period === "3_months") {
      start = subDays(now, 90);
      end = now;
    } else if (period === "6_months") {
      start = subDays(now, 180);
      end = now;
    } else if (period === "this_year" || period === "1_year") {
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
    } else if (period === "custom") {
      if (dateFrom && dateTo) {
        return `${format(parseISO(dateFrom), "MMM d, yyyy")} – ${format(parseISO(dateTo), "MMM d, yyyy")}`;
      }
      if (dateFrom) return `From ${format(parseISO(dateFrom), "MMM d, yyyy")}`;
      if (dateTo) return `Until ${format(parseISO(dateTo), "MMM d, yyyy")}`;
      return "Custom Date Range";
    }

    if (start && end) {
      return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
    }
    return "";
  }, [period, dateFrom, dateTo]);

  const handleExport = (exportFormat) => {
    setExportingFormat(exportFormat);
    exportReport(
      { format: exportFormat, ...reportFilters },
      {
        onSettled: () => setExportingFormat(null),
      }
    );
  };

  const isLoading = isLoadingReport && !apiReportData;

  if (isLoading) return <ReportsSkeleton />;

  if (isErrorReport) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <p className="text-lg font-bold">Failed to load reports</p>
        <p className="text-sm text-muted-foreground">Unable to fetch financial metrics. Please check your connection.</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6 animate-in fade-in duration-300">
      {/* Header with Title and Export Buttons */}
      <ReportHeader
        isFetchingReport={isFetchingReport}
        isExporting={isExporting}
        exportingFormat={exportingFormat}
        handleExport={handleExport}
      />

      {/* Filter Bar */}
      <ReportFilters
        period={period}
        setPeriod={setPeriod}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        accounts={accounts}
        categories={categories}
        formattedDateRange={formattedDateRange}
      />

      {/* KPI Cards */}
      <ReportKpis 
        metrics={metrics} 
        primaryCurrency={primaryCurrency} 
        formattedDateRange={formattedDateRange}
      />

      {/* Recent Exports (24h Archive) */}
      <RecentExports
        exportsList={exportsList}
        exportsLoading={exportsLoading}
        handleDownloadHistoryItem={handleDownloadHistoryItem}
        deleteExportMutation={deleteExportMutation}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col md:flex-row items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
            activeTab === "overview"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Cash Flow Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex flex-col md:flex-row items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
            activeTab === "categories"
              ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          <PieIcon className="h-3.5 w-3.5" />
          <span>Category Shares</span>
        </button>

        <button
          onClick={() => setActiveTab("habits")}
          className={`flex flex-col md:flex-row items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
            activeTab === "habits"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Spending Habits</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="min-h-[580px]">
        <div className={activeTab === "overview" ? "block animate-in fade-in duration-200" : "hidden"}>
          <CashFlowTab
            timelineData={timelineData}
            metrics={metrics}
            primaryCurrency={primaryCurrency}
            formattedDateRange={formattedDateRange}
          />
        </div>

        <div className={activeTab === "categories" ? "block animate-in fade-in duration-200" : "hidden"}>
          <CategorySharesTab
            categoryBreakdown={categoryBreakdown}
            primaryCurrency={primaryCurrency}
            formattedDateRange={formattedDateRange}
          />
        </div>

        <div className={activeTab === "habits" ? "block animate-in fade-in duration-200" : "hidden"}>
          <SpendingHabitsTab
            dayOfWeekData={dayOfWeekData}
            topExpenseTransactions={topExpenseTransactions}
            primaryCurrency={primaryCurrency}
            formattedDateRange={formattedDateRange}
          />
        </div>
      </div>
    </div>
  );
}
