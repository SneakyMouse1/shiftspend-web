import { NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";
import { Logo } from "@/components/shared/Logo";

import { useAuth } from "@/hooks/useAuth";

export function Sidebar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-border/40 bg-card p-6 transition-all duration-300 z-40">
      {/* Logo */}
      <NavLink to="/" className="group logo-container flex items-center gap-2 mb-8 hover:opacity-90 transition-opacity">
        <Logo className="h-20 w-auto text-income" />
      </NavLink>

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
              <span>{item.label}</span>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-border/20 bg-secondary/50 hover:bg-accent hover:text-accent-foreground text-foreground transition-all duration-300 overflow-hidden cursor-pointer"
            aria-label="Toggle theme"
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
            aria-label="Log out"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
