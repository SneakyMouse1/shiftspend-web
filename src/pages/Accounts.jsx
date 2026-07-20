import { useState } from "react";
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from "@/hooks/useAccounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Check,
  Loader2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { ACCOUNT_TYPES, getAccountType } from "@/config/accountTypes";

const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "CNY", label: "CNY (¥)" },
  { code: "JPY", label: "JPY (¥)" },
  { code: "RUB", label: "RUB (₽)" },
];

const ACCENT_COLORS = [
  { value: "#06b6d4", bg: "bg-cyan-500" },
  { value: "#10b981", bg: "bg-emerald-500" },
  { value: "#8b5cf6", bg: "bg-purple-500" },
  { value: "#f97316", bg: "bg-orange-500" },
  { value: "#eab308", bg: "bg-yellow-500" },
  { value: "#ec4899", bg: "bg-pink-500" },
];

export default function Accounts() {
  const { data: accounts = [], isLoading, isError, refetch } = useAccounts();

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // Active account being edited / deleted
  const [activeAccount, setActiveAccount] = useState(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formBalance, setFormBalance] = useState("0.00");
  const [formType, setFormType] = useState("card");
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formColor, setFormColor] = useState("#06b6d4");

  // Helpers
  const getCurrencySymbol = (code) => {
    switch (code?.toUpperCase()) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "CNY": return "¥";
      case "JPY": return "¥";
      case "RUB": return "₽";
      default: return "$";
    }
  };

  const getIconForType = (type) => getAccountType(type).icon;
  const getLabelForType = (type) => getAccountType(type).label;

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setActiveAccount(null);
    setFormName("");
    setFormBalance("0.00");
    setFormType("card");
    setFormCurrency("USD");
    setFormColor("#06b6d4");
    setModalOpen(true);
  };

  const handleOpenEdit = (account) => {
    setIsEditMode(true);
    setActiveAccount(account);
    setFormName(account.name);
    setFormBalance(Number(account.balance).toFixed(2));
    setFormType(account.type);
    setFormCurrency(account.currency_code);
    setFormColor(account.color || "#06b6d4");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload = {
      name: formName,
      type: formType,
      currency_code: formCurrency,
      balance: parseFloat(formBalance) || 0,
      color: formColor,
      icon: formType, // Keep icon in sync with selected type
    };

    if (isEditMode && activeAccount) {
      await updateMutation.mutateAsync({ id: activeAccount.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setModalOpen(false);
  };

  const handleDeleteClick = () => {
    setModalOpen(false);
    setDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (activeAccount) {
      await deleteMutation.mutateAsync(activeAccount.id);
      setActiveAccount(null);
    }
    setDeleteAlertOpen(false);
  };

  // Rendering logic
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-border/40 bg-card rounded-3xl min-h-75 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Failed to load accounts</h3>
          <p className="text-sm text-muted-foreground">There was an error connecting to the API server.</p>
        </div>
        <Button onClick={refetch} variant="outline" className="rounded-xl">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Accounts</h2>
          <p className="text-muted-foreground text-xs">Manage checking, cash, savings, and investments</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="rounded-xl bg-secondary hover:bg-accent border border-border/40 text-foreground flex items-center gap-1.5 text-xs font-semibold px-4 py-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Grid Accounts List */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/30 bg-card p-5 h-35 flex flex-col justify-between animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded w-1/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-3xl min-h-62.5 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-md font-bold">No accounts found</h3>
            <p className="text-xs text-muted-foreground">Add your checking cards, cash, or deposits to get started.</p>
          </div>
          <Button onClick={handleOpenCreate} variant="secondary" className="rounded-xl text-xs font-semibold">
            Create First Account
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {accounts.map((account) => {
            const TypeIcon = getIconForType(account.type);
            const symbol = getCurrencySymbol(account.currency_code);
            return (
              <div
                key={account.id}
                onClick={() => handleOpenEdit(account)}
                className="rounded-2xl border border-border/40 bg-card p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-35 cursor-pointer hover:border-border/80 group"
                style={{ borderLeft: `4px solid ${account.color || "var(--border)"}` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/20 group-hover:bg-secondary transition-colors">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight text-foreground truncate max-w-30">
                        {account.name}
                      </h3>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        {getLabelForType(account.type)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/85 font-bold text-muted-foreground uppercase">
                    {account.currency_code}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
                    Available Balance
                  </span>
                  <div className="text-xl font-bold tracking-tight font-mono">
                    {symbol}
                    {Number(account.balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Centered Dialog Modal for Create/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-105 p-6 rounded-3xl bg-card border border-border/40 shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              {isEditMode ? "Modify Financial Account" : "Setup New Account"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Account Balance Box */}
            <div className="bg-secondary/20 rounded-2xl p-4 flex flex-col items-center justify-center border border-border/20">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Account Balance
              </span>
              <div className="flex items-center justify-center gap-1.5 w-full">
                <span className="text-2xl font-semibold text-muted-foreground">
                  {getCurrencySymbol(formCurrency)}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formBalance}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow only digits and optional decimal dot
                    if (/^\d*\.?\d*$/.test(val)) {
                      setFormBalance(val);
                    }
                  }}
                  onBlur={() => {
                    // Normalize float on blur
                    const parsed = parseFloat(formBalance);
                    setFormBalance(isNaN(parsed) ? "0.00" : parsed.toFixed(2));
                  }}
                  className="bg-transparent text-3xl font-extrabold text-center tracking-tight font-mono focus:outline-none w-48 text-foreground"
                />
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Account Display Name
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Chase Premium checking, Cash, cold wallet..."
                className="rounded-xl border-border/40 bg-card h-11 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-emerald-500/20"
                required
              />
            </div>

            {/* Account Type selectable cards */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {ACCOUNT_TYPES.map((type) => {
                  const TypeIcon = type.icon;
                  const isSelected = formType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormType(type.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer justify-start text-left ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500"
                          : "border-border/40 bg-card text-muted-foreground hover:bg-secondary/30"
                      }`}
                    >
                      <TypeIcon className={`h-4 w-4 shrink-0 ${isSelected ? "text-emerald-500" : ""}`} />
                      <span className="truncate">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currency & Color row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Currency Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Currency
                </label>
                <Select value={formCurrency} onValueChange={setFormCurrency}>
                  <SelectTrigger className="w-full h-11 bg-card border-border/40 rounded-xl text-sm">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Accent Color picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Theme Accent
                </label>
                <div className="flex flex-wrap items-center gap-2 h-11">
                  {ACCENT_COLORS.map((color) => {
                    const isSelected = formColor.toLowerCase() === color.value.toLowerCase();
                    return (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormColor(color.value)}
                        className="h-7 w-7 rounded-full border border-border/20 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 relative"
                        style={{ backgroundColor: color.value }}
                      >
                        {isSelected && (
                          <Check className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Save Changes" : "Create Account"}
              </Button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-full text-center text-rose-500 hover:text-rose-600 font-semibold cursor-pointer text-sm py-2 mt-2 hover:underline transition-all block"
                >
                  Delete This Account
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="max-w-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the financial account
              <strong className="text-foreground"> "{activeAccount?.name}"</strong> and all its associated transaction data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
