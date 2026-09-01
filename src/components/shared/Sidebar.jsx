import { NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { usePrivacy } from "@/hooks/usePrivacy";
import { useTranslation } from "@/hooks/useLanguage";

export function Sidebar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const userName = user?.name || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  const { isPrivate, togglePrivacy } = usePrivacy();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-border/40 bg-card p-6 transition-all duration-300 z-40">
      {/* Logo */}
      <NavLink to="/" className="group logo-container flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity">
        <Logo className="h-20 w-auto text-income" />
      </NavLink>

      {/* Quick Command Trigger */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
        }}
        className="flex items-center justify-between w-full px-3.5 py-2.5 mb-5 rounded-2xl bg-secondary/40 hover:bg-secondary/70 border border-border/40 text-muted-foreground hover:text-foreground text-xs font-medium transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          <span>{t("common.quickActions")}</span>
        </div>
        <kbd className="px-1.5 py-0.5 font-mono text-[10px] font-bold bg-card border border-border/50 rounded-md">
          ⌘K
        </kbd>
      </button>

      {/* Navigation links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${isActive
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.translationKey ? t(item.translationKey) : item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Theme Switcher & Logout */}
      <div className="border-t border-border/40 pt-4 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {/* AVATAR / FALLBACK LETTER */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={userName}
              className="h-8 w-8 rounded-full object-cover shrink-0 border border-border/40"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm shrink-0">
              {avatarLetter}
            </div>
          )}

          <span className="text-sm font-medium text-foreground truncate" title={userName}>
            {userName}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <LanguageSwitcher variant="compact" />

          <Button
            variant="ghost"
            size="icon"
            onClick={togglePrivacy}
            className={`h-9 w-9 rounded-xl border border-border/20 transition-all duration-300 cursor-pointer ${
              isPrivate ? "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            title={isPrivate ? t("privacy.disable") : t("privacy.enable")}
            aria-label={t("privacy.title")}
          >
            {isPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-border/20 bg-secondary/50 hover:bg-accent hover:text-accent-foreground text-foreground transition-all duration-300 overflow-hidden cursor-pointer"
            aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
            title={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
          >
            <div className="relative h-full w-full flex items-center justify-center">
              <Sun
                className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 transform ${theme === "dark"
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                  }`}
              />
              <Moon
                className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 transform ${theme === "dark"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                  }`}
              />
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 rounded-xl border border-border/20 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-300 cursor-pointer"
            aria-label={t("nav.logout")}
            title={t("nav.logout")}
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
