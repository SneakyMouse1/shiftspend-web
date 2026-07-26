import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoalApi, createGoalApi, updateGoalApi, deleteGoalApi, depositGoalApi } from "@/api/goals";
import { toast } from "sonner";

// reading all the goals from back - the info is fresh during 5 minutes
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: getGoalApi,
    staleTime: 5 * 60 * 1000,
  });
}

// to create new goal
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal created successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create goal");
    },
  });
}

// to update goal
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedData }) => updateGoalApi(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save changes");
    },
  });
}

// to delete goal
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal deleted");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete goal");
    },
  });
}


// to add a deposit to a goal
export function useDepositGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => depositGoalApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Deposit added successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add deposit");
    },
  });
}