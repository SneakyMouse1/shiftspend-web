import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { usePrivacy } from "@/hooks/usePrivacy";
import { useAuth } from "@/hooks/useAuth";

export function MobileHeader() {
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { user } = useAuth();
  const userName = user?.name || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="md:hidden sticky top-0 z-30 w-full bg-card/85 backdrop-blur-xl border-b border-border/40 px-4 py-2.5 flex items-center justify-between transition-colors">
      <Link to="/" className="flex items-center gap-2">
        <Logo className="h-10 w-auto text-income" />
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={togglePrivacy}
          className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 ${
            isPrivate
              ? "bg-amber-500/15 border-amber-500/30 text-amber-500"
              : "bg-secondary/60 border-border/40 text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Toggle privacy mode"
          title={isPrivate ? "Disable privacy mode" : "Enable privacy mode (hide balances)"}
        >
          {isPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        <Link to="/settings" className="flex items-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={userName}
              className="h-8 w-8 rounded-xl object-cover border border-border/40"
            />
          ) : (
            <div className="h-8 w-8 rounded-xl bg-secondary border border-border/40 flex items-center justify-center font-bold text-xs text-foreground">
              {avatarLetter}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}

export default MobileHeader;
