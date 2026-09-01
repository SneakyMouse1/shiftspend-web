import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  Trophy,
  Tag,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Plus,
  Command,
  X,
  Languages,
} from "lucide-react";
import { usePrivacy } from "@/hooks/usePrivacy";
import { useTranslation } from "@/hooks/useLanguage";

export function CommandPalette({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { isPrivate, togglePrivacy } = usePrivacy();
  const { t, language, setLanguage } = useTranslation();

  const closePalette = () => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const allItems = useMemo(() => [
    // Navigation items
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-dashboard",
      label: t("nav.dashboard"),
      description: t("dashboard.subtitle"),
      icon: LayoutGrid,
      action: () => navigate("/dashboard"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-accounts",
      label: t("nav.accounts"),
      description: t("accounts.subtitle"),
      icon: Wallet,
      action: () => navigate("/accounts"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-transactions",
      label: t("nav.transactions"),
      description: t("transactions.subtitle"),
      icon: ArrowLeftRight,
      action: () => navigate("/transactions"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-budgets",
      label: t("nav.budgets"),
      description: t("budgets.subtitle"),
      icon: TrendingUp,
      action: () => navigate("/budgets"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-goals",
      label: t("nav.goals"),
      description: t("goals.subtitle"),
      icon: Trophy,
      action: () => navigate("/goals"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-categories",
      label: t("nav.categories"),
      description: t("categories.subtitle"),
      icon: Tag,
      action: () => navigate("/categories"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-reports",
      label: t("nav.reports"),
      description: t("reports.subtitle"),
      icon: BarChart3,
      action: () => navigate("/reports"),
    },
    {
      group: t("commandPalette.navigationGroup"),
      id: "nav-settings",
      label: t("nav.settings"),
      description: t("settings.subtitle"),
      icon: Settings,
      action: () => navigate("/settings"),
    },

    // Quick Actions
    {
      group: t("commandPalette.actionsGroup"),
      id: "act-add-tx",
      label: t("transactions.newTransaction"),
      description: t("transactions.addTransaction"),
      icon: Plus,
      action: () => navigate("/transactions"),
    },
    {
      group: t("commandPalette.actionsGroup"),
      id: "act-privacy",
      label: isPrivate ? t("privacy.disable") : t("privacy.enable"),
      description: t("privacy.description"),
      icon: isPrivate ? EyeOff : Eye,
      action: () => togglePrivacy(),
    },
    {
      group: t("commandPalette.actionsGroup"),
      id: "act-theme",
      label: theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark"),
      description: "Toggle theme",
      icon: theme === "dark" ? Sun : Moon,
      action: () => toggleTheme(),
    },
    {
      group: t("commandPalette.actionsGroup"),
      id: "act-lang-ru",
      label: "Язык: Русский (RU)",
      description: language === "ru" ? "Активный язык" : "Переключить интерфейс на русский",
      icon: Languages,
      action: () => setLanguage("ru"),
    },
    {
      group: t("commandPalette.actionsGroup"),
      id: "act-lang-es",
      label: "Idioma: Español (ES)",
      description: language === "es" ? "Idioma activo" : "Cambiar la interfaz a español",
      icon: Languages,
      action: () => setLanguage("es"),
    },
    {
      group: t("commandPalette.actionsGroup"),
      id: "act-lang-en",
      label: "Language: English (EN)",
      description: language === "en" ? "Active language" : "Switch interface to English",
      icon: Languages,
      action: () => setLanguage("en"),
    },
  ], [navigate, isPrivate, togglePrivacy, theme, toggleTheme, t, language, setLanguage]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Handle keyboard arrows navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        closePalette();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={closePalette}
    >
      <div
        className="w-full max-w-xl bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("commandPalette.placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground bg-secondary/80 border border-border/40 rounded-lg">
            ESC
          </kbd>
          <button
            type="button"
            onClick={closePalette}
            className="sm:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {t("commandPalette.noResults")}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    closePalette();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-secondary text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border border-border/30 ${
                        isSelected ? "bg-card text-foreground" : "bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate text-foreground">
                        {item.label}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase text-muted-foreground/60 px-2 py-0.5 rounded bg-secondary/60 shrink-0 ml-2">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-secondary/20 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-secondary/60 border border-border/40 rounded text-[9px]">↑↓</kbd> {t("commandPalette.shortcutsHelper.navigate")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-secondary/60 border border-border/40 rounded text-[9px]">↵</kbd> {t("commandPalette.shortcutsHelper.select")}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" /> ShiftSpend
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
