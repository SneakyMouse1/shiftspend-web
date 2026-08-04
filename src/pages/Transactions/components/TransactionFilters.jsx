import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransactionFilters({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedAccount,
  setSelectedAccount,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  isFiltersOpen,
  onClearFilters,
  accounts,
  categories,
  tags,
  handleFilterChange,
}) {
  return (
    <>
      {/* Search Input Bar */}
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

      {/* Expandable Filter Grid Options */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card/40 border border-border/40 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Type Select */}
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

              {/* Account Select */}
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

              {/* Category Select */}
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

              {/* Tag Select */}
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

              {/* From Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleFilterChange(setDateFrom, e.target.value)}
                  className="bg-secondary/40 border-border/40 rounded-xl h-10 text-sm focus-visible:ring-0"
                />
              </div>

              {/* To Date */}
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

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={onClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
