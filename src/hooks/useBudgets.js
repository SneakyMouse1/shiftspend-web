import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudgetApi, createBudgetApi, updateBudgetApi, deleteBudgetApi } from "@/api/budgets";
import { toast } from "sonner";

// reading all the budgets from back - the info is fresh during 5 minutes
export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgetApi,
    staleTime: 5 * 60 * 1000,
  });
}

// to create new budget
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudgetApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget created successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create budget");
    },
  });
}

// to update budget
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedData }) => updateBudgetApi(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save changes");
    },
  });
}

// to delete budget
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget deleted");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete budget");
    },
  });
}