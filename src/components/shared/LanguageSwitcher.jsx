import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGES } from "@/locales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher({ className = "", variant = "default" }) {
  const { language, setLanguage } = useLanguage();
  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "compact" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-9 px-2.5 rounded-xl border border-border/30 bg-secondary/30 hover:bg-secondary/70 text-foreground flex items-center gap-1.5 transition-all duration-200 cursor-pointer text-xs font-semibold ${className}`}
          >
            <span className="text-sm leading-none">{currentLang.flag}</span>
            <span className="uppercase tracking-wider">{currentLang.code}</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className={`h-9 px-3 rounded-xl border border-border/40 bg-secondary/40 hover:bg-secondary/70 hover:border-border text-foreground flex items-center gap-2 transition-all duration-200 cursor-pointer text-xs font-semibold shadow-xs ${className}`}
          >
            <span className="text-base leading-none">{currentLang.flag}</span>
            <span className="font-medium">{currentLang.label}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-popover/95 backdrop-blur-md border border-border/50 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
          <Globe className="h-3 w-3" />
          <span>Language</span>
        </div>
        {LANGUAGES.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                isSelected
                  ? "bg-income/10 text-income font-bold"
                  : "text-foreground hover:bg-secondary/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-income shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
