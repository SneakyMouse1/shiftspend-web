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
          className="rounded-2xl gap-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20 cursor-pointer"
        >
          {isExporting && exportingFormat === "pdf" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-400" />
          ) : (
            <FileText className="h-3.5 w-3.5 text-rose-400" />
          )}
          <span>Export PDF</span>
        </Button>

        <Button
          onClick={() => handleExport("excel")}
          disabled={isExporting}
          variant="outline"
          className="rounded-2xl gap-2 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 cursor-pointer"
        >
          {isExporting && exportingFormat === "excel" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
          ) : (
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
          )}
          <span>Export Excel</span>
        </Button>

        <Button
          onClick={() => handleExport("csv")}
          disabled={isExporting}
          variant="outline"
          className="rounded-2xl gap-2 text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/20 cursor-pointer"
        >
          {isExporting && exportingFormat === "csv" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          ) : (
            <Download className="h-3.5 w-3.5 text-cyan-400" />
          )}
          <span>Export CSV</span>
        </Button>
      </div>
    </div>
  );
}
