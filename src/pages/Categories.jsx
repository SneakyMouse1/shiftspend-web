import { useState, createElement } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";

import { Button } from "@/components/ui/button";
import { Plus, Lock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getIconComponent, AVAILABLE_ICONS } from "@/config/categoryIcons";
import { useTranslation } from "@/hooks/useLanguage";


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

const INITIAL_CREATE_STATE = {
  name: "",
  type: "expense",
  icon: "tag",
  color: "#ef4444",
};

function CategoryPreviewIcon({ iconName, className }) {
  return createElement(getIconComponent(iconName), { className });
}

export default function Categories() {
  const { t } = useTranslation();
  const { data: categories = [], isLoading } = useCategories();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCategory, setNewCategory] = useState(INITIAL_CREATE_STATE);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState("expense");

  const handleClose = () => setSelectedCategory(null);
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewCategory(INITIAL_CREATE_STATE);
  };

  const handleNameChange = (e) => setSelectedCategory((prev) => ({ ...prev, name: e.target.value }));
  const handleIconChange = (iconName) => setSelectedCategory((prev) => ({ ...prev, icon: iconName }));
  const handleColorChange = (hexColor) => setSelectedCategory((prev) => ({ ...prev, color: hexColor }));

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    createMutation.mutate(newCategory, {
      onSuccess: () => {
        handleCloseCreate();
      }
    });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    updateMutation.mutate(
      {
        id: selectedCategory.id,
        updatedData: selectedCategory
      },
      {
        onSuccess: () => handleClose()
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!categoryToDeleteId) return;

    deleteMutation.mutate(categoryToDeleteId, {
      onSuccess: () => {
        setCategoryToDeleteId(null);
        handleClose();
      },
    });
  };

  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const incomeCategories = categories.filter((cat) => cat.type === "income");


  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("categories.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("categories.subtitle")}
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-income text-primary-foreground hover:bg-income/90 font-semibold shadow-md glow-income rounded-xl transition-all duration-300 cursor-pointer hidden md:flex items-center"
        >
          <Plus className="h-4 w-4" />
          <span>{t("categories.newCategory")}</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-income" />
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : (

        <>

          {/* Switch Expenses/Income - Modern Segmented Control */}
          <div className="flex sm:inline-flex p-1 rounded-2xl bg-secondary/80 border border-border/80 w-full sm:w-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("expense")}
              className={`flex-1 sm:flex-initial py-2 px-5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${activeTab === "expense"
                ? "bg-card text-orange-600 dark:text-orange-400 font-bold shadow-xs border border-orange-500/30"
                : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
            >
              <span>{t("categories.expenseCategories")}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "expense" ? "bg-orange-500/15 text-orange-600 dark:text-orange-400" : "bg-secondary text-muted-foreground"}`}>
                {expenseCategories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("income")}
              className={`flex-1 sm:flex-initial py-2 px-5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${activeTab === "income"
                ? "bg-card text-emerald-600 dark:text-emerald-400 font-bold shadow-xs border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
            >
              <span>{t("categories.incomeCategories")}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "income" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                {incomeCategories.length}
              </span>
            </button>
          </div>

          {/* Category List Grid: 2 per row on mobile, 6 per row on PC */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
            {(activeTab === "expense" ? expenseCategories : incomeCategories).map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const isExpense = activeTab === "expense";

              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 hover:border-border shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-1 mb-4 sm:mb-6">
                    <div
                      className="p-2 sm:p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105"
                      style={{ color: category.color, backgroundColor: `${category.color}15` }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {!category.is_default ? (
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 rounded-md border text-[10px] sm:text-xs font-semibold shrink-0 ${isExpense
                          ? "border-expense/40 text-expense bg-expense/10"
                          : "border-income/40 text-income bg-income/10"
                          }`}
                      >
                        Custom
                      </span>
                    ) : (
                      <div className="p-1 sm:p-1.5 rounded-lg bg-secondary/80 text-muted-foreground shrink-0">
                        <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate" title={category.name}>
                      {category.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                      {!category.is_default ? "Custom" : "Protected"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MODAL - ADD CATEGORY */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) { handleCloseCreate(); } }}>
        <DialogContent className="modal-theme md:max-w-135">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">{t("categories.createCategory")}</DialogTitle>
            <DialogDescription className="hidden">Create custom category helper</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 my-2">

            <form onSubmit={handleCreateSubmit} className="space-y-5 my-2">

              {/* Live Preview */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/10">
                <div
                  className="p-4 rounded-2xl mb-3 animate-pulse"
                  style={{ color: newCategory.color, backgroundColor: `${newCategory.color}15` }}
                >
                  <CategoryPreviewIcon iconName={newCategory.icon} className="h-8 w-8" />
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t("categories.visualPreview")}</span>
                <span className="text-2xl font-bold text-foreground mt-1">
                  {newCategory.name || t("categories.unnamedCategory")}
                </span>
              </div>

              {/* Choosing type of category - Expense / Income */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.categoryType")}</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border/80 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, type: "expense" }))}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${newCategory.type === "expense"
                      ? "bg-card text-orange-600 dark:text-orange-400 font-bold shadow-xs border border-orange-500/30"
                      : "text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                  >
                    {t("transactions.types.expense")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, type: "income" }))}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${newCategory.type === "income"
                      ? "bg-card text-emerald-600 dark:text-emerald-400 font-bold shadow-xs border border-emerald-500/30"
                      : "text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                  >
                    {t("transactions.types.income")}
                  </button>
                </div>
              </div>

              {/* Name of category*/}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.categoryName")}</label>
                <input
                  type="text"
                  placeholder={t("categories.categoryNamePlaceholder")}
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                />
              </div>

              {/* Chosing icon */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.selectIcon")}</label>
                <div className="grid grid-cols-8 gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
                  {AVAILABLE_ICONS.map((item) => {
                    const CurrentIconComponent = item.icon;
                    const isActive = newCategory.icon === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setNewCategory(prev => ({ ...prev, icon: item.name }))}
                        style={
                          isActive
                            ? {
                              backgroundColor: newCategory.color,
                              color: "#ffffff",
                              boxShadow: `0 4px 12px ${newCategory.color}40`,
                            }
                            : {}
                        }
                        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300 cursor-pointer ${isActive
                          ? "scale-110"
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.color")}</label>
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
                  type="submit"
                  disabled={createMutation.isPending || !newCategory.name.trim()}
                  className="w-full h-12 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-bold shadow-md glow-income disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    <span>{t("categories.createCategory")}</span>
                  )}
                </Button>
              </div>

            </form>

          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL UPDATE CATEGORY */}
      <Dialog open={selectedCategory !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="modal-theme md:max-w-135">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {!selectedCategory?.is_default ? t("categories.editCategory") : t("categories.systemDefault")}
            </DialogTitle>
            <DialogDescription className="hidden">Category details editor</DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <form onSubmit={handleSaveChanges} className="space-y-5 my-2">

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
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t("categories.visualPreview")}</span>
                <span className="text-2xl font-bold text-foreground mt-1">{selectedCategory.name}</span>
              </div>

              {/* Warning */}
              {selectedCategory.is_default && (
                <div className="flex gap-3 p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense">
                  <Lock className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">{t("categories.systemDefault")}</p>
                    <p className="text-expense/50">
                      {t("categories.systemDefaultWarning")}
                    </p>
                  </div>
                </div>
              )}

              {/* Input name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.categoryName")}</label>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.selectIcon")}</label>
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
                        style={
                          isActive
                            ? {
                              backgroundColor: selectedCategory.color,
                              color: "#ffffff",
                              boxShadow: `0 4px 12px ${selectedCategory.color}40`,
                            }
                            : {}
                        }
                        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300 cursor-pointer ${isActive
                          ? "scale-110"
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("categories.color")}</label>
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
                <div className="mt-4">

                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || !selectedCategory.name.trim()}
                    className="w-full h-12 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-bold shadow-md glow-income disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      <span>{t("common.saveChanges")}</span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setCategoryToDeleteId(selectedCategory.id)}
                    className="mt-2 w-full text-center bg-transparent rounded-xl text-destructive hover:bg-transparent hover:border-destructive hover:destructive/50 text-sm font-semibold py-1 block transition-all duration-300 cursor-pointer"
                  >
                    {t("categories.deleteConfirm")}
                  </Button>
                </div>
              ) : (

                <Button
                  onClick={handleClose}
                  className="w-full h-11 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl font-semibold mt-2 block sm:inline-flex transition-all duration-300 cursor-pointer"
                >
                  {t("common.close")}
                </Button>
              )}

            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={categoryToDeleteId !== null}
        onOpenChange={(open) => !open && setCategoryToDeleteId(null)}
      >
        <AlertDialogContent className="rounded-3xl border border-border/40 bg-popover sm:max-w-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">{t("transactions.confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {t("categories.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setCategoryToDeleteId(null)}
              className="rounded-xl border border-border/40 hover:bg-secondary/40 cursor-pointer"
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>{t("common.confirm")}</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Mobile Floating Green Add Button */}
      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-20 right-5 z-40 md:hidden bg-income text-primary-foreground hover:bg-income/90 p-4 rounded-full shadow-xl glow-income flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95"
        aria-label="Add Category"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>
    </div>
  );
}