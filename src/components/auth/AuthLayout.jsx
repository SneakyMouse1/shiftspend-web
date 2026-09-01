import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Top right language switcher */}
      <div className="absolute top-5 right-5 z-20">
        <LanguageSwitcher variant="compact" />
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[280px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--income)" }}
      />

      <div className="w-full max-w-sm relative">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 font-bold text-xl tracking-tight mb-8"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground to-income bg-clip-text text-transparent font-extrabold">
            Shift <span className="text-income">Spend</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}