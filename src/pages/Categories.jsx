import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus, Film, Car, Globe, Utensils, Lock, Home, Tv,
  Briefcase, Heart, Shield, BookOpen, Scissors, Coffee, Tag, Loader2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

import { useCategories } from "@/hooks/useCategories";


// to coonect icon name with name in BBDD
const ICON_MAP = {
  tag: Tag,
  utensils: Utensils,
  car: Car,
  home: Home,
  film: Film,
  tv: Tv,
  briefcase: Briefcase,
  globe: Globe,
  heart: Heart,
  shield: Shield,
  book: BookOpen,
  scissors: Scissors,
  coffee: Coffee,
};

// icons to pick in modal
const AVAILABLE_ICONS = [
  { name: "tag", icon: Tag },
  { name: "utensils", icon: Utensils },
  { name: "car", icon: Car },
  { name: "home", icon: Home },
  { name: "film", icon: Film },
  { name: "tv", icon: Tv },
  { name: "briefcase", icon: Briefcase },
  { name: "globe", icon: Globe },
  { name: "heart", icon: Heart },
  { name: "shield", icon: Shield },
  { name: "book", icon: BookOpen },
  { name: "scissors", icon: Scissors },
  { name: "coffee", icon: Coffee },
];

// colors to pick in modal
const COLOR_SWATCHES = [
  { hex: "#ef4444", bgClass: "bg-red-500" },
  { hex: "#f97316", bgClass: "bg-orange-500" },
  { hex: "#ec4899", bgClass: "bg-pink-500" },
  { hex: "#d946ef", bgClass: "bg-fuchsia-500" },
  { hex: "#8b5cf6", bgClass: "bg-violet-500" },
  { hex: "#3b82f6", bgClass: "bg-blue-500" },
  { hex: "#10b981", bgClass: "bg-emerald-500" },
  { hex: "#f59e0b", bgClass: "bg-amber-500" },
];

// initial info en modal for creating category
const INITIAL_CREATE_STATE = {
  name: "",
  type: "expense",
  icon: "tag",
  color: "#ef4444",
};

