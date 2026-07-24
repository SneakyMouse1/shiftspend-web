import { useState } from "react";
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreateTransaction } from "@/hooks/useTransactions";

import { Plus, Loader2, CheckCircle2, AlertTriangle, Calendar, MoreVertical, Pencil, Trash2, Wallet } from "lucide-react";
import { getIconComponent } from "@/config/categoryIcons";
import { CURRENCIES, getCurrencySymbol } from "@/config/currencies";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const INITIAL_CREATE_STATE = {
  amount: "",
  category_id: "",
  period: "monthly",
  currency_code: "EUR"
};

const INITIAL_EXPENSE_STATE = {
  account_id: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  comment: "",
};


export default function Budgets() {

  const { data: budgets = [], isLoading } = useBudgets();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const createTransactionMutation = useCreateTransaction();

  // Mutations
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();


  // State for Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(INITIAL_CREATE_STATE);


  // Unified State for Manage Modal (Edit Limit and Add Expense)
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [activeTab, setActiveTab] = useState("expense");
  const [editAmount, setEditAmount] = useState("");
  const [editPeriod, setEditPeriod] = useState("monthly");
  const [newExpense, setNewExpense] = useState(INITIAL_EXPENSE_STATE);


  // Open edit modal
  const handleOpenManageModal = (budget, tab = "edit") => {
    setSelectedBudget(budget);
    setActiveTab(tab);
    setEditAmount(budget.amount.toString());
    setEditPeriod(budget.period);
    setNewExpense(INITIAL_EXPENSE_STATE);
  };

  // Closing modal of Edit
  const handleCloseManageModal = () => {
    setSelectedBudget(null);
    setNewExpense(INITIAL_EXPENSE_STATE);
  };


  // Closing modal of creating budget
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewBudget(INITIAL_CREATE_STATE);
  };

  // Derive the unique currencies actually used across the user's accounts
  const accountCurrencies = [...new Set(accounts.map((acc) => acc.currency_code).filter(Boolean))];

  // Opening create modal — default currency comes from the user's primary (first) account
  const handleOpenCreate = () => {
    setNewBudget({
      ...INITIAL_CREATE_STATE,
      currency_code: accounts[0]?.currency_code || "EUR",
    });
    setIsCreateOpen(true);
  };


  // Update limit
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedBudget) return;

    updateMutation.mutate(
      {
        id: selectedBudget.id,
        updatedData: {
          amount: Number(editAmount) || 0,
          period: editPeriod,
        },
      },
      {
        onSuccess: () => handleCloseManageModal(),
      }
    );
  };

  // Add expense
  const handleCreateExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.account_id || !selectedBudget) return;

    const payload = {
      account_id: Number(newExpense.account_id),
      category_id: selectedBudget.category.id,
      type: "expense",
      amount: Number(newExpense.amount),
      currency_code: selectedBudget.currency_code || "EUR",
      date: newExpense.date,
      comment: newExpense.comment || undefined,
    };

    createTransactionMutation.mutate(payload, {
      onSuccess: () => handleCloseManageModal(),
    });
  };


  const expenseCategories = categories.filter((cat) => cat.type === "expense");


  // Creation of budget
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newBudget.amount || !newBudget.category_id) return;

    const payload = {
      amount: Number(newBudget.amount),
      category_id: Number(newBudget.category_id),
      period: newBudget.period,
      currency_code: newBudget.currency_code
    };

    createMutation.mutate(payload, {
      onSuccess: () => handleCloseCreate(),
    });
  };


  const getExhaustedPercentage = (spent, limit) => {
    if (!limit || limit <= 0) return 0;
    const percent = (spent / limit) * 100;
    return Math.min(Math.round(percent), 100);
  };


  // to control text/color of the status
  const getBudgetStatus = (percent) => {
    if (percent >= 100) {
      return {
        text: "OVER LIMIT",
        textColor: "text-destructive",
        barColor: "bg-destructive",
        iconColor: "var(--destructive)"
      };
    }
    if (percent >= 80) {
      return {
        text: "NEARING LIMIT",
        textColor: "text-expense",
        barColor: "bg-expense",
        iconColor: "var(--expense)"
      };
    }
    return {
      text: "ON TRACK",
      textColor: "text-income",
      barColor: "bg-income",
      iconColor: "var(--income)"
    };
  };


  // to find budgets with spent over 100%
  const exceededBudgets = budgets.filter((budget) => {
    const spent = Number(budget.spent) || 0;
    const limit = Number(budget.amount) || 0;
    const exhausted =
      typeof budget.progress_percentage !== "undefined" ? Number(budget.progress_percentage) : getExhaustedPercentage(spent, limit);

    return exhausted >= 100;
  });

  const hasExceeded = exceededBudgets.length > 0;


  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Active Budgets</h1>
          <p className="text-sm text-muted-foreground mt-1">Set limits to curb auxiliary expenses.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-muted text-primary hover:bg-muted/90 font-semibold shadow-md glow-income rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>New Limit</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-income" />
          <p className="text-sm text-muted-foreground">Fetching your budget...</p>
        </div>
      ) : (
        <>
          {hasExceeded ? (
            /* If we went over budget */
            <div className="flex items-start gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
              <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-destructive" />
              <div className="w-full">
                <h5 className="font-semibold leading-none tracking-tight text-primary">Budget Limit Exceeded!</h5>
                <p className="text-sm text-muted-foreground mt-1.5">
                  You have surpassed the allocated limits in {exceededBudgets.length} spending {exceededBudgets.length === 1 ? "category" : "categories"}. Action recommended to avoid further auxiliary drain.
                </p>

                {/* List of the categories with exceeded budget */}
                <div className="flex flex-wrap gap-3 my-4">
                  {exceededBudgets.map((b) => {
                    const spent = Number(b.spent) || 0;
                    const limit = Number(b.amount) || 0;
                    const overAmount = spent - limit;
                    const iconName = b.category?.icon || "tag";
                    const IconComponent = getIconComponent(iconName);

                    return (
                      <div key={b.id} className="w-fit flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border/10">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <IconComponent className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-primary capitalize">{b.category?.name || "Unnamed"}</span>
                          </div>
                        </div>
                        <div className="bg-destructive/20 py-1 px-2.5 rounded-lg">
                          <p className="text-xs font-semibold text-destructive">
                            Over by {getCurrencySymbol(b.currency_code)}{overAmount > 0 ? overAmount.toFixed(2) : "0.00"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* If budgets are within limits */
            <div className="flex items-start gap-4 p-4 rounded-xl border border-income/20 bg-income/5 text-income">
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-semibold leading-none tracking-tight text-primary">All Budgets Fully Secure</h5>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Excellent financial discipline! Every configured budget threshold is currently on track and fully secure.
                </p>
              </div>
            </div>
          )}



          {/* BUDGETS GRID */}
          {budgets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-secondary p-12 text-center max-w-md mx-auto mt-6">
              <div className="p-3 bg-secondary w-fit rounded-xl mx-auto text-income mb-4">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-primary">No active budgets</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                You haven't set up any budget limits yet. Create your first budget limit to keep track of your spending.
              </p>
              <Button
                onClick={handleOpenCreate}
                className="cursor-pointer bg-income text-secondary hover:bg-income/50 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Limit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const categoryName = budget.category?.name || "Unnamed Budget";
                const iconName = budget.category?.icon || "tag";

                const spent = Number(budget.spent) || 0;
                const limit = Number(budget.amount) || 0;
                const remaining = limit - spent || 0;

                const exhausted =
                  typeof budget.progress_percentage !== "undefined"
                    ? Math.round(Number(budget.progress_percentage))
                    : getExhaustedPercentage(spent, limit);

                const status = getBudgetStatus(exhausted);
                const IconComponent = getIconComponent(iconName);

                return (
                  <div
                    key={budget.id}
                    className="rounded-xl border border-secondary bg-secondary/40 p-5 flex flex-col justify-between space-y-6 transition-all duration-200 hover:border-muted"
                  >
                    <div>
                      {/* Header: Icon, Info and Dropdown Action */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-xl"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${status.iconColor} 15%, transparent)`,
                              color: status.iconColor,
                            }}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary text-lg leading-tight">{categoryName}</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span className="capitalize">{budget.period} Restriction</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge & Actions Menu */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className={`text-xs font-bold tracking-wider uppercase ${status.textColor}`}>
                              {status.text}
                            </span>
                            <p className="text-xs text-muted-foreground mt-0.5">{exhausted}% exhausted</p>
                          </div>

                          {/* DROPDOWN MENU */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 hover-glow-income transition-colors focus:outline-none cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border/40 text-foreground w-36">
                              <DropdownMenuItem
                                onClick={() => handleOpenManageModal(budget, "edit")}
                                className="cursor-pointer text-xs font-medium focus:bg-secondary"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteMutation.mutate(budget.id)}
                                className="cursor-pointer text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-5 space-y-2">
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${status.barColor}`}
                            style={{ width: `${exhausted}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget Stats Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-secondary text-center">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Limit</p>
                        <p className="text-sm font-semibold text-primary mt-1">{getCurrencySymbol(budget.currency_code)} {limit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Budget Spent</p>
                        <p className="text-sm font-semibold text-primary mt-1">{getCurrencySymbol(budget.currency_code)} {spent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Remaining</p>
                        <p className={`text-sm font-semibold mt-1 ${status.textColor}`}>{getCurrencySymbol(budget.currency_code)} {remaining.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODAL - CREATE BUDGET */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Configure New Budget</DialogTitle>
            <DialogDescription className="hidden">Create custom budget</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-5 my-2">
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10 text-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                Budget Spending Limit
              </span>
              <div className="flex items-center justify-center text-4xl font-bold tracking-tight text-foreground w-full">
                <span className="text-muted-foreground/60 mr-1">{getCurrencySymbol(newBudget.currency_code)}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget((prev) => ({ ...prev, amount: e.target.value }))}
                  className="bg-transparent text-center focus:outline-none placeholder-muted-foreground/20 w-full max-w-45 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expense Category</label>
              <Select
                value={newBudget.category_id?.toString()}
                onValueChange={(value) => setNewBudget((prev) => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left">
                  <SelectValue placeholder="Select Expense Category">
                    {expenseCategories.find((cat) => cat.id.toString() === newBudget.category_id?.toString())?.name ||
                      "Select Expense Category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/40 text-foreground">
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Restricted Period</label>
              <Select
                value={newBudget.period}
                onValueChange={(value) => setNewBudget((prev) => ({ ...prev, period: value }))}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left capitalize">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/40 text-foreground">
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Currency</label>
              <Select
                value={newBudget.currency_code}
                onValueChange={(value) => setNewBudget((prev) => ({ ...prev, currency_code: value }))}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/40 text-foreground">
                  {accountCurrencies.length > 0 ? (
                    accountCurrencies.map((code) => (
                      <SelectItem key={code} value={code}>
                        {CURRENCIES.find((c) => c.code === code)?.label || code}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Matched to the currencies used across your accounts.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || !newBudget.amount || !newBudget.category_id}
                className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
              >
                {createMutation.isPending ? "Activating..." : "Activate Budget Limit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* COMBINED MODAL — MANAGE BUDGET (EDIT LIMIT & ADD EXPENSE) */}
      <Dialog open={selectedBudget !== null} onOpenChange={(open) => !open && handleCloseManageModal()}>
        <DialogContent className="modal-theme">
          {selectedBudget && (() => {
            const currentSpent = Number(selectedBudget.spent) || 0;
            const currentLimit = Number(editAmount) || Number(selectedBudget.amount) || 0;
            const IconComponent = getIconComponent(selectedBudget.category?.icon);

            return (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <DialogHeader>
                  <div className="flex items-center justify-between pr-6">
                    <DialogTitle className="text-xl font-bold tracking-tight">Manage Budget</DialogTitle>
                  </div>
                  <DialogDescription className="hidden">Manage budget limits and expenses</DialogDescription>

                  {/* tab switch */}
                  <TabsList className="grid w-full grid-cols-2 mt-3 bg-secondary/50 rounded-xl p-1">
                    <TabsTrigger value="edit" className="rounded-lg font-semibold glow-income-active">
                      Edit Limit
                    </TabsTrigger>

                    <TabsTrigger value="expense" className="rounded-lg font-semibold glow-expense-active">
                      Add Expense
                    </TabsTrigger>
                  </TabsList>
                </DialogHeader>

                {/* info about category spended y current amount */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/20 border border-border/10 my-4">
                  <div className="p-2 rounded-xl bg-income/15 text-income">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary leading-tight">{selectedBudget.category?.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Spent: {getCurrencySymbol(selectedBudget.currency_code)} {currentSpent.toFixed(2)} / {getCurrencySymbol(selectedBudget.currency_code)} {Number(selectedBudget.amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* TAB 1: EDIT LIMIT */}
                <TabsContent value="edit" className="mt-0 space-y-4">
                  {(() => {
                    const remaining = currentLimit - currentSpent;
                    const exhausted = getExhaustedPercentage(currentSpent, currentLimit);
                    const status = getBudgetStatus(exhausted);

                    return (
                      <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        {/* EDIT AMOUNT */}
                        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-secondary/20 border border-border/10 text-center">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                            Budget Spending Limit
                          </span>
                          <div className="flex items-center justify-center text-4xl font-bold tracking-tight text-foreground w-full">
                            <span className="text-muted-foreground/60 mr-1">{getCurrencySymbol(selectedBudget.currency_code)}</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.00"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="bg-transparent text-center focus-glow-income focus:outline-none placeholder-muted-foreground/20 w-full max-w-45 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              required
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* EDIT PERIOD */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Restricted Period
                          </label>
                          <Select value={editPeriod} onValueChange={setEditPeriod}>
                            <SelectTrigger className="w-full h-10 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left capitalize">
                              <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border/40 text-foreground">
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* LIVE PROGRESS PREVIEW */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold tracking-wider uppercase ${status.textColor}`}>{status.text}</span>
                            <span className="text-muted-foreground">{exhausted}% exhausted</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${status.barColor}`}
                              style={{ width: `${exhausted}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-right">
                            Remaining: <span className={`font-semibold ${status.textColor}`}>{getCurrencySymbol(selectedBudget.currency_code)} {remaining.toFixed(2)}</span>
                          </p>
                        </div>

                        <Button
                          type="submit"
                          disabled={updateMutation.isPending || !editAmount}
                          className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
                        >
                          {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    );
                  })()}
                </TabsContent>

                {/* TAB 2: ADD EXPENSE */}
                <TabsContent value="expense" className="mt-0 space-y-4">
                  {(() => {
                    const previewSpent = currentSpent + (Number(newExpense.amount) || 0);
                    const remaining = Number(selectedBudget.amount) - previewSpent;
                    const exhausted = getExhaustedPercentage(previewSpent, Number(selectedBudget.amount));
                    const status = getBudgetStatus(exhausted);

                    // check if selected account's currency matches the budget's currency
                    const selectedAccount = accounts.find(
                      (acc) => acc.id.toString() === newExpense.account_id?.toString()
                    );
                    const currencyMismatch =
                      selectedAccount && selectedAccount.currency_code !== selectedBudget.currency_code;

                    return (
                      <form onSubmit={handleCreateExpenseSubmit} className="space-y-4">
                        {/* EXPENSE AMOUNT */}
                        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-secondary/20 border border-border/10 text-center">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                            Expense Amount
                          </span>
                          <div className="flex items-center justify-center text-4xl font-bold tracking-tight text-foreground w-full">
                            <span className="text-muted-foreground/60 mr-1">{getCurrencySymbol(selectedBudget.currency_code)}</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.00"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                              className="bg-transparent text-center focus-glow-expense focus:outline-none placeholder-muted-foreground/20 w-full max-w-45 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              required
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* ACCOUNT SELECT */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account</label>
                          <Select
                            value={newExpense.account_id?.toString()}
                            onValueChange={(value) => setNewExpense((prev) => ({ ...prev, account_id: value }))}
                          >
                            <SelectTrigger className="w-full h-10 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left">
                              <SelectValue placeholder="Select Account">
                                {accounts.find((acc) => acc.id.toString() === newExpense.account_id?.toString())?.name ||
                                  "Select Account"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border/40 text-foreground">
                              {accounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id.toString()}>
                                  {acc.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {/* CURRENCY MISMATCH WARNING*/}
                          {currencyMismatch && (
                            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-expense/10 border border-expense/20 text-expense">
                              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                              <p className="text-[11px] leading-snug">
                                This budget tracks {selectedBudget.currency_code} only. An expense from a{" "}
                                {selectedAccount.currency_code} account won't count toward this budget's progress.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* DATE */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                          <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                            required
                          />
                        </div>

                        {/* LIVE PROGRESS PREVIEW */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold tracking-wider uppercase ${status.textColor}`}>{status.text}</span>
                            <span className="text-muted-foreground">{exhausted}% exhausted</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${status.barColor}`}
                              style={{ width: `${exhausted}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-right">
                            Remaining: <span className={`font-semibold ${status.textColor}`}>{getCurrencySymbol(selectedBudget.currency_code)} {remaining.toFixed(2)}</span>
                          </p>
                        </div>

                        <Button
                          type="submit"
                          disabled={createTransactionMutation.isPending || !newExpense.amount || !newExpense.account_id}
                          className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
                        >
                          {createTransactionMutation.isPending ? "Recording..." : "Record Expense"}
                        </Button>
                      </form>
                    );
                  })()}
                </TabsContent>

              </Tabs>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}