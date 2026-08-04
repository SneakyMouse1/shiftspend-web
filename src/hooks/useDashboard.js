import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "@/api/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
    // Keep data fresh for 1 minute to avoid unnecessary API calls
    staleTime: 60 * 1000,
  });
}
