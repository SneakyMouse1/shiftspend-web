import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  MoreHorizontal,
  Trophy,
  Tag,
  BarChart3,
  Settings,
  Sun,
  Moon,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { usePrivacy } from "@/hooks/usePrivacy";
import { useTranslation } from "@/hooks/useLanguage";

export function MobileNav({ theme, toggleTheme }) {
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { t } = useTranslation();

  const handleLogout = async () => {
    setShowMoreSheet(false);
    await logout();
    navigate("/login");
  };

  const mainNavItems = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutGrid },
    { to: "/accounts", label: t("nav.accounts"), icon: Wallet },
    { to: "/transactions", label: t("nav.transactions"), icon: ArrowLeftRight },
    { to: "/budgets", label: t("nav.budgets"), icon: TrendingUp },
  ];

  const moreSubPaths = ["/goals", "/categories", "/reports", "/settings"];
  const isMoreActive = moreSubPaths.includes(location.pathname);

  return (
    <>
      {/* FIXED BOTTOM NAVBAR (MOBILE ONLY) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/90 backdrop-blur-xl border-t border-border/60 px-2 py-2 safe-area-pb shadow-lg">
        <div className="grid grid-cols-5 items-center justify-items-center">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-emerald-500 dark:text-emerald-400 font-semibold scale-105"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </NavLink>
            );
          })}

          {/* 5th Item: MORE Button */}
          <button
            type="button"
            onClick={() => setShowMoreSheet(true)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isMoreActive || showMoreSheet
                ? "text-emerald-500 dark:text-emerald-400 font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MoreHorizontal size={20} />
            <span className="text-[10px] tracking-tight">{t("nav.more")}</span>
          </button>
        </div>
      </nav>

      {/* MOBILE SLIDE-UP SHEET FOR "MORE" OPERATIONS */}
      <Dialog open={showMoreSheet} onOpenChange={setShowMoreSheet}>
        <DialogContent className="modal-theme md:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">{t("nav.more")}</DialogTitle>
            <DialogDescription className="hidden">Extended features</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-2 px-1">
                {t("commandPalette.navigationGroup")}
              </p>

              <div className="space-y-2">
                {/* Savings Goals */}
                <button
                  type="button"
                  onClick={() => {
                    navigate("/goals");
                    setShowMoreSheet(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    location.pathname === "/goals"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 dark:text-cyan-400"
                      : "bg-secondary/40 border-border/40 text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trophy size={18} className="text-cyan-500 dark:text-cyan-400" />
                    <span className="text-xs font-semibold">{t("nav.goals")}</span>
                  </div>
                  <span className="text-[12px] text-muted-foreground">→</span>
                </button>

                {/* Category Mapping */}
                <button
                  type="button"
                  onClick={() => {
                    navigate("/categories");
                    setShowMoreSheet(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    location.pathname === "/categories"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-500 dark:text-purple-400"
                      : "bg-secondary/40 border-border/40 text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-purple-500 dark:text-purple-400" />
                    <span className="text-xs font-semibold">{t("nav.categories")}</span>
                  </div>
                  <span className="text-[12px] text-muted-foreground">→</span>
                </button>

                {/* Reports */}
                <button
                  type="button"
                  onClick={() => {
                    navigate("/reports");
                    setShowMoreSheet(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    location.pathname === "/reports"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                      : "bg-secondary/40 border-border/40 text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 size={18} className="text-emerald-500 dark:text-emerald-400" />
                    <span className="text-xs font-semibold">{t("nav.reports")}</span>
                  </div>
                  <span className="text-[12px] text-muted-foreground">→</span>
                </button>

                {/* System Preferences */}
                <button
                  type="button"
                  onClick={() => {
                    navigate("/settings");
                    setShowMoreSheet(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    location.pathname === "/settings"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400"
                      : "bg-secondary/40 border-border/40 text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} className="text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-semibold">{t("nav.settings")}</span>
                  </div>
                  <span className="text-[12px] text-muted-foreground">→</span>
                </button>
              </div>
            </div>

            {/* PREFERENCES & ACCOUNT */}
            <div className="pt-2 border-t border-border/40 space-y-2">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-2 px-1">
                {t("commandPalette.actionsGroup")}
              </p>

              {/* Privacy Mode Toggle */}
              <button
                type="button"
                onClick={togglePrivacy}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border/40 text-foreground hover:bg-secondary/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {isPrivate ? (
                    <EyeOff size={18} className="text-amber-500" />
                  ) : (
                    <Eye size={18} className="text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold">{t("privacy.title")}</span>
                </div>
                <span className={`text-[11px] font-mono font-bold ${isPrivate ? "text-amber-500" : "text-muted-foreground"}`}>
                  {isPrivate ? t("common.yes") : t("common.no")}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border/40 text-foreground hover:bg-secondary/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Sun size={18} className="text-amber-400" />
                  ) : (
                    <Moon size={18} className="text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold">
                    {theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase">
                  {theme}
                </span>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} />
                  <span className="text-xs font-semibold">{t("nav.logout")}</span>
                </div>
                <span className="text-[12px] text-destructive/80">→</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MobileNav;
