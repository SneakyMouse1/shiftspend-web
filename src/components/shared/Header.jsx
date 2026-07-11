import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, TrendingUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";

export function Header({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <header className="md:hidden sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-income to-chart-3 text-primary-foreground shadow-sm">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground to-income bg-clip-text text-transparent font-extrabold text-lg">
            Finance<span className="text-income">Flow</span>
          </span>
        </NavLink>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-border/20 bg-secondary/50 hover:bg-accent hover:text-accent-foreground text-foreground transition-all duration-300 overflow-hidden"
            aria-label="Toggle theme"
          >
            <div className="relative h-full w-full flex items-center justify-center">
              <Sun
                className={`absolute h-[1.1rem] w-[1.1rem] transition-all duration-500 transform ${
                  theme === "dark"
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <Moon
                className={`absolute h-[1.1rem] w-[1.1rem] transition-all duration-500 transform ${
                  theme === "dark"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </div>
          </Button>

          {/* Hamburger Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 rounded-xl border border-border/20 bg-secondary/50 hover:bg-accent hover:text-accent-foreground text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="border-b border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
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
        </div>
      )}
    </header>
  );
}
