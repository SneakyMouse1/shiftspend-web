import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReportsApi,
  exportReportApi,
  getReportExportsApi,
  deleteReportExportApi,
} from "@/api/reports";
import { toast } from "sonner";

export function useReports(filters = {}) {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: () => getReportsApi(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useReportExports() {
  return useQuery({
    queryKey: ["report-exports"],
    queryFn: getReportExportsApi,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending =
        Array.isArray(data) &&
        data.some((exp) => exp.status === "pending" || exp.status === "processing");
      return hasPending ? 3000 : false;
    },
  });
}

export function useDeleteReportExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key) => deleteReportExportApi(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-exports"] });
      toast.success("Export deleted from storage");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete export");
    },
  });
}

export function useExportReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => exportReportApi(params),
    onSuccess: ({ data, format }) => {
      queryClient.invalidateQueries({ queryKey: ["report-exports"] });

      const mimeTypes = {
        pdf: "application/pdf",
        excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        csv: "text/csv",
      };

      const extensions = {
        pdf: "pdf",
        excel: "xlsx",
        csv: "csv",
      };

      const blob = new Blob([data], { type: mimeTypes[format] || "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financeflow_report_${format}_${new Date().toISOString().slice(0, 10)}.${extensions[format] || "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Report exported successfully as ${format.toUpperCase()}`);
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["report-exports"] });
      console.error("Report export failed:", error);
      toast.error(error?.message || error?.response?.data?.message || "Failed to export report");
    },
  });
}
