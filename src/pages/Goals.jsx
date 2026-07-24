import { useState } from "react";
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from "@/hooks/useGoals";
import { useAccounts } from "@/hooks/useAccounts";

import { Plus, Loader2, Wallet, PiggyBank, Trophy, Calendar, CheckCircle, ArrowUpRight } from "lucide-react";
import { CURRENCIES, getCurrencySymbol } from "@/config/currencies";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


const INITIAL_CREATE_STATE = [
  {
    name: "MacBook Pro",
    target_amount: "2000.00",
    currency_code: "EUR",
    status: "active"
  },
];




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


  // Derive the unique currencies actually used across the user's accounts
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
          className="bg-muted text-primary hover:bg-muted/90 font-semibold shadow-md glow-income rounded-xl"
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
                        : "bg-card/80 border-cyan-500/20 hover-glow-expense"
                      }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Icon Box */}
                        <div
                          className={`p-2.5 rounded-xl border ${isAchieved
                              ? "bg-income/10 border-income/20 text-income"
                              : "bg-cyan-500/10 border-chart-3/20 text-chart-3"
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

                      {/* Right Action / Status Badge */}
                      {isAchieved ? (
                        <div className="flex items-center gap-1.5 bg-income/10 border border-income/30 text-income text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Target Achieved</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            /* логика открытия модалки пополнения */
                          }}
                          className="h-8 bg-cyan-950/60 hover:bg-chart-3/80 text-chart-3 border border-chart-3/30 rounded-lg text-xs font-semibold px-3"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                          Add Deposit
                        </Button>
                      )}
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

                      {/* Progress Bar Track */}
                      <div className="w-full bg-secondary/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-border/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isAchieved
                              ? "bg-income shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                              : "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
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

      {/* MODAL - CREATE BUDGET */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Save Progress Contribution</DialogTitle>
            <DialogDescription className="hidden">Create custom budget</DialogDescription>
          </DialogHeader>

        </DialogContent>
      </Dialog>
    </div >
  );
}