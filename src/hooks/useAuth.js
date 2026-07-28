import { useContext } from "react";
import { AuthContext } from "@/contexts/auth-context-definition";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


export function useUpdateProfile() {
  const { updateProfile } = useAuth();

  return useMutation({
    mutationFn: (formData) => updateProfile(formData),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
}