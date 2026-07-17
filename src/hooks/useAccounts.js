import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "@/api/accounts";
import { toast } from "sonner";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create account");
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update account");
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete account");
    },
  });
}
