import { LayoutDashboard, Wallet, ArrowLeftRight, FolderTree, TrendingUp, PiggyBank, BarChart3, Settings } from "lucide-react";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/budgets", label: "Budgets", icon: TrendingUp },
  { to: "/goals", label: "Goals", icon: PiggyBank },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];
