import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactionsApi, createTransactionApi, deleteTransactionApi, updateTransactionApi } from "@/api/transactions";
import { toast } from "sonner";

export function useTransactions(filters = {}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => getTransactionsApi(filters),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] }); // added for changes in budget
      toast.success("Transaction recorded successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to record transaction");
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateTransactionApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Transaction updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to update transaction");
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to delete transaction");
    },
  });
}
