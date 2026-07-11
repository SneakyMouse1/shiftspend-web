import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { Home, ShoppingCart, UtensilsCrossed, Car, ArrowUpRight, ArrowDownRight, Plus, CreditCard, ShieldCheck, Coins, PiggyBank, Wallet } from "lucide-react";

export default function Dashboard() {
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Mock data for Income vs Expenses (Area Chart)
  const mainChartData = [
    { name: "W1", income: 2800, expenses: 1800 },
    { name: "W2", income: 3400, expenses: 2200 },
    { name: "W3", income: 3000, expenses: 2500 },
    { name: "W4", income: 4200, expenses: 2000 },
    { name: "W5", income: 4800, expenses: 2900 },
    { name: "W6", income: 5124, expenses: 2345 },
  ];

  // Mock data for Asset Allocation (Donut Chart)
  const donutData = [
    { name: "Liquid Cash", value: 6, color: "var(--chart-1)" },
    { name: "Savings / Deposit", value: 69, color: "var(--chart-3)" },
    { name: "Investments", value: 24, color: "var(--chart-4)" },
  ];

  // Mock data for Weekly Pulse (Bar Chart)
  const barData = [
    { day: "Sun", value: 20 },
    { day: "Mon", value: 15 },
    { day: "Tue", value: 10 },
    { day: "Wed", value: 90 }, // Wednesday peak
    { day: "Thu", value: 18 },
    { day: "Fri", value: 25 },
    { day: "Sat", value: 12 },
  ];

  // Categories list data
  const categories = [
    { name: "Housing", percentage: 76, amount: "€1,850.00", color: "bg-rose-500", icon: Home },
    { name: "Groceries", percentage: 11, amount: "€266.20", color: "bg-amber-500", icon: ShoppingCart },
    { name: "Dining", percentage: 5, amount: "€125.15", color: "bg-orange-500", icon: UtensilsCrossed },
    { name: "Transport", percentage: 5, amount: "€117.30", color: "bg-blue-500", icon: Car },
  ];

  return (
    <>
      {/* Welcome & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Simon. Here is your financial pulse.</p>
        </div>
        
        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[160px] bg-card border-border/40 rounded-xl">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="debit">Debit Card</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="cash">Cash Wallet</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px] bg-card border-border/40 rounded-xl">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="thismonth">This Month</SelectItem>
              <SelectItem value="thisyear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total Net Worth Card */}
      <section className="rounded-3xl border border-border/40 bg-card p-6 md:p-8 shadow-sm space-y-6 text-center">
        <div className="space-y-1">
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-widest block">Total Net Worth</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">€61,221.00</h2>
        </div>

        <div className="h-px bg-border/40 w-full" />

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex flex-col items-center justify-center space-y-1 border-r border-border/40">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Income</span>
            <div className="text-income font-bold text-base sm:text-lg flex items-center gap-1 font-mono">
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              +€6,225
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-1 border-r border-border/40">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Expenses</span>
            <div className="text-expense font-bold text-base sm:text-lg flex items-center gap-1 font-mono">
              <ArrowDownRight className="h-4 w-4 shrink-0" />
              -€2,431
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Savings</span>
            <div className="text-chart-3 font-bold text-base sm:text-lg flex items-center gap-1.5 font-mono">
              <PiggyBank className="h-4 w-4 shrink-0" />
              €3,794
            </div>
          </div>
        </div>
      </section>

      {/* Financial Accounts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Financial Accounts</h2>
            <p className="text-muted-foreground text-xs">Manage checking, cash, savings, and investments</p>
          </div>
          <Button className="rounded-xl bg-secondary hover:bg-accent border border-border/40 text-foreground flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Chase Checking */}
          <div className="rounded-2xl border border-border/40 bg-card p-5 border-l-4 border-l-cyan-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[140px]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/20">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-foreground">Chase Checking</h3>
                  <span className="text-[11px] text-muted-foreground">Checking / Card</span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/85 font-bold text-muted-foreground uppercase">EUR</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Available Balance</span>
              <div className="text-xl font-bold tracking-tight font-mono">€3,450.75</div>
            </div>
          </div>

          {/* High-Yield Savings */}
          <div className="rounded-2xl border border-border/40 bg-card p-5 border-l-4 border-l-income hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[140px]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-foreground">High-Yield Savings</h3>
                  <span className="text-[11px] text-muted-foreground">Savings Deposit</span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/85 font-bold text-muted-foreground uppercase">EUR</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Available Balance</span>
              <div className="text-xl font-bold tracking-tight font-mono">€42,500.00</div>
            </div>
          </div>

          {/* Physical Cash */}
          <div className="rounded-2xl border border-border/40 bg-card p-5 border-l-4 border-l-slate-400 dark:border-l-slate-600 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[140px]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/20">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-foreground">Physical Cash</h3>
                  <span className="text-[11px] text-muted-foreground">Physical Cash</span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/85 font-bold text-muted-foreground uppercase">EUR</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Available Balance</span>
              <div className="text-xl font-bold tracking-tight font-mono">€420.00</div>
            </div>
          </div>

          {/* Coinbase Port */}
          <div className="rounded-2xl border border-border/40 bg-card p-5 border-l-4 border-l-purple-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[140px]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/20">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-foreground">Coinbase Port</h3>
                  <span className="text-[11px] text-muted-foreground">Crypto Wallet</span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/85 font-bold text-muted-foreground uppercase">EUR</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Available Balance</span>
              <div className="text-xl font-bold tracking-tight font-mono">€14,850.25</div>
            </div>
          </div>
        </div>
      </section>

      {/* Income vs Expenses Card (Large Line/Area Chart) */}
      <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Income vs Expenses</h2>
            <p className="text-muted-foreground text-xs">30-day activity flow (June - July 2026)</p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-income block"></span>
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-expense block"></span>
              Expenses
            </span>
          </div>
        </div>

        {/* Main Area Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--income)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--income)" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--expense)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)", 
                  borderRadius: "1rem" 
                }} 
              />
              <Area type="monotone" dataKey="income" stroke="var(--income)" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="var(--expense)" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses Footer Panel */}
        <div className="border-t border-border/40 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-sm font-semibold">Latest Total</span>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Inflow</span>
              <span className="text-income font-bold text-lg flex items-center gap-0.5 font-mono">
                <ArrowUpRight className="h-4 w-4 shrink-0" />
                €5,124.00
              </span>
            </div>
            <div className="h-8 w-px bg-border/40 hidden sm:block"></div>
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Outflow</span>
              <span className="text-expense font-bold text-lg flex items-center gap-0.5 font-mono">
                <ArrowDownRight className="h-4 w-4 shrink-0" />
                €2,345.00
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Three Column Widgets Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Top Categories */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Top Categories</h2>
              <Button variant="link" className="text-xs h-auto p-0 text-muted-foreground hover:text-foreground">
                Manage
              </Button>
            </div>
            
            {/* List of categories */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <span>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-normal font-mono">{cat.percentage}%</span>
                        <span className="font-mono">{cat.amount}</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${cat.color} rounded-full`} 
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Asset Allocation */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Asset Allocation</h2>
              <span className="text-xs text-muted-foreground">Portfolio</span>
            </div>
            
            <div className="flex items-center justify-between gap-4 mt-4">
              {/* Donut Chart */}
              <div className="h-[140px] w-[140px] relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Donut Center Label */}
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total</span>
                  <span className="text-lg font-bold tracking-tight font-mono">€61.2k</span>
                </div>
              </div>

              {/* Legend list */}
              <div className="flex-1 space-y-2 text-xs font-semibold">
                {donutData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full block" style={{ backgroundColor: entry.color }}></span>
                      <span className="text-muted-foreground truncate max-w-[80px] sm:max-w-none">{entry.name}</span>
                    </div>
                    <span className="font-mono">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Pulse */}
        <section className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Weekly Pulse</h2>
              <span className="text-xs text-muted-foreground">Outflow</span>
            </div>
            
            {/* Column bar chart */}
            <div className="h-[130px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={10}>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      borderColor: "var(--border)", 
                      borderRadius: "1rem" 
                    }} 
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="var(--muted-foreground)" fontSize={10} />
                  <Bar 
                    dataKey="value" 
                    radius={[5, 5, 0, 0]}
                  >
                    {barData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value > 50 ? "var(--expense)" : "var(--muted)"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