export default function Categories() {

  // Get everything from hook
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCategory, setNewCategory] = useState(INITIAL_CREATE_STATE);


  const getIconComponent = (iconName) => ICON_MAP[iconName] || Tag;
  const handleClose = () => setSelectedCategory(null);


  // Change name
  const handleNameChange = (e) => {
    setSelectedCategory((prev) => ({ ...prev, name: e.target.value }));
  };


  // Change icon
  const handleIconChange = (iconName) => {
    setSelectedCategory((prev) => ({ ...prev, icon: iconName }));
  };


  // Change color
  const handleColorChange = (hexColor) => {
    setSelectedCategory((prev) => ({ ...prev, color: hexColor }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    const success = await updateCategory(selectedCategory.id, selectedCategory);
    if (success) handleClose();
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    const success = await deleteCategory(id);
    if (success) handleClose();
  };

  // Create category
  const handleCreateSubmit = async () => {
    if (!newCategory.name.trim()) {
      return;
    }
    const success = await createCategory(newCategory);
    if (success) {
      setIsCreateOpen(false);
      setNewCategory(INITIAL_CREATE_STATE);
    }
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewCategory(INITIAL_CREATE_STATE);
  };


  // Get catecories for expense or income
  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const incomeCategories = categories.filter((cat) => cat.type === "income");



  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Categories Mapping</h1>
          <p className="text-muted-foreground text-sm">
            Classify incoming and outgoing financial flows.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-income text-primary-foreground hover:bg-income/90 font-semibold shadow-md glow-income rounded-xl transition-all duration-300 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-income" />
          <p className="text-sm text-muted-foreground">Fetching your categories...</p>
        </div>
      ) : (
        <Tabs defaultValue="expenses" className="w-full">

          {/* Switch Expenses/Income */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses" className="data-active:text-expense dark:data-active:text-expense transition-all duration-300 cursor-pointer">
              <span>Expense </span>
              <span className="hidden sm:inline">Categories </span>
              <span>({expenseCategories.length})</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="data-active:text-income dark:data-active:text-income transition-all duration-300 cursor-pointer">
              <span>Income </span>
              <span className="hidden sm:inline">Categories </span>
              <span>({incomeCategories.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Expense Tab */}
          <TabsContent value="expenses" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {expenseCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/40 hover:border-border hover-glow-expense transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div
                        className="p-3 rounded-xl"
                        style={{ color: category.color, backgroundColor: `${category.color}15` }}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      {!category.is_default ? (
                        <span className="px-2.5 py-1 rounded-md border border-income text-income bg-income/10 text-xs font-medium">
                          Custom
                        </span>
                      ) : (
                        <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {!category.is_default ? "Your custom category" : "Protected"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Income Tab */}
          <TabsContent value="income" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {incomeCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/40 hover:border-border hover-glow-income transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div
                        className="p-3 rounded-xl"
                        style={{ color: category.color, backgroundColor: `${category.color}15` }}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      {!category.is_default ? (
                        <span className="px-2.5 py-1 rounded-md border border-income text-income bg-income/10 text-xs font-medium">
                          Custom
                        </span>
                      ) : (
                        <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {!category.is_default ? "Your custom category" : "Protected"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* MODAL - ADD CATEGORY */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) { handleCloseCreate(); } }}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create New Category</DialogTitle>
            <DialogDescription className="hidden">Create custom category helper</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 my-2">
            {/* Live Preview */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10">
              <div
                className="p-4 rounded-2xl mb-3 animate-pulse"
                style={{ color: newCategory.color, backgroundColor: `${newCategory.color}15` }}
              >
                {(() => {
                  const PreviewIcon = getIconComponent(newCategory.icon);
                  return <PreviewIcon className="h-8 w-8" />;
                })()}
              </div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Visual Preview</span>
              <span className="text-2xl font-bold text-foreground mt-1">
                {newCategory.name || "Unnamed Category"}
              </span>
            </div>

            {/* Choosing type of category - Expense / Income */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Type</label>
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-secondary/30 border border-border/40">
                <button
                  type="button"
                  onClick={() => setNewCategory(prev => ({ ...prev, type: "expense" }))}
                  className={`py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${newCategory.type === "expense"
                    ? "bg-expense/10 border border-expense text-expense"
                    : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory(prev => ({ ...prev, type: "income" }))}
                  className={`py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${newCategory.type === "income"
                    ? "bg-income/10 border border-income text-income"
                    : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Name of category*/}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Subscriptions, Freelance..."
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
              />
            </div>

            {/* Chosing icon */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Icon</label>
              <div className="grid grid-cols-8 gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
                {AVAILABLE_ICONS.map((item) => {
                  const CurrentIconComponent = item.icon;
                  const isActive = newCategory.icon === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, icon: item.name }))}
                      className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300 cursor-pointer ${isActive
                        ? "bg-income text-primary-foreground scale-110"
                        : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50"
                        }`}
                    >
                      <CurrentIconComponent className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choosing color */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Color Theme Swatch</label>
              <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/40">
                {COLOR_SWATCHES.map((swatch, idx) => {
                  const isActive = newCategory.color === swatch.hex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, color: swatch.hex }))}
                      className={`h-7 w-7 rounded-full ${swatch.bgClass} transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${isActive
                        ? "ring-2 ring-white ring-offset-2 ring-offset-popover scale-110"
                        : ""
                        }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleCreateSubmit}
                disabled={!newCategory.name.trim()}
                className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold glow-income disabled:opacity-50 transition-all duration-300 cursor-pointer"
              >
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL UPDATE CATEGORY */}
      <Dialog open={selectedCategory !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {!selectedCategory?.is_default ? "Modify Custom Category" : "View System Category"}
            </DialogTitle>
            <DialogDescription className="hidden">Category details editor</DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-5 my-2">
              {/* Icon Preview */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10">
                <div
                  className="p-4 rounded-2xl mb-3"
                  style={{ color: selectedCategory.color, backgroundColor: `${selectedCategory.color}15` }}
                >
                  {(() => {
                    const PreviewIcon = getIconComponent(selectedCategory.icon);
                    return <PreviewIcon className="h-8 w-8" />;
                  })()}
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Visual Preview</span>
                <span className="text-2xl font-bold text-foreground mt-1">{selectedCategory.name}</span>
              </div>

              {/* Warning */}
              {selectedCategory.is_default && (
                <div className="flex gap-3 p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense">
                  <Lock className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">System Default Category</p>
                    <p className="text-expense/50">
                      This category is system-protected to ensure past logs remain correct.
                    </p>
                  </div>
                </div>
              )}

              {/* Input name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Name</label>
                <input
                  type="text"
                  value={selectedCategory.name}
                  onChange={handleNameChange}
                  disabled={selectedCategory.is_default}
                  className={`w-full px-4 py-3 rounded-xl bg-secondary/30 border text-foreground text-sm focus:outline-none disabled:opacity-50 ${!selectedCategory.is_default
                    ? "border-border/40 focus:border-income focus:ring-1 focus:ring-income"
                    : "border-border/40"
                    }`}
                />
              </div>

              {/* Select Icon */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Icon</label>
                <div className="grid grid-cols-8 gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
                  {AVAILABLE_ICONS.map((item) => {
                    const CurrentIconComponent = item.icon;
                    const isActive = selectedCategory.icon === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        disabled={selectedCategory.is_default}
                        onClick={() => handleIconChange(item.name)}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300 cursor-pointer ${isActive
                          ? "bg-income text-primary-foreground scale-110 shadow-sm"
                          : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50"
                          } disabled:pointer-events-none`}
                      >
                        <CurrentIconComponent className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Color Theme Swatch</label>
                <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/40">
                  {COLOR_SWATCHES.map((swatch, idx) => {
                    const isActive = selectedCategory.color === swatch.hex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={selectedCategory.is_default}
                        onClick={() => handleColorChange(swatch.hex)}
                        className={`h-7 w-7 rounded-full ${swatch.bgClass} transition-all duration-300 cursor-pointer hover:scale-110 disabled:pointer-events-none active:scale-95 ${isActive
                          ? "ring-2 ring-white ring-offset-2 ring-offset-popover scale-110"
                          : ""
                          }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              {!selectedCategory.is_default ? (
                <div className="space-y-3 mt-4">
                  <Button
                    onClick={handleSaveChanges}
                    className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold shadow-md glow-income block sm:inline-flex transition-all duration-300 cursor-pointer"
                  >
                    Save Changes
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(selectedCategory.id)}
                    className="w-full text-center text-destructive hover:destructive/50 text-sm font-semibold py-1 block transition-all duration-300 cursor-pointer"
                  >
                    Delete This Category
                  </button>
                </div>
              ) : (

                <Button
                  onClick={handleClose}
                  className="w-full h-11 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl font-semibold mt-2 block sm:inline-flex transition-all duration-300 cursor-pointer"
                >
                  Close
                </Button>

              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}