import { LayoutDashboard, Wallet, ArrowLeftRight, FolderTree, TrendingUp, PiggyBank, BarChart3, Settings } from "lucide-react";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", translationKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", translationKey: "nav.accounts", icon: Wallet },
  { to: "/transactions", label: "Transactions", translationKey: "nav.transactions", icon: ArrowLeftRight },
  { to: "/categories", label: "Categories", translationKey: "nav.categories", icon: FolderTree },
  { to: "/budgets", label: "Budgets", translationKey: "nav.budgets", icon: TrendingUp },
  { to: "/goals", label: "Goals", translationKey: "nav.goals", icon: PiggyBank },
  { to: "/reports", label: "Reports", translationKey: "nav.reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", translationKey: "nav.settings", icon: Settings },
];
