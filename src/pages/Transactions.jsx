import { useState, useMemo, useCallback } from "react";
import { format, isToday, parseISO } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  ArrowLeftRight,
  X,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  MoreVertical,
  FileText,
  Wallet,
  FolderOpen,
} from "lucide-react";

import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useTags, useCreateTag } from "@/hooks/useTags";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIconComponent } from "@/config/categoryIcons";
import { formatCurrency, getCurrencySymbol } from "@/config/currencies";

const formatGroupDate = (dateStr) => {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return `TODAY, ${format(date, "MMMM d").toUpperCase()}`;
    }
    return format(date, "EEE, MMM d, yyyy").toUpperCase();
  } catch {
    return dateStr.toUpperCase();
  }
};

// Moved to module level: pure function with no component deps,
// no reason to re-declare it on every render inside the component
const processAndGroupTransactions = (rawList) => {
  const mergedList = [];
  const seenTransfers = new Set();

  for (const item of rawList) {
    if (item.transfer_id) {
      if (seenTransfers.has(item.transfer_id)) {
        const existing = mergedList.find((r) => r.transfer_id === item.transfer_id);
        if (existing) {
          if (item.type === "expense") {
            existing.source_account = item.account;
          } else if (item.type === "income") {
            existing.destination_account = item.account;
          }
        }
        continue;
      }

      seenTransfers.add(item.transfer_id);
      const merged = {
        ...item,
        type: "transfer",
        source_account: item.type === "expense" ? item.account : (item.related_transaction?.account || null),
        destination_account: item.type === "income" ? item.account : (item.related_transaction?.account || null),
      };
      mergedList.push(merged);
    } else {
      mergedList.push(item);
    }
  }

  const grouped = mergedList.reduce((acc, item) => {
    const dateKey = item.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({
      date,
      items: grouped[date],
    }));
};

export default function Transactions() {
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [formType, setFormType] = useState("expense");  const [formAmount, setFormAmount] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formToAccountId, setFormToAccountId] = useState("");  const [formCategoryId, setFormCategoryId] = useState("");  const [formDate, setFormDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [formComment, setFormComment] = useState("");
  const [formSelectedTags, setFormSelectedTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const createTagMutation = useCreateTag();

  // useMemo: activeFilters object is the queryKey for TanStack Query.
  // Without memoization a new object is created every render, which could
  // cause unnecessary refetches if the hook compares by reference
  const activeFilters = useMemo(() => {
    const f = { page, per_page: perPage, sort: "-date" };
    if (search.trim()) f.search = search.trim();
    if (selectedType !== "all") f.type = selectedType;
    if (selectedAccount !== "all") f.account_id = selectedAccount;
    if (selectedCategory !== "all") f.category_id = selectedCategory;
    if (selectedTag !== "all") f.tag = selectedTag;
    if (dateFrom) f.date_from = dateFrom;
    if (dateTo) f.date_to = dateTo;
    return f;
  }, [page, perPage, search, selectedType, selectedAccount, selectedCategory, selectedTag, dateFrom, dateTo]);

  const { data: transactionsData, isLoading, isError } = useTransactions(activeFilters);
  
  // Wrap in useMemo to prevent "?? []" from creating a new array reference on every render,
  // which causes downstream useMemo calls depending on [transactions] to rerun needlessly.
  const transactions = useMemo(() => transactionsData?.data ?? [], [transactionsData]);
  const meta = transactionsData?.meta || {};

  // useMemo: processAndGroupTransactions iterates the full transaction list—
  // memoize so it only reruns when the server data actually changes,
  // not when filter dropdowns open or form fields are typed into
  const groupedTransactions = useMemo(
    () => processAndGroupTransactions(transactions),
    [transactions]
  );

  // useMemo: stable account lookup—avoids .find() on every render
  const activeAccountObj = useMemo(
    () => accounts.find((a) => String(a.id) === String(formAccountId)),
    [accounts, formAccountId]
  );
  const activeCurrencySymbol = activeAccountObj?.currency_code ?? "USD";

  // useMemo: filtered categories change only when the source list or selected type changes
  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === formType),
    [categories, formType]
  );

  const resetCreateForm = () => {
    setEditingTransaction(null);
    setFormType("expense");
    setFormAmount("");
    setFormAccountId(accounts[0]?.id ? String(accounts[0].id) : "");
    setFormToAccountId("");
    const expCats = categories.filter((c) => c.type === "expense");
    setFormCategoryId(expCats[0]?.id ? String(expCats[0].id) : "");
    setFormDate(format(new Date(), "yyyy-MM-dd"));
    setFormComment("");
    setFormSelectedTags([]);
    setNewTagName("");
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedAccount("all");
    setSelectedCategory("all");
    setSelectedTag("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    if (window.innerWidth < 768) {
      setIsFiltersOpen(false);
    }
  };

  const handleStartEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormType(transaction.type);
    setFormAmount(String(transaction.amount));
    setFormAccountId(transaction.account?.id ? String(transaction.account.id) : "");
    setFormToAccountId("");
    setFormCategoryId(transaction.category?.id ? String(transaction.category.id) : "");
    setFormDate(transaction.date);
    setFormComment(transaction.comment || "");
    setFormSelectedTags(transaction.tags ? transaction.tags.map((t) => t.id) : []);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formAmount || !formAccountId || !formDate) return;

    const payload = {
      type: formType,
      amount: parseFloat(formAmount),
      account_id: parseInt(formAccountId, 10),
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

    if (editingTransaction) {
      updateMutation.mutate(
        { id: editingTransaction.id, payload },
        {
          onSuccess: () => {
            setIsCreateOpen(false);
            resetCreateForm();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsCreateOpen(false);
          resetCreateForm();
          setPage(1);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deleteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

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

  // useCallback: handleFilterChange was a curried factory that created
  // a new closure on every render for every filter. Replaced with
  // a single stable callback that takes both setter and value
  const handleFilterChange = useCallback((setter, val) => {
    setter(val);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6 relative pb-20 md:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Ledger Transactions</h1>
          <p className="text-muted-foreground text-sm">
            Search, filter, and audit your money flow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`border-border/40 hover:bg-secondary/40 text-foreground cursor-pointer rounded-xl h-11 px-4 ${
              isFiltersOpen ? "bg-secondary" : "bg-card/50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </Button>

          <Button
            onClick={() => {
              resetCreateForm();
              setIsCreateOpen(true);
            }}
            className="bg-income text-primary-foreground hover:bg-income/90 font-semibold shadow-md glow-income rounded-xl h-11 px-4 hidden md:flex cursor-pointer transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search descriptions, hash tags..."
          value={search}
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-card border border-border/40 hover:border-border/60 focus:border-ring rounded-3xl text-sm focus:outline-none transition-all duration-300 shadow-inner"
        />
        {search && (
          <button
            onClick={() => handleFilterChange(setSearch, "")}
            className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card/40 border border-border/40 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                <Select value={selectedType} onValueChange={(val) => handleFilterChange(setSelectedType, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder="All types">
                      {selectedType === "all" ? "All Types" : selectedType === "expense" ? "Expense" : selectedType === "income" ? "Income" : selectedType === "transfer" ? "Transfer" : "All Types"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account</label>
                <Select value={selectedAccount} onValueChange={(val) => handleFilterChange(setSelectedAccount, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder="All accounts">
                      {selectedAccount === "all" ? "All Accounts" : accounts.find(a => String(a.id) === String(selectedAccount))?.name || "All Accounts"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={String(acc.id)}>
                        {acc.name} ({acc.currency_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                <Select value={selectedCategory} onValueChange={(val) => handleFilterChange(setSelectedCategory, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder="All categories">
                      {selectedCategory === "all" ? "All Categories" : categories.find(c => String(c.id) === String(selectedCategory))?.name || "All Categories"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tag</label>
                <Select value={selectedTag} onValueChange={(val) => handleFilterChange(setSelectedTag, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder="All tags">
                      {selectedTag === "all" ? "All Tags" : `#${selectedTag}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {tags.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        #{t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleFilterChange(setDateFrom, e.target.value)}
                  className="bg-secondary/40 border-border/40 rounded-xl h-10 text-sm focus-visible:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleFilterChange(setDateTo, e.target.value)}
                  className="bg-secondary/40 border-border/40 rounded-xl h-10 text-sm focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-income" />
          <p className="text-sm text-muted-foreground">Gathering financial flows...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
          <p className="text-destructive font-medium">Failed to load transactions.</p>
          <Button variant="outline" onClick={() => setPage(1)} className="rounded-xl">
            Retry
          </Button>
        </div>
      ) : groupedTransactions.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border/40 rounded-3xl bg-card/20 space-y-3">
          <p className="text-muted-foreground text-sm font-medium">No transactions matched your query.</p>
          <Button
            variant="outline"
            className="rounded-xl text-xs"
            onClick={handleClearFilters}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground tracking-wider select-none">
                <Calendar className="h-4.5 w-4.5" />
                <span>{formatGroupDate(group.date)}</span>
              </div>

              <div className="space-y-3">
                {group.items.map((transaction) => {
                  const isTransfer = transaction.type === "transfer";
                  const isExpense = transaction.type === "expense";
                  const isIncome = transaction.type === "income";

                  const catColor = transaction.category?.color || "#9ca3af";
                  const Icon = isTransfer ? ArrowLeftRight : getIconComponent(transaction.category?.icon);

                  return (
                    <div
                      key={transaction.id}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/30 hover:border-border/60 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className="p-3 rounded-xl shrink-0 flex items-center justify-center"
                          style={{
                            color: isTransfer ? "var(--muted-foreground)" : catColor,
                            backgroundColor: isTransfer ? "var(--secondary)" : `${catColor}15`,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground truncate max-w-50 sm:max-w-xs md:max-w-md">
                            {transaction.comment || (isTransfer ? "Transfer" : transaction.category?.name || "Uncategorized")}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {isTransfer ? (
                              <span className="flex items-center gap-1">
                                <span>Transfer</span>
                                <span className="mx-1">•</span>
                                <span>{transaction.source_account?.name || "Chase Checking"}</span>
                                <span className="text-emerald-500">→</span>
                                <span>{transaction.destination_account?.name || "Coinbase Port"}</span>
                              </span>
                            ) : (
                              <span>
                                {transaction.category?.name || "General"} • {transaction.account?.name}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right space-y-1">
                          <div
                            className={`font-bold font-mono tracking-tight ${
                              isExpense
                                ? "text-expense"
                                : isIncome
                                  ? "text-income"
                                  : "text-foreground"
                            }`}
                          >
                            {isExpense ? "-" : isIncome ? "+" : ""}
                            {formatCurrency(transaction.amount, transaction.currency_code)}
                          </div>

                          {transaction.tags && transaction.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-end">
                              {transaction.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  onClick={() => handleFilterChange(setSelectedTag, tag.name)}
                                  className="px-1.5 py-0.5 border border-border bg-secondary/35 rounded text-[10px] text-muted-foreground font-mono cursor-pointer hover:border-foreground/30 hover:text-foreground transition-all select-none"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-all cursor-pointer shrink-0"
                              aria-label="Transaction actions"
                            >
                              <MoreVertical className="h-4.5 w-4.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl min-w-30 bg-popover border border-border/40 p-1">
                            {!isTransfer && (
                              <DropdownMenuItem onClick={() => handleStartEdit(transaction)} className="cursor-pointer flex items-center px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-all">
                                <Pencil className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirmId(transaction.id)}
                              className="cursor-pointer flex items-center px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-xs text-muted-foreground">
                Showing Page {meta.current_page} of {meta.last_page} ({meta.total} records)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="h-8 w-8 rounded-lg cursor-pointer border-border/40 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
                  disabled={page === meta.last_page}
                  className="h-8 w-8 rounded-lg cursor-pointer border-border/40 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && setIsCreateOpen(false)}>
        <DialogContent className="modal-theme md:max-w-135">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-center md:text-left">
              {editingTransaction ? "Edit Ledger Transaction" : "Record Ledger Transaction"}
            </DialogTitle>
            <DialogDescription className="hidden">Log income, expense, or transfers details</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-secondary/30 border border-border/40 rounded-xl">
                {[
                  { id: "expense", label: "Expense", icon: ArrowDownLeft },
                  { id: "income", label: "Income", icon: ArrowUpRight },
                  { id: "transfer", label: "Transfer", icon: ArrowLeftRight }
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

            <div className="bg-[#131316]/50 border border-border/20 rounded-2xl p-5 flex flex-col items-center justify-center relative">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground/50 mb-2">TRANSACTION AMOUNT</span>
              <div className="flex items-center justify-center font-mono">
                <span className="text-muted-foreground/35 text-3xl font-semibold select-none mr-2">
                  {getCurrencySymbol(activeCurrencySymbol)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className={`bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-44 text-4xl font-extrabold text-center transition-all ${
                    formType === "expense"
                      ? "text-expense drop-shadow-[0_0_15px_rgba(251,146,60,0.35)] font-extrabold"
                      : formType === "income"
                        ? "text-income drop-shadow-[0_0_15px_rgba(74,222,128,0.35)] font-extrabold"
                        : "text-foreground drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] font-extrabold"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
                <span>Description / Vendor</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Whole Foods, Monthly Salary, Rent..."
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                <span>Date</span>
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

            {formType === "transfer" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-muted-foreground/80" />
                    <span>From Account</span>
                  </label>
                  <Select value={formAccountId} onValueChange={setFormAccountId}>
                    <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl h-11">
                      <SelectValue placeholder="Source Account">
                        {accounts.find((acc) => String(acc.id) === String(formAccountId))?.name || "Source Account"}
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
                    <span>To Account</span>
                  </label>
                  <Select value={formToAccountId} onValueChange={setFormToAccountId}>
                    <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl h-11">
                      <SelectValue placeholder="Destination Account">
                        {accounts.find((acc) => String(acc.id) === String(formToAccountId))?.name || "Destination Account"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {accounts
                        .filter((acc) => String(acc.id) !== String(formAccountId))
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
                  <span>Account</span>
                </label>
                <Select value={formAccountId} onValueChange={setFormAccountId}>
                  <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl h-11">
                    <SelectValue placeholder="Select Account">
                      {accounts.find((acc) => String(acc.id) === String(formAccountId))?.name || "Select Account"}
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

            {formType !== "transfer" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5 text-muted-foreground/80" />
                  <span>Select Category</span>
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1" />
                <span>Tags</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type tag and press enter..."
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

            <div className="pt-2">
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  !formAmount ||
                  !formAccountId ||
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
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span>{editingTransaction ? "Save Changes" : "Record Transaction"}</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <button
        onClick={() => {
          resetCreateForm();
          setIsCreateOpen(true);
        }}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-income text-primary-foreground hover:bg-income/90 flex items-center justify-center rounded-full shadow-2xl glow-income border border-income/30 transition-all duration-300 transform active:scale-95 cursor-pointer z-50"
        aria-label="Add Transaction"
      >
        <Plus className="h-7 w-7" />
      </button>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="rounded-3xl border border-border/40 bg-popover max-w-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. If it is a transfer, both matching transactions will be deleted and balances reverted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border border-border/40 hover:bg-secondary/40 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Confirm</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}