import { useState } from "react";
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, useDepositGoal } from "@/hooks/useGoals";
import { useAccounts } from "@/hooks/useAccounts";

import { Plus, Loader2, Wallet, PiggyBank, Trophy, Calendar, CheckCircle, ArrowUpRight, AlertTriangle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CURRENCIES, getCurrencySymbol } from "@/config/currencies";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const INITIAL_CREATE_STATE = {
  name: "",
  target_amount: "",
  currency_code: "EUR",
  deadline: "",
};

const INITIAL_DEPOSIT_STATE = {
  amount: "",
  comment: "",
  account_id: "",
};


export default function Goals() {
  const { data: goals = [], isLoading } = useGoals();
  const { data: accounts = [] } = useAccounts();

  // State for Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGoal, setNewGoal] = useState(INITIAL_CREATE_STATE);

  // Mutations
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();
  const depositMutation = useDepositGoal();

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [deposit, setDeposit] = useState(INITIAL_DEPOSIT_STATE);


  const [selectedEditGoal, setSelectedEditGoal] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editStatus, setEditStatus] = useState("active");


  // Getting currency of all accounts
  const accountCurrencies = [...new Set(accounts.map((acc) => acc.currency_code).filter(Boolean))];


  // Opening create modal — default currency comes from the user's primary (first) account
  const handleOpenCreate = () => {
    setNewGoal({
      ...INITIAL_CREATE_STATE,
      currency_code: accounts[0]?.currency_code || "EUR",
    });
    setIsCreateOpen(true);
  };


  // Closing modal of creating goals
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewGoal(INITIAL_CREATE_STATE);
  };


  // Opening create deposit 
  const handleOpenDeposit = (goal) => {
    setSelectedGoal(goal);
    setDeposit(INITIAL_DEPOSIT_STATE);
  };

  // Closing modal of adding deposit
  const handleCloseDeposit = () => {
    setSelectedGoal(null);
    setDeposit(INITIAL_DEPOSIT_STATE);
  };


  const handleOpenEdit = (goal) => {
    setSelectedEditGoal(goal);
    setEditName(goal.name || "");
    setEditDeadline(goal.deadline || "");
    setEditStatus(goal.status || "active");
  };

  const handleCloseEdit = () => {
    setSelectedEditGoal(null);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedEditGoal || !editName.trim()) return;

    updateMutation.mutate(
      {
        id: selectedEditGoal.id,
        updatedData: {
          name: editName.trim(),
          deadline: editDeadline || undefined,
          status: editStatus,
        },
      },
      { onSuccess: () => handleCloseEdit() }
    );
  };

  // Submit deposit
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!selectedGoal || !deposit.amount) return;

    const payload = {
      amount: Number(deposit.amount),
      comment: deposit.comment || undefined,
      account_id: deposit.account_id ? Number(deposit.account_id) : undefined,
    };

    depositMutation.mutate(
      { id: selectedGoal.id, payload },
      { onSuccess: () => handleCloseDeposit() }
    );
  };


  // Submit goal
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newGoal.name.trim() || !newGoal.target_amount || !newGoal.deadline) return;

    const payload = {
      name: newGoal.name.trim(),
      target_amount: Number(newGoal.target_amount),
      currency_code: newGoal.currency_code,
      deadline: newGoal.deadline,
    };

    createMutation.mutate(payload, {
      onSuccess: () => handleCloseCreate(),
    });
  };


  // to delete goal
  const handleDeleteGoal = (id) => {
    deleteMutation.mutate(id);
  };


  // Get percentage
  const getExhaustedPercentage = (targetAmount, currentAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    const percent = (currentAmount / targetAmount) * 100;
    return Math.min(Math.round(percent), 100);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Save for milestones, trips, or emergencies
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-muted text-primary hover:bg-muted/90 font-semibold shadow-md hover-glow-income rounded-xl cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>New Goal</span>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-income" />
          <p className="text-sm text-muted-foreground">Fetching your goals...</p>
        </div>
      ) : (
        <>
          {/* Goals Grid */}
          {goals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-secondary p-12 text-center max-w-md mx-auto mt-6">
              <div className="p-3 bg-secondary w-fit rounded-xl mx-auto text-income mb-4">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-primary">No active goals</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                You haven't set up any goals yet. Create your first goal to keep track of your spending.
              </p>
              <Button
                onClick={handleOpenCreate}
                className="cursor-pointer bg-income text-secondary hover:bg-income/50 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Goal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {goals.map((goal) => {
                const goalName = goal.name || "Unnamed Goal";
                const currentAmount = Number(goal.current_amount) || 0;
                const targetAmount = Number(goal.target_amount) || 0;
                const symbol = getCurrencySymbol(goal.currency_code);

                // percentage
                const percentage =
                  typeof goal.progress_percentage !== "undefined"
                    ? Math.min(100, Math.round(Number(goal.progress_percentage)))
                    : getExhaustedPercentage(targetAmount, currentAmount);


                const isAchieved = percentage >= 100 || goal.status === "completed";
                const IconComponent = isAchieved ? Trophy : PiggyBank;

                // days till deadline
                let daysLeft = null;
                if (goal.deadline) {
                  const today = new Date();
                  const deadlineDate = new Date(goal.deadline);
                  const diffTime = deadlineDate - today;
                  daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }

                return (
                  <div
                    key={goal.id}
                    className={`rounded-2xl p-5 flex flex-col justify-between space-y-6 border transition-all duration-200 ${isAchieved
                      ? "bg-card/80 border-income/20 hover-glow-income"
                      : "bg-card/80 border-chart-3/20 hover-glow-expense"
                      }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Icon Box */}
                        <div
                          className={`p-2.5 rounded-xl border ${isAchieved
                            ? "bg-income/10 border-income/20 text-income"
                            : "bg-chart-3/10 border-chart-3/20 text-chart-3"
                            }`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        {/* Title & Target Date */}
                        <div>
                          <h3 className="font-bold text-foreground text-base leading-tight">
                            {goalName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Target: {goal.deadline || "No deadline"}</span>
                            {!isAchieved && daysLeft !== null && daysLeft > 0 && (
                              <>
                                <span>•</span>
                                <span>{daysLeft} days left</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action / Status Badge & Actions Menu */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isAchieved ? (
                          <div className="flex items-center gap-1.5 bg-income/10 border border-income/30 text-income text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Target Achieved</span>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors focus:outline-none cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border/40 text-foreground w-36">
                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(goal)}
                                className="cursor-pointer text-xs font-medium focus:bg-secondary"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Edit Goal
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenDeposit(goal)}
                                className="cursor-pointer text-xs font-medium focus:bg-secondary"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5 mr-2" />
                                Add Deposit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="cursor-pointer text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        
                      </div>
                    </div>

                    {/* Progress & Amounts Section */}
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between text-sm">

                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-foreground">
                            {symbol}{currentAmount.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            of {symbol}{targetAmount.toLocaleString()}
                          </span>
                        </div>

                        {/* Percent */}
                        <span
                          className={`text-xs font-bold ${isAchieved ? "text-income" : "text-chart-3"
                            }`}
                        >
                          {percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isAchieved
                            ? "bg-income"
                            : "bg-chart-3"
                            }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}


      {/* MODAL - CREATE GOAL */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create Savings Goal</DialogTitle>
            <DialogDescription className="hidden">Create a new savings goal</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-5 my-2">

            {/* Goal name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Goal Name</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. MacBook Pro, Japan Trip..."
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
                autoFocus
              />
            </div>

            {/* Target amount + currency */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Amount</label>
                <div className="flex items-center h-11 px-4 rounded-xl bg-secondary/30 border border-border/40">
                  <span className="text-muted-foreground/60 mr-1 text-lg">
                    {getCurrencySymbol(newGoal.currency_code)}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, target_amount: e.target.value }))}
                    className="bg-transparent focus:outline-none placeholder-muted-foreground/40 w-full text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Currency</label>
                <Select
                  value={newGoal.currency_code}
                  onValueChange={(value) => setNewGoal((prev) => ({ ...prev, currency_code: value }))}
                >
                  <SelectTrigger className="w-full data-[size=default]:h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/40 text-foreground">
                    {accountCurrencies.length > 0 ? (
                      accountCurrencies.map((code) => (
                        <SelectItem key={code} value={code}>{code}</SelectItem>
                      ))
                    ) : (
                      CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Date</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || !newGoal.name.trim() || !newGoal.target_amount || !newGoal.deadline}
                className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
              >
                {createMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL - ADD DEPOSIT */}
      <Dialog open={selectedGoal !== null} onOpenChange={(open) => !open && handleCloseDeposit()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Add Deposit</DialogTitle>
            <DialogDescription className="hidden">Add a deposit toward this goal</DialogDescription>
          </DialogHeader>

          {selectedGoal && (() => {
            const currentAmount = Number(selectedGoal.current_amount) || 0;
            const targetAmount = Number(selectedGoal.target_amount) || 0;
            const previewAmount = currentAmount + (Number(deposit.amount) || 0);
            const previewPercent = getExhaustedPercentage(targetAmount, previewAmount);
            const achieved = previewPercent >= 100;
            const symbol = getCurrencySymbol(selectedGoal.currency_code);

            // NEW: check if selected account's currency matches the goal's currency
            const selectedAccount = accounts.find(
              (acc) => acc.id.toString() === deposit.account_id?.toString()
            );
            const currencyMismatch =
              selectedAccount && selectedAccount.currency_code !== selectedGoal.currency_code;

            return (
              <form onSubmit={handleDepositSubmit} className="space-y-5 my-2">

                {/* Goal info */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20 border border-border/10">
                  <div className="p-2.5 rounded-xl bg-income/10 text-income">
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary leading-tight">{selectedGoal.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Saved: {symbol}{currentAmount.toFixed(2)} / {symbol}{targetAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Deposit amount */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10 text-center">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Deposit Amount
                  </span>
                  <div className="flex items-center justify-center text-4xl font-bold tracking-tight text-foreground w-full">
                    <span className="text-muted-foreground/60 mr-1">{symbol}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={deposit.amount}
                      onChange={(e) => setDeposit((prev) => ({ ...prev, amount: e.target.value }))}
                      className="bg-transparent text-center focus:outline-none placeholder-muted-foreground/20 w-full max-w-45 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Account (optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Account <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
                  </label>
                  <Select
                    value={deposit.account_id?.toString()}
                    onValueChange={(value) => setDeposit((prev) => ({ ...prev, account_id: value }))}
                  >
                    <SelectTrigger className="w-full data-[size=default]:h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left">
                      <SelectValue placeholder="Select Account">
                        {accounts.find((acc) => acc.id.toString() === deposit.account_id?.toString())?.name || "Select Account"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border/40 text-foreground">
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id.toString()}>
                          {acc.name} ({acc.currency_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* NEW: currency mismatch warning */}
                  {currencyMismatch && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-expense/10 border border-expense/20 text-expense">
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <p className="text-[11px] leading-snug">
                        This goal tracks {selectedGoal.currency_code} only. A deposit from a{" "}
                        {selectedAccount.currency_code} account won't be converted automatically.
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment (optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Comment <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={deposit.comment}
                    onChange={(e) => setDeposit((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="e.g. Monthly savings"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                  />
                </div>

                {/* Live progress preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold tracking-wider uppercase ${achieved ? "text-income" : "text-chart-3"}`}>
                      {achieved ? "Target Achieved" : "In Progress"}
                    </span>
                    <span className="text-muted-foreground">{previewPercent}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${achieved ? "bg-income" : "bg-cyan-400"}`}
                      style={{ width: `${previewPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={depositMutation.isPending || !deposit.amount}
                    className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold hover-glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
                  >
                    {depositMutation.isPending ? "Recording..." : "Record Deposit"}
                  </Button>
                </div>
              </form>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* MODAL - EDIT GOAL */}
      <Dialog open={selectedEditGoal !== null} onOpenChange={(open) => !open && handleCloseEdit()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Edit Goal</DialogTitle>
            <DialogDescription className="hidden">Edit goal name, deadline, or status</DialogDescription>
          </DialogHeader>

          {selectedEditGoal && (
            <form onSubmit={handleUpdateSubmit} className="space-y-5 my-2">

              {/* Goal info (read-only target amount / currency) */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20 border border-border/10">
                <div className="p-2.5 rounded-xl bg-income/10 text-income">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary leading-tight">
                    {getCurrencySymbol(selectedEditGoal.currency_code)}{Number(selectedEditGoal.target_amount).toFixed(2)} target
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Saved so far: {getCurrencySymbol(selectedEditGoal.currency_code)}{Number(selectedEditGoal.current_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Goal Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                  required
                  autoFocus
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Date</label>
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="w-full data-[size=default]:h-11 rounded-xl bg-secondary/30 border-border/40 text-foreground focus:ring-income text-left capitalize">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/40 text-foreground">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !editName.trim()}
                  className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold hover-glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div >
  );
}