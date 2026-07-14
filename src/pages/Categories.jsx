import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Film, Car, Globe, Utensils, Lock, Home, Tv, Briefcase, Heart, Shield, BookOpen, Scissors, Coffee, Tag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";


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
  { bgClass: "bg-chart-1", textClass: "text-chart-1", bgOpacityClass: "bg-chart-1/10" },
  { bgClass: "bg-chart-2", textClass: "text-chart-2", bgOpacityClass: "bg-chart-2/10" },
  { bgClass: "bg-chart-3", textClass: "text-chart-3", bgOpacityClass: "bg-chart-3/10" },
  { bgClass: "bg-chart-4", textClass: "text-chart-4", bgOpacityClass: "bg-chart-4/10" },
  { bgClass: "bg-chart-5", textClass: "text-chart-5", bgOpacityClass: "bg-chart-5/10" }
];


// initial categories - later con fetch
const INITIAL_EXPENSE_CATEGORIES = [
  { id: 1, name: "Entertainment", description: "Protected", icon: Film, iconColor: "text-blue-400", iconBg: "bg-blue-400/10", isCustom: false },
  { id: 2, name: "Transport", description: "Protected", icon: Car, iconColor: "text-red-400", iconBg: "bg-red-400/10", isCustom: false },
  { id: 3, name: "Internet", description: "Your custom category", icon: Globe, iconColor: "text-amber-500", iconBg: "bg-amber-500/10", isCustom: true },
  { id: 4, name: "Restaurants", description: "Your custom category", icon: Utensils, iconColor: "text-yellow-500", iconBg: "bg-yellow-500/10", isCustom: true },
  { id: 5, name: "Healthcare", description: "Protected", icon: Heart, iconColor: "text-income", iconBg: "bg-income/10", isCustom: false },
  { id: 6, name: "Groceries", description: "Your custom category", icon: Utensils, iconColor: "text-yellow-500", iconBg: "bg-yellow-500/10", isCustom: true }
];

