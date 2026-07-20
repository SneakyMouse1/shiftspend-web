import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTagsApi, createTagApi } from "@/api/tags";
import { toast } from "sonner";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTagsApi,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to create tag");
    },
  });
}
