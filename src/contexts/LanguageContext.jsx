import { useState, useEffect, useCallback } from "react";
import { LanguageContext } from "./language-context-definition";
import { translations, DEFAULT_LANGUAGE } from "@/locales";

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved && translations[saved]) return saved;

      // Auto-detect browser language
      const browserLangs = navigator.languages || [navigator.language || ""];
      for (const rawLang of browserLangs) {
        if (!rawLang) continue;
        const code = rawLang.toLowerCase().split("-")[0];
        if (code && translations[code]) {
          return code;
        }
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((newLang) => {
    if (translations[newLang]) {
      setLanguageState(newLang);
      localStorage.setItem("language", newLang);
      document.documentElement.lang = newLang;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (keyPath, params = {}) => {
      if (!keyPath || typeof keyPath !== "string") return "";

      const keys = keyPath.split(".");
      let current = translations[language];

      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          // Fallback to English, then Russian
          let fallback = translations.en;
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in fallback) {
              fallback = fallback[fk];
            } else {
              fallback = null;
              break;
            }
          }
          if (!fallback) {
            fallback = translations.ru;
            for (const fk of keys) {
              if (fallback && typeof fallback === "object" && fk in fallback) {
                fallback = fallback[fk];
              } else {
                fallback = null;
                break;
              }
            }
          }
          current = fallback || keyPath;
          break;
        }
      }

      if (typeof current === "string") {
        let text = current;
        for (const [paramKey, paramValue] of Object.entries(params)) {
          text = text.replaceAll(`{{${paramKey}}}`, String(paramValue));
        }
        return text;
      }

      return keyPath;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