export default function Categories() {

  // all of the categories
  const [categories, setCategories] = useState(INITIAL_EXPENSE_CATEGORIES);

  // category for modal
  const [selectedCategory, setSelectedCategory] = useState(null);

  // to close modal
  const handleClose = () => setSelectedCategory(null);


  // Change category name
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setSelectedCategory((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  // Change icon
  const handleIconChange = (NewIcon) => {
    setSelectedCategory((prev) => ({ ...prev, icon: NewIcon }));
  };

  // Chahge Color
  const handleColorChange = (swatch) => {
    setSelectedCategory((prev) => ({
      ...prev,
      iconColor: swatch.textClass,
      iconBg: swatch.bgOpacityClass,
    }));
  };

  // Save changes in category
  const handleSaveChanges = () => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === selectedCategory.id ? selectedCategory : cat))
    );
    handleClose();
  };

  // Delete category
  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    handleClose();
  };



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
          className="bg-income text-primary-foreground hover:bg-income/90 font-semibold shadow-md glow-income rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <Tabs defaultValue="expenses" className="w-full">

        {/* Switches - Expense/Income */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="expenses"
            className="data-active:text-expense dark:data-active:text-expense"
          >
            Expense Categories
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="data-active:text-income dark:data-active:text-income"
          >
            Income Categories
          </TabsTrigger>
        </TabsList>


        {/* Expense Tab */}
        <TabsContent value="expenses" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {categories.map((category) => {
              const Icon = category.icon;

              // category cards
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category)} // modal on click
                  className="flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/40 hover:border-border transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-3 rounded-xl ${category.iconBg} ${category.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>

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

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
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
        </TabsContent>


        {/* Income Tab */}
        <TabsContent value="income" className="mt-4">
          <div className="text-muted-foreground text-sm">
            Income info - esperamos
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── MODAL (DIALOG) ─── */}
      <Dialog open={selectedCategory !== null} onOpenChange={(open) => !open && handleClose()}>

        <DialogContent className="modal-theme">

          {/* modal title */}
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {selectedCategory?.isCustom ? "Modify Custom Category" : "View System Category"}
            </DialogTitle>
            <DialogDescription className="hidden">Category details editor</DialogDescription>
          </DialogHeader>

          {/* modal form */}
          {selectedCategory && (
            <div className="space-y-5 my-2">

              {/* Icon / Visual Preview / Category Name */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10">
                <div className={`p-4 rounded-2xl mb-3 ${selectedCategory.iconBg} ${selectedCategory.iconColor}`}>

                  {(() => {
                    const PreviewIcon = selectedCategory.icon;
                    return <PreviewIcon className="h-8 w-8" />;
                  })()}

                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Visual Preview
                </span>
                <span className="text-2xl font-bold text-foreground mt-1">
                  {selectedCategory.name}
                </span>
              </div>

              {/* Warning for locked categories*/}
              {!selectedCategory.isCustom && (
                <div className="flex gap-3 p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense">
                  <Lock className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">System Default Category</p>
                    <p className="text-expense/50">
                      This category is system-protected to ensure past logs remain correct. Names, icons, and colors are locked.
                    </p>
                  </div>
                </div>
              )}

              {/* Input for name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category Name
                </label>
                <input
                  type="text"
                  value={selectedCategory.name}
                  onChange={handleNameChange}
                  disabled={!selectedCategory.isCustom}
                  className={`w-full px-4 py-3 rounded-xl bg-secondary/30 border text-foreground text-sm focus:outline-none disabled:opacity-50 ${selectedCategory.isCustom
                    ? "border-border/40 focus:border-income focus:ring-1 focus:ring-income"
                    : "border-border/40"
                    }`}
                />
              </div>

              {/* Select Icon */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Icon
                </label>
                <div className="grid grid-cols-8 gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
                  {AVAILABLE_ICONS.map((item) => {
                    const CurrentIcon = item.icon;
                    const isActive = selectedCategory.icon === CurrentIcon; // checking if the icon is active

                    return (
                      <button
                        key={item.name}
                        type="button"
                        disabled={!selectedCategory.isCustom}
                        onClick={() => handleIconChange(CurrentIcon)}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all ${isActive
                          ? "bg-income text-primary-foreground scale-110 shadow-sm"
                          : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50"
                          } disabled:pointer-events-none`}
                      >
                        <CurrentIcon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Color Theme Swatch
                </label>
                <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/40">
                  {COLOR_SWATCHES.map((swatch, idx) => {
                    const isActive = selectedCategory.iconColor === swatch.textClass;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!selectedCategory.isCustom}
                        onClick={() => handleColorChange(swatch)}
                        className={`h-7 w-7 rounded-full ${swatch.bgClass} transition-all hover:scale-110 disabled:pointer-events-none active:scale-95 ${isActive
                          ? "ring-2 ring-white ring-offset-2 ring-offset-popover scale-110"
                          : ""
                          }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Buttons for Locked/Custom Category */}
              {selectedCategory.isCustom ? (
                <div className="space-y-3 mt-4">
                  {/* Save Button for Custom Category */}
                  <DialogClose asChild className="w-full">
                    <Button
                      onClick={handleSaveChanges}
                      className="w-full h-11 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-semibold shadow-md glow-income block sm:inline-flex"
                    >
                      Save Changes
                    </Button>
                  </DialogClose>

                  {/* Delete Button for Custom Category */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(selectedCategory.id)}
                    className="w-full text-center text-rose-500 hover:text-rose-400 text-sm font-semibold transition-colors py-1 block"
                  >
                    Delete This Category
                  </button>
                </div>
              ) : (
                /* Close Button for Locked Category */
                <DialogClose asChild className="w-full">
                  <Button
                    onClick={handleClose}
                    className="w-full h-11 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl font-semibold mt-2 block sm:inline-flex"
                  >
                    Close
                  </Button>
                </DialogClose>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}