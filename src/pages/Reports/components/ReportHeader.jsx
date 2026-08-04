import { Button } from "@/components/ui/button";
import { Loader2, FileText, FileSpreadsheet, Download } from "lucide-react";

export default function ReportHeader({
  isFetchingReport,
  isExporting,
  exportingFormat,
  handleExport,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Reports</h1>
          {isFetchingReport && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <p className="text-muted-foreground text-sm mt-0.5">
          Financial insights, cash flow trends, and category spending breakdown
        </p>
      </div>

      {/* Export Buttons: PDF / Excel / CSV */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          variant="outline"
          className="rounded-2xl gap-2 text-xs font-semibold bg-expense/10 hover:bg-expense/20 text-expense border-expense/20 cursor-pointer"
        >
          {isExporting && exportingFormat === "pdf" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-expense" />
          ) : (
            <FileText className="h-3.5 w-3.5 text-expense" />
          )}
          <span>Export PDF</span>
        </Button>

        <Button
          onClick={() => handleExport("excel")}
          disabled={isExporting}
          variant="outline"
          className="rounded-2xl gap-2 text-xs font-semibold bg-income/10 hover:bg-income/20 text-income border-income/20 cursor-pointer"
        >
          {isExporting && exportingFormat === "excel" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-income" />
          ) : (
            <FileSpreadsheet className="h-3.5 w-3.5 text-income" />
          )}
          <span>Export Excel</span>
        </Button>

        <Button
          onClick={() => handleExport("csv")}
          disabled={isExporting}
          variant="outline"
          className="rounded-2xl gap-2 text-xs font-semibold bg-chart-3/10 hover:bg-chart-3/20 text-chart-3 border-chart-3/20 cursor-pointer"
        >
          {isExporting && exportingFormat === "csv" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-chart-3" />
          ) : (
            <Download className="h-3.5 w-3.5 text-chart-3" />
          )}
          <span>Export CSV</span>
        </Button>
      </div>
    </div>
  );
}
