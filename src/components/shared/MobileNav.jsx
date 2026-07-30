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
  LogOut
} from "lucide-react";
import { SlideSheet } from "./SlideSheet";
import { useAuth } from "@/hooks/useAuth";

export function MobileNav({ theme, toggleTheme }) {
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setShowMoreSheet(false);
    await logout();
    navigate("/login");
  };

  const mainNavItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/accounts", label: "Accounts", icon: Wallet },
    { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { to: "/budgets", label: "Budgets", icon: TrendingUp },
  ];

  // Check if current path matches any item inside More sheet
  const moreSubPaths = ["/goals", "/categories", "/reports", "/settings"];
  const isMoreActive = moreSubPaths.includes(location.pathname);

  return (
    <>
      {/* FIXED BOTTOM NAVBAR (MOBILE ONLY) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0D0D0F]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)] px-2 py-2 safe-area-pb">
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
                      ? "text-emerald-400 font-semibold scale-105"
                      : "text-gray-400 hover:text-gray-200"
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
                ? "text-emerald-400 font-semibold scale-105"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <MoreHorizontal size={20} />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* MOBILE SLIDE-UP SHEET FOR "MORE" OPERATIONS */}
      <SlideSheet
        isOpen={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
        title="More Operations"
      >
        <div className="space-y-4 pb-4">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2 px-1">
              Extended Features
            </p>

            <div className="space-y-2">
              {/* Savings Goals */}
              <button
                type="button"
                onClick={() => {
                  navigate("/goals");
                  setShowMoreSheet(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  location.pathname === "/goals"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-[#1C1C1F] border-transparent text-gray-300 hover:bg-[#252529] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-cyan-400" />
                  <span className="text-xs font-semibold">Savings Goals</span>
                </div>
                <span className="text-[12px] text-gray-500">→</span>
              </button>

              {/* Category Mapping */}
              <button
                type="button"
                onClick={() => {
                  navigate("/categories");
                  setShowMoreSheet(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  location.pathname === "/categories"
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-[#1C1C1F] border-transparent text-gray-300 hover:bg-[#252529] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tag size={18} className="text-purple-400" />
                  <span className="text-xs font-semibold">Category Mapping</span>
                </div>
                <span className="text-[12px] text-gray-500">→</span>
              </button>

              {/* Reports */}
              <button
                type="button"
                onClick={() => {
                  navigate("/reports");
                  setShowMoreSheet(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  location.pathname === "/reports"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-[#1C1C1F] border-transparent text-gray-300 hover:bg-[#252529] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} className="text-emerald-400" />
                  <span className="text-xs font-semibold">Reports & Analytics</span>
                </div>
                <span className="text-[12px] text-gray-500">→</span>
              </button>

              {/* System Preferences */}
              <button
                type="button"
                onClick={() => {
                  navigate("/settings");
                  setShowMoreSheet(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  location.pathname === "/settings"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-[#1C1C1F] border-transparent text-gray-300 hover:bg-[#252529] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-amber-400" />
                  <span className="text-xs font-semibold">System preferences</span>
                </div>
                <span className="text-[12px] text-gray-500">→</span>
              </button>
            </div>
          </div>

          {/* PREFERENCES & ACCOUNT */}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2 px-1">
              Preferences & Account
            </p>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1C1C1F] border border-transparent text-gray-300 hover:bg-[#252529] hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
                <span className="text-xs font-semibold">
                  Theme: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <span className="text-[11px] text-gray-500 capitalize">{theme}</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <span className="text-xs font-semibold">Log out</span>
              </div>
            </button>
          </div>
        </div>
      </SlideSheet>
    </>
  );
}

export default MobileNav;
