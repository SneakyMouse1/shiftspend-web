import { useContext } from "react";
import { AuthContext } from "@/contexts/auth-context-definition";
import { useMutation } from "@tanstack/react-query";
import { changePassword as apiChangePassword } from "@/api/auth";
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


export function useChangePassword() {
  return useMutation({
    mutationFn: (payload) => apiChangePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      console.error(error);

      if (error?.errors) {
        const errorMessages = Object.values(error.errors).flat();
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0]);
          return;
        }
      }

      toast.error(error?.message || "Failed to change password");
    },
  });
}



export function useDeleteUserAccount() {
  const { deleteAccount } = useAuth();

  return useMutation({
    mutationFn: (payload) => deleteAccount(payload),
    onSuccess: () => {
      toast.success("Account deleted successfully.");
    },
    onError: (error) => {
      console.error(error);

      if (error?.errors) {
        const errorMessages = Object.values(error.errors).flat();
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0]);
          return;
        }
      }

      toast.error(error?.message || "Failed to delete account");
    },
  });
}