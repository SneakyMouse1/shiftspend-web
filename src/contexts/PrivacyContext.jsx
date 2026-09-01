import { useState, useEffect } from "react";
import { PrivacyContext } from "./privacy-context-definition";

export function PrivacyProvider({ children }) {
  const [isPrivate, setIsPrivate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("privacy_mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("privacy_mode", String(isPrivate));
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("privacy-mode", isPrivate);
    }
  }, [isPrivate]);

  const togglePrivacy = () => setIsPrivate((prev) => !prev);

  return (
    <PrivacyContext.Provider value={{ isPrivate, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
}

