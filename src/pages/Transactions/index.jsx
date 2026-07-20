import { useState, useMemo, useCallback } from "react";
import { Plus, SlidersHorizontal, Loader2 } from "lucide-react";
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { Button } from "@/components/ui/button";

import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionFeed } from "./components/TransactionFeed";
import { TransactionDialog } from "./components/TransactionDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";

// Pure helper function: groups loaded transaction list by day
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

  // Function to group transactions by date (no need to re-declare on every render)
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

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  // Dialog State Flags
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  // useMemo used for reference stability & performance optimization
  // How it works: Caches the calculated value of activeFilters between renders.
  // It only runs the calculation again if any of the dependencies in the array change.
  // React compares objects by reference. If we created a new object on every render,
  // TanStack Query would see it as a different key, triggering infinite render/refetch loops.
  // Memoization keeps the queryKey reference stable.
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

  // Memoized transactions feed array reference
  const transactions = useMemo(() => transactionsData?.data ?? [], [transactionsData]);
  const meta = transactionsData?.meta ?? {};

  const groupedTransactions = useMemo(
    () => processAndGroupTransactions(transactions),
    [transactions]
  );

  const resetCreateForm = () => {
    setEditingTransaction(null);
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

  const handleStartEdit = useCallback((transaction) => {
    setEditingTransaction(transaction);
    setIsCreateOpen(true);
  }, []);

  const handleCreateSubmit = (payload) => {
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

  // Callback that resets the pagination page to 1 whenever any filter changes.
  const handleFilterChange = useCallback((setter, val) => {
    setter(val);
    setPage(1);
  }, []);

  const handleTagClick = useCallback((tagName) => {
    handleFilterChange(setSelectedTag, tagName);
  }, [handleFilterChange]);

  return (
    <div className="space-y-6 relative pb-20 md:pb-0">
      {/* Page Header: Title and main action buttons */}
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

      {/* Filter Inputs (collapsible grid + search input) */}
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        isFiltersOpen={isFiltersOpen}
        setIsFiltersOpen={setIsFiltersOpen}
        onClearFilters={handleClearFilters}
        accounts={accounts}
        categories={categories}
        tags={tags}
        handleFilterChange={handleFilterChange}
      />

      {/* Conditional UI Feed States Rendering */}
      {isLoading ? (
        /* Loading Spinner State */
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-income" />
          <p className="text-sm text-muted-foreground">Gathering financial flows...</p>
        </div>
      ) : isError ? (
        /* Error Fallback UI */
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
          <p className="text-destructive font-medium">Failed to load transactions.</p>
          <Button variant="outline" onClick={() => setPage(1)} className="rounded-xl">
            Retry
          </Button>
        </div>
      ) : (
        /* Feed and pagination renderer */
        <TransactionFeed
          groupedTransactions={groupedTransactions}
          meta={meta}
          page={page}
          setPage={setPage}
          onClearFilters={handleClearFilters}
          onStartEdit={handleStartEdit}
          onDelete={setDeleteConfirmId}
          onTagClick={handleTagClick}
        />
      )}

      {/* Creation/edition form dialog modal */}
      {isCreateOpen && (
        <TransactionDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          key={editingTransaction?.id || "new"}
          editingTransaction={editingTransaction}
          accounts={accounts}
          categories={categories}
          tags={tags}
          onSubmit={handleCreateSubmit}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Floating Action Button (FAB) for mobile viewports */}
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

      {/* Confirmation dialog for deleting transaction entries */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
