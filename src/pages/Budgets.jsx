import { useState } from "react";
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";

import { Plus, CheckCircle2, ShoppingCart, Utensils, Gamepad2, Pencil, Trash2, Calendar, Loader2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const ICON_MAP = {
  "shopping-cart": ShoppingCart,
  "utensils": Utensils,
  "gamepad": Gamepad2,
};

const INITIAL_CREATE_STATE = {
  amount: "",
  category_id: "",
  period: "monthly",
};


export default function Budgets() {

  const { data: budgets = [], isLoading } = useBudgets();
  const { data: categories = [] } = useCategories();


  // to initialize mutation
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newBudget, setNewBudget] = useState(INITIAL_CREATE_STATE);

  const getIconComponent = (iconName) => ICON_MAP[iconName] || Wallet;

  const handleClose = () => setSelectedBudget(null);
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewBudget(INITIAL_CREATE_STATE);
  };

  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  // creation of budget
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newBudget.amount || !newBudget.category_id) return;

    const payload = {
      amount: Number(newBudget.amount),
      category_id: Number(newBudget.category_id),
      period: newBudget.period,
      currency_code: "EUR" // as of now with fixed currency
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        handleCloseCreate();
      }
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
    if (percent >= 70) {
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

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Active Budgets</h1>
          <p className="text-sm text-muted-foreground mt-1">Set limits to curb auxiliary expenses.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}
          className="bg-muted text-primary hover:bg-muted/90 font-semibold shadow-md glow-income rounded-xl"
        >
          <Plus className="h-4 w-4" />
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
          <div className="flex items-start gap-4 p-4 rounded-xl border border-income/20 bg-income/5 text-income">
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h5 className="font-semibold leading-none tracking-tight text-primary">All Budgets Fully Secure</h5>
              <p className="text-sm text-muted-foreground mt-1.5">
                Excellent financial discipline! Every configured budget threshold is currently on track and fully secure.
              </p>
            </div>
          </div>


          {/* BUDGETS GRID */}
          {budgets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-secondary p-12 text-center max-w-md mx-auto mt-6">
              <div className="p-3 bg-secondary w-fit rounded-xl mx-auto text-muted mb-4">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-primary">No active budgets</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                You haven't set up any budget limits yet. Create your first budget limit to keep track of your spending.
              </p>
              <Button
                onClick={() => setIsCreateOpen(true)}
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
                const remaining = Number(budget.remaining) || 0;

                const exhausted = typeof budget.progress_percentage !== 'undefined'
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
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">

                          <div className="p-2.5 rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${status.iconColor} 15%, transparent)`, color: status.iconColor }}>
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

                        <div className="text-right">
                          <span className={`text-xs font-bold tracking-wider uppercase ${status.textColor}`}>
                            {status.text}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{exhausted}% exhausted</p>
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
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Budget Spent</p>
                        <p className="text-sm font-semibold text-primary mt-1">€{spent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Limit</p>
                        <p className="text-sm font-semibold text-primary mt-1">€{limit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Remaining</p>
                        <p className="text-sm font-semibold text-cyan-400 mt-1">€{remaining.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between pt-2 text-muted-foreground">
                      <button className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-primary transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit & Delete Settings
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(budget.id)}
                        className="cursor-pointer p-1 rounded hover:bg-secondary hover:text-destructive transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )
      }

      {/* MODAL - ADD BUDGET */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) { handleCloseCreate(); } }}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Configure New Budget</DialogTitle>
            <DialogDescription className="hidden">Create custom budget</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-5 my-2">

            {/* BIG BUDGET SPENDING LIMIT DISPLAY */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10 text-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                Budget Spending Limit
              </span>
              <div className="flex items-center justify-center text-4xl font-bold tracking-tight text-foreground w-full">
                <span className="text-muted-foreground/60 mr-1">€</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-transparent text-center focus:outline-none placeholder-muted-foreground/20 w-full max-w-45 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* EXPENSE CATEGORY SELECT */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expense Category</label>
              <Select
                value={newBudget.category_id?.toString()}
                onValueChange={(value) => setNewBudget(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left">
                  <SelectValue placeholder="Select Expense Category">
                    {expenseCategories.find(cat => cat.id.toString() === newBudget.category_id?.toString())?.name || "Select Expense Category"}
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

            {/* RESTRICTED PERIOD SELECT */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Restricted Period</label>
              <Select
                value={newBudget.period}
                onValueChange={(value) => setNewBudget(prev => ({ ...prev, period: value }))}
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

            {/* SUBMIT BUTTON */}
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
    </div >
  );
}