import { Button } from "@/components/ui/button";
import { Clock, Loader2, FileText, FileSpreadsheet, Download, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useLanguage";

export default function RecentExports({
  exportsList,
  exportsLoading,
  handleDownloadHistoryItem,
  deleteExportMutation,
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-foreground">{t("reports.recentExports")}</h2>
        </div>
        {exportsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>

      {exportsList.length === 0 ? (
        <div className="py-4 text-center text-xs text-muted-foreground">
          {t("reports.noExports")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {exportsList.map((item) => {
            const isPdf = item.format === "pdf";
            const isExcel = item.format === "excel";
            const isDone = item.status === "done";
            const isPending = item.status === "pending" || item.status === "processing";
            const isFailed = item.status === "failed";

            const expiresDate = new Date(item.expires_at);
            const now = new Date();
            const diffMs = Math.max(0, expiresDate - now);
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/30 hover:border-border/60 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPdf
                        ? "bg-rose-500/10 text-rose-400"
                        : isExcel
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-cyan-500/10 text-cyan-400"
                    }`}
                  >
                    {isPdf ? (
                      <FileText className="h-5 w-5" />
                    ) : isExcel ? (
                      <FileSpreadsheet className="h-5 w-5" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {item.format}
                      </span>
                      {item.period && (
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                          {item.period}
                        </span>
                      )}
                      {isDone && item.file_size_formatted && (
                        <span className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                          {item.file_size_formatted}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>
                        {isPending
                          ? t("common.loading")
                          : isFailed
                          ? "Error"
                          : `${t("reports.expiresIn")} ${diffHours}h ${diffMins}m`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isDone && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDownloadHistoryItem(item)}
                      className="h-8 w-8 rounded-xl text-primary hover:bg-primary/10 cursor-pointer"
                      title={t("reports.exportPdf")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {isPending && (
                    <div className="p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteExportMutation.mutate(item.key)}
                    disabled={deleteExportMutation.isPending}
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title={t("common.delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
