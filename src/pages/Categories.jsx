import { Plus, Film, Car, Globe, Utensils, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


const expenseCategories = [
  { id: 1, name: "Entertainment", description: "Protected", icon: Film, iconColor: "text-blue-400", iconBg: "bg-blue-400/10", isCustom: false },
  { id: 2, name: "Transport", description: "Protected", icon: Car, iconColor: "text-red-400", iconBg: "bg-red-400/10", titleColor: "text-income", isCustom: false },
  { id: 3, name: "Internet", description: "Your custom category", icon: Globe, iconColor: "text-amber-500", iconBg: "bg-amber-500/10", isCustom: true },
  { id: 4, name: "Restaurants", description: "Your custom category", icon: Utensils, iconColor: "text-yellow-500", iconBg: "bg-yellow-500/10", isCustom: true }
];

export default function Categories() {
  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Categories Mapping</h1>
          <p className="text-muted-foreground text-sm">
            Classify incoming and outgoing financial flows.
          </p>
        </div>

        <Button
          className="bg-income text-primary-foreground hover:bg-income/90 font-semibold shadow-md glow-income rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        {/* Container for switch */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="expenses"
            className="data-active:text-expense dark:data-active:text-expense" // ВАЖНО - ЕСЛИ НЕ УКАЗАТЬ dark ТО ЦВЕТА НЕ ПОКАЖУТСЯ
          >
            Expense Categories
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="data-active:text-income dark:data-active:text-income" // ВАЖНО - ЕСЛИ НЕ УКАЗАТЬ dark ТО ЦВЕТА НЕ ПОКАЖУТСЯ
          >
            Income Categories
          </TabsTrigger>
        </TabsList>

        {/* Expense Categories*/}
        <TabsContent value="expenses" className="mt-4">
          <div className="text-muted-foreground text-sm">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {expenseCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <div
                    key={category.id}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/40 hover:border-border transition-colors duration-200"
                  >
                    {/* Icon and 🔒 or Custom */}
                    <div className="flex items-start justify-between mb-8">

                      {/* Left Icon */}
                      <div className={`p-3 rounded-xl ${category.iconBg} ${category.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* 🔒 or Custom */}
                      {category.isCustom ? (
                        <span className="px-2.5 py-1 rounded-md border border-income text-income bg-income/10 text-xs font-medium">
                          Custom
                        </span>
                      ) : (
                        <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </div>
                      )}

                    </div>

                    {/* Bottom line */}
                    <div>
                      <h3 className={`text-lg font-semibold ${category.titleColor || "text-foreground"}`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Income Categories */}
        <TabsContent value="income" className="mt-4">
          <div className="text-muted-foreground text-sm">
            Income Categories
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}