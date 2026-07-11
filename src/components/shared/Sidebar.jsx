import { NavLink } from "react-router-dom";
import { Sun, Moon, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";

export function Sidebar({ theme, toggleTheme }) {


  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-border/40 bg-card p-6 transition-all duration-300 z-40">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-8 hover:opacity-90 transition-opacity">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-income to-chart-3 text-primary-foreground shadow-md glow-income">
          <TrendingUp className="h-5 w-5" />
        </div>
        <span className="bg-gradient-to-r from-foreground via-foreground to-income bg-clip-text text-transparent font-extrabold">
          Finance<span className="text-income">Flow</span>
        </span>
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
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
                  isActive
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

      {/* Footer / Theme Switcher */}
      <div className="border-t border-border/40 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
            U
          </div>
          <span className="text-sm font-medium text-muted-foreground">User</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl border border-border/20 bg-secondary/50 hover:bg-accent hover:text-accent-foreground text-foreground transition-all duration-300 overflow-hidden"
          aria-label="Toggle theme"
        >
          <div className="relative h-full w-full flex items-center justify-center">
            <Sun
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 transform ${
                theme === "dark"
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <Moon
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 transform ${
                theme === "dark"
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </div>
        </Button>
      </div>
    </aside>
  );
}
