import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Plus,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  FileText,
  Calendar,
  Wallet,
  FolderOpen,
  Tag as TagIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTag } from "@/hooks/useTags";
import { useTranslation } from "@/hooks/useLanguage";
import { getIconComponent } from "@/config/categoryIcons";
import { getCurrencySymbol } from "@/config/currencies";

export function TransactionDialog({
  isOpen,
  onClose,
  editingTransaction,
  accounts,
  categories,
  tags,
  onSubmit,
  isPending,
}) {
  const { t } = useTranslation();
  const [formType, setFormType] = useState(() => editingTransaction?.type || "expense");
  const [formAmount, setFormAmount] = useState(() => editingTransaction ? String(editingTransaction.amount) : "");
  const [formAccountId, setFormAccountId] = useState(() => editingTransaction?.account?.id ? String(editingTransaction.account.id) : (accounts[0]?.id ? String(accounts[0].id) : ""));
  const [formToAccountId, setFormToAccountId] = useState("");
  const [formCategoryId, setFormCategoryId] = useState(() => {
    if (editingTransaction?.category?.id) return String(editingTransaction.category.id);
    const expCats = categories.filter((c) => c.type === (editingTransaction?.type || "expense"));
    return expCats[0]?.id ? String(expCats[0].id) : "";
  });
  const [formDate, setFormDate] = useState(() => editingTransaction?.date || format(new Date(), "yyyy-MM-dd"));
  const [formComment, setFormComment] = useState(() => editingTransaction?.comment || "");
  const [formSelectedTags, setFormSelectedTags] = useState(() => editingTransaction?.tags ? editingTransaction.tags.map((t) => t.id) : []);
  const [newTagName, setNewTagName] = useState("");

  const createTagMutation = useCreateTag();

  const effectiveAccountId = formAccountId || (accounts[0]?.id ? String(accounts[0].id) : "");

  const activeAccountObj = useMemo(
    () => accounts.find((a) => String(a.id) === String(effectiveAccountId)),
    [accounts, effectiveAccountId]
  );
  const activeCurrencySymbol = activeAccountObj?.currency_code ?? "USD";

  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === formType),
    [categories, formType]
  );

  const toggleTagInForm = (tagId) => {
    setFormSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const randomColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    const payload = {
      name: newTagName.trim(),
      color: randomColors[Math.floor(Math.random() * randomColors.length)],
    };

    createTagMutation.mutate(payload, {
      onSuccess: (newTag) => {
        setFormSelectedTags((prev) => [...prev, newTag.id]);
        setNewTagName("");
      },
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formAmount || !effectiveAccountId || !formDate) return;

    const payload = {
      type: formType,
      amount: parseFloat(formAmount),
      account_id: parseInt(effectiveAccountId, 10),
      date: formDate,
      comment: formComment.trim() || null,
      currency_code: activeCurrencySymbol,
      tags: formSelectedTags,
    };

    if (formType === "transfer") {
      if (!formToAccountId) return;
      payload.to_account_id = parseInt(formToAccountId, 10);
    } else {
      if (formCategoryId) payload.category_id = parseInt(formCategoryId, 10);
    }

    onSubmit(payload);
  };

  const addPresetAmount = (delta) => {
    const current = parseFloat(formAmount) || 0;
    const next = Math.max(0, current + delta);
    setFormAmount(String(next % 1 === 0 ? next : next.toFixed(2)));
  };

  const handleAmountBlur = () => {
    if (!formAmount) return;
    try {
      const clean = formAmount.replace(/,/g, ".").trim();
      if (/^[\d+\-*/.\s()]+$/.test(clean)) {
        const result = Function(`"use strict"; return (${clean})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result) && result >= 0) {
          setFormAmount(String(result % 1 === 0 ? result : result.toFixed(2)));
        }
      }
    } catch {
      // keep current string
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="modal-theme md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {editingTransaction ? t("transactions.editTransaction") : t("transactions.newTransaction")}
          </DialogTitle>
          <DialogDescription className="hidden">Transaction details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Tab selector for transaction types */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-secondary/30 border border-border/40 rounded-xl">
              {[
                { id: "expense", label: t("transactions.types.expense"), icon: ArrowDownLeft },
                { id: "income", label: t("transactions.types.income"), icon: ArrowUpRight },
                { id: "transfer", label: t("transactions.types.transfer"), icon: ArrowLeftRight }
              ].map(({ id, label, icon: TabIcon }) => {
                const isActive = formType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setFormType(id);
                      const nextCats = categories.filter((c) => c.type === id);
                      setFormCategoryId(nextCats[0]?.id ? String(nextCats[0].id) : "");
                      if (id !== "transfer") setFormToAccountId("");
                    }}
                    className={`flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg border border-transparent transition-all duration-300 cursor-pointer ${
                      isActive
                        ? id === "expense"
                          ? "bg-card border-expense/30 text-expense glow-expense drop-shadow-[0_0_10px_rgba(251,146,60,0.15)]"
                          : id === "income"
                            ? "bg-card border-income/30 text-income glow-income drop-shadow-[0_0_10px_rgba(74,222,128,0.15)]"
                            : "bg-card border-border text-foreground"
                        : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <TabIcon className="h-4 w-4 mr-2" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount input + Quick Presets */}
          <div className="bg-secondary/30 border border-border/40 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center relative space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{t("common.amount")}</span>
            <div className="flex items-center justify-center font-mono">
              <span className="text-muted-foreground/50 text-3xl font-semibold select-none mr-2">
                {getCurrencySymbol(activeCurrencySymbol)}
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder={t("transactions.amountPlaceholder")}
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                onBlur={handleAmountBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAmountBlur();
                  }
                }}
                className={`bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-48 text-4xl font-extrabold text-center transition-all ${
                  formType === "expense"
                    ? "text-expense font-extrabold"
                    : formType === "income"
                      ? "text-income font-extrabold"
                      : "text-foreground font-extrabold"
                }`}
              />
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {[5, 10, 20, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addPresetAmount(preset)}
                  className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-secondary/80 hover:bg-secondary border border-border/40 text-foreground transition-all active:scale-95 cursor-pointer"
                >
                  +{preset}
                </button>
              ))}
              {formAmount && formAmount !== "0" && (
                <button
                  type="button"
                  onClick={() => setFormAmount("")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all active:scale-95 cursor-pointer"
                >
                  {t("common.clear")}
                </button>
              )}
            </div>
          </div>

          {/* Description input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{t("common.description")}</span>
            </label>
            <input
              type="text"
              placeholder={t("transactions.descriptionPlaceholder")}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              className={`w-full px-4 py-3 bg-secondary/30 border border-border/40 text-foreground text-sm rounded-xl focus:outline-none transition-colors duration-200 ${
                formType === "expense"
                  ? "focus:border-expense focus:ring-1 focus:ring-expense"
                  : formType === "income"
                    ? "focus:border-income focus:ring-1 focus:ring-income"
                    : "focus:border-ring focus:ring-1 focus:ring-ring"
              }`}
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{t("common.date")}</span>
            </label>
            <Input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className={`bg-secondary/30 border-border/40 rounded-xl h-11 text-sm focus-visible:ring-0 transition-colors duration-200 ${
                formType === "expense"
                  ? "focus:border-expense"
                  : formType === "income"
                    ? "focus:border-income"
                    : "focus:border-ring"
              }`}
            />
          </div>

          {/* Transfer accounts vs Single account selector */}
          {formType === "transfer" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-muted-foreground/80" />
                  <span>{t("transactions.sourceAccount")}</span>
                </label>
                <Select value={effectiveAccountId} onValueChange={setFormAccountId}>
                  <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl h-11">
                    <SelectValue placeholder={t("transactions.sourceAccount")}>
                      {accounts.find((acc) => String(acc.id) === String(effectiveAccountId))?.name || t("transactions.sourceAccount")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {accounts
                      .filter((acc) => String(acc.id) !== String(formToAccountId))
                      .map((acc) => (
                        <SelectItem key={acc.id} value={String(acc.id)}>
                          {acc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-muted-foreground/80" />
                  <span>{t("transactions.destinationAccount")}</span>
                </label>
                <Select value={formToAccountId} onValueChange={setFormToAccountId}>
                  <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl h-11">
                    <SelectValue placeholder={t("transactions.destinationAccount")}>
                      {accounts.find((acc) => String(acc.id) === String(formToAccountId))?.name || t("transactions.destinationAccount")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {accounts
                      .filter((acc) => String(acc.id) !== String(effectiveAccountId))
                      .map((acc) => (
                        <SelectItem key={acc.id} value={String(acc.id)}>
                          {acc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-muted-foreground/80" />
                <span>{t("common.account")}</span>
              </label>
              <Select value={effectiveAccountId} onValueChange={setFormAccountId}>
                <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl h-11">
                  <SelectValue placeholder={t("transactions.selectAccount")}>
                    {accounts.find((acc) => String(acc.id) === String(effectiveAccountId))?.name || t("transactions.selectAccount")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Categories Grid (hidden for transfers) */}
          {formType !== "transfer" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FolderOpen className="h-3.5 w-3.5 text-muted-foreground/80" />
                <span>{t("transactions.selectCategory")}</span>
              </label>
              <div className="bg-secondary/20 border border-border/30 rounded-2xl p-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredCategories.map((cat) => {
                    const IconComponent = getIconComponent(cat.icon);
                    const isSelected = String(formCategoryId) === String(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormCategoryId(cat.id)}
                        style={{
                          borderColor: isSelected ? cat.color : "transparent",
                          color: isSelected ? cat.color : "var(--muted-foreground)",
                          backgroundColor: isSelected ? `${cat.color}15` : "var(--secondary)/25",
                          boxShadow: isSelected ? `0 0 10px ${cat.color}25` : "none",
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? ""
                            : "border-border/30 bg-[#1c1c1f]/40 hover:border-border/50 hover:text-foreground"
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mb-1.5 shrink-0" />
                        <span className="text-xs font-bold truncate max-w-full">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center">
              <TagIcon className="h-3.5 w-3.5 mr-1" />
              <span>{t("transactions.allTags")}</span>
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="#tag..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateTag(e);
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-secondary/30 border border-border/40 text-foreground text-sm rounded-xl focus:outline-none transition-colors duration-200 ${
                    formType === "expense"
                      ? "focus:border-expense focus:ring-1 focus:ring-expense"
                      : formType === "income"
                        ? "focus:border-income focus:ring-1 focus:ring-income"
                        : "focus:border-ring focus:ring-1 focus:ring-ring"
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || createTagMutation.isPending}
                className="h-10 w-10 shrink-0 bg-secondary border border-border/40 hover:bg-secondary/80 text-foreground rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 disabled:opacity-50"
              >
                {createTagMutation.isPending ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Plus className="h-4.5 w-4.5" />
                )}
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-secondary/20 border border-border/30 max-h-24 overflow-y-auto">
                {tags.map((tag) => {
                  const isActive = formSelectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTagInForm(tag.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-foreground text-background border-foreground shadow-sm"
                          : "bg-transparent text-muted-foreground/80 border-border hover:border-muted-foreground"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={
                isPending ||
                !formAmount ||
                !effectiveAccountId ||
                !formDate ||
                (formType === "transfer" && !formToAccountId)
              }
              className={`w-full h-12 text-primary-foreground rounded-xl font-bold shadow-md transition-all duration-300 cursor-pointer ${
                formType === "expense"
                  ? "bg-expense hover:bg-expense/90 glow-expense"
                  : formType === "income"
                    ? "bg-income hover:bg-income/90 glow-income"
                    : "bg-foreground text-background hover:bg-foreground/90 glow-balance"
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                <span>{editingTransaction ? t("common.saveChanges") : t("transactions.addTransaction")}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
