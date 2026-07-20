import {
  CreditCard,
  Wallet,
  Coins,
  ShieldCheck,
  TrendingUp,
  Landmark,
} from "lucide-react";

export const ACCOUNT_TYPES = [
  { value: "card",       label: "Checking / Card",   color: "#06b6d4", icon: CreditCard },
  { value: "cash",       label: "Cash / Wallet",     color: "#94a3b8", icon: Wallet },
  { value: "crypto",     label: "Crypto Wallet",     color: "#a855f7", icon: Coins },
  { value: "deposit",    label: "Savings Deposit",   color: "#4ade80", icon: ShieldCheck },
  { value: "investment", label: "Brokerage / Asset", color: "#f59e0b", icon: TrendingUp },
  { value: "paypal",     label: "PayPal",            color: "#3b82f6", icon: Landmark },
];

export const getAccountType = (value) =>
  ACCOUNT_TYPES.find((t) => t.value === value) ?? {
    value,
    label: value,
    color: "#64748b",
    icon: Wallet,
  };
