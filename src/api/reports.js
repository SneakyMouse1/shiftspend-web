import api from "./axios";

export const getReportsApi = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data?.data;
};

export const checkExportStatusApi = async (key) => {
  const response = await api.get(`/reports/export/status/${key}`);
  return response.data?.data;
};

export const downloadExportFileApi = async (key) => {
  const response = await api.get(`/reports/export/download/${key}`, {
    responseType: "blob",
  });
  return response.data;
};

export const getReportExportsApi = async () => {
  const response = await api.get("/reports/exports");
  return response.data?.data || [];
};

export const deleteReportExportApi = async (key) => {
  const response = await api.delete(`/reports/exports/${key}`);
  return response.data;
};

export const exportReportApi = async (params = {}) => {
  const { format = "csv", ...queryParams } = params;

  // Perform request to export endpoint
  const response = await api.get("/reports/export", {
    params: { format, ...queryParams },
    responseType: "blob",
  });

  const contentType = response.headers["content-type"] || "";
  const isJson = contentType.includes("application/json");

  // Handle Async Queue mode (HTTP 202) or JSON responses
  if (response.status === 202 || isJson) {
    const text = await response.data.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response format");
    }

    if (json.error || (json.message && !json.data?.export_key)) {
      throw new Error(json.message || json.error || "Failed to generate report export");
    }

    const exportKey = json.data?.export_key;
    if (exportKey) {
      // Poll status every 1.5 seconds for up to 60 seconds
      let statusData;
      for (let i = 0; i < 40; i++) {
        await new Promise((res) => setTimeout(res, 1500));
        statusData = await checkExportStatusApi(exportKey);
        if (statusData?.status === "done") break;
        if (statusData?.status === "failed" || statusData?.status === "expired") {
          throw new Error(statusData.error || `Report export ${statusData.status}`);
        }
      }

      if (statusData?.status === "done") {
        const fileBlob = await downloadExportFileApi(exportKey);
        return {
          data: fileBlob,
          format,
          status: 200,
        };
      } else {
        throw new Error("Export generation timed out. Please try a shorter period or filter.");
      }
    }
  }

  // Inspect first 100 characters of blob data to prevent saving JSON/HTML error pages as PDF
  const textPreview = await response.data.slice(0, 100).text();
  if (
    textPreview.trim().startsWith("{") ||
    textPreview.trim().startsWith("<!DOCTYPE") ||
    textPreview.trim().startsWith("<html")
  ) {
    let errorMsg = "Failed to export report";
    try {
      const parsed = JSON.parse(textPreview);
      errorMsg = parsed.message || parsed.error || errorMsg;
    } catch {
      // Ignore JSON parse errors and fallback to default errorMsg
    }
    throw new Error(errorMsg);
  }

  return {
    data: response.data,
    format,
    status: response.status,
  };
};
