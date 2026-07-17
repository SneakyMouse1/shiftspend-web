import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus, CheckCircle2, ShoppingCart, Utensils,
  Gamepad2, Pencil, Trash2, Calendar
} from "lucide-react";


const MOCK_BUDGETS = [
  {
    id: 1,
    name: "Groceries",
    status: "ON TRACK",
    type: "Monthly Restriction",
    exhausted: 53,
    spent: 266.20,
    limit: 500,
    remaining: 233.80,
    icon: ShoppingCart,
    colorClass: "text-amber-500 bg-amber-500/10",
  },
  {
    id: 2,
    name: "Dining",
    status: "ON TRACK",
    type: "Monthly Restriction",
    exhausted: 42,
    spent: 125.15,
    limit: 300,
    remaining: 174.85,
    icon: Utensils,
    colorClass: "text-amber-500 bg-amber-500/10", // судя по фото, там тоже желтовато-золотой
  },
  {
    id: 3,
    name: "Entertainment",
    status: "ON TRACK",
    type: "Monthly Restriction",
    exhausted: 21,
    spent: 32.00,
    limit: 150,
    remaining: 118.00,
    icon: Gamepad2,
    colorClass: "text-amber-500 bg-amber-500/10",
  }
];


export default function Budgets() {

  const [budgets, setBudgets] = useState(MOCK_BUDGETS);

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Active Budgets</h1>
          <p className="text-sm text-muted-foreground mt-1">Set limits to curb auxiliary expenses.</p>
        </div>
        <Button
          className="bg-muted text-primary hover:bg-muted/90 font-semibold shadow-md glow-income rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>New Limit</span>
        </Button>
      </div>

      <div className="flex items-start gap-4 p-4 rounded-xl border border-income/20 bg-income/5 text-income">
        <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
          <h5 className="font-semibold leading-none tracking-tight text-zinc-100">All Budgets Fully Secure</h5>
          <p className="text-sm text-zinc-400 mt-1.5">
            Excellent financial discipline! Every configured budget threshold is currently on track and fully secure.
          </p>
        </div>
      </div>


      {/* BUDGETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const IconComponent = budget.icon;
          return (
            <div
              key={budget.id}
              className="rounded-xl border border-secondary bg-secondary/40 p-5 flex flex-col justify-between space-y-6 transition-all duration-200 hover:muted-foreground"
            >
              {/* Card Top Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${budget.colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-lg leading-tight">{budget.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{budget.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-income tracking-wider uppercase">
                      {budget.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{budget.exhausted}% exhausted</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-income h-full rounded-full transition-all duration-300"
                      style={{ width: `${budget.exhausted}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Budget Stats Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-secondary text-center">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Budget Spent</p>
                  <p className="text-sm font-semibold text-primary mt-1">€{budget.spent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Limit</p>
                  <p className="text-sm font-semibold text-primary mt-1">€{budget.limit}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Remaining</p>
                  <p className="text-sm font-semibold text-chart-3 mt-1">€{budget.remaining.toFixed(2)}</p>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between pt-2 text-muted-foreground">
                <button className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-primary transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit & Delete Settings
                </button>
                <button className="cursor-pointer p-1 rounded hover:bg-secondary hover:text-destructive transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
