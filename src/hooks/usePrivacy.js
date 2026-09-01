import { useContext } from "react";
import { PrivacyContext } from "@/contexts/privacy-context-definition";

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
}
