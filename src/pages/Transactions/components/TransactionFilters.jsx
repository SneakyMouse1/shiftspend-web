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
import { useTranslation } from "@/hooks/useLanguage";

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
  const { t } = useTranslation();

  return (
    <>
      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("transactions.searchPlaceholder")}
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("transactions.types.expense")}</label>
                <Select value={selectedType} onValueChange={(val) => handleFilterChange(setSelectedType, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder={t("transactions.allTypes")}>
                      {selectedType === "all" ? t("transactions.allTypes") : selectedType === "expense" ? t("transactions.types.expense") : selectedType === "income" ? t("transactions.types.income") : selectedType === "transfer" ? t("transactions.types.transfer") : t("transactions.allTypes")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allTypes")}</SelectItem>
                    <SelectItem value="expense">{t("transactions.types.expense")}</SelectItem>
                    <SelectItem value="income">{t("transactions.types.income")}</SelectItem>
                    <SelectItem value="transfer">{t("transactions.types.transfer")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Account Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("common.account")}</label>
                <Select value={selectedAccount} onValueChange={(val) => handleFilterChange(setSelectedAccount, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder={t("transactions.allAccounts")}>
                      {selectedAccount === "all" ? t("transactions.allAccounts") : accounts.find(a => String(a.id) === String(selectedAccount))?.name || t("transactions.allAccounts")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allAccounts")}</SelectItem>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("common.category")}</label>
                <Select value={selectedCategory} onValueChange={(val) => handleFilterChange(setSelectedCategory, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder={t("transactions.allCategories")}>
                      {selectedCategory === "all" ? t("transactions.allCategories") : categories.find(c => String(c.id) === String(selectedCategory))?.name || t("transactions.allCategories")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allCategories")}</SelectItem>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("transactions.allTags")}</label>
                <Select value={selectedTag} onValueChange={(val) => handleFilterChange(setSelectedTag, val)}>
                  <SelectTrigger className="w-full bg-secondary/40 border-border/40 rounded-xl h-10">
                    <SelectValue placeholder={t("transactions.allTags")}>
                      {selectedTag === "all" ? t("transactions.allTags") : `#${selectedTag}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allTags")}</SelectItem>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("transactions.fromDate")}</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleFilterChange(setDateFrom, e.target.value)}
                  className="bg-secondary/40 border-border/40 rounded-xl h-10 text-sm focus-visible:ring-0"
                />
              </div>

              {/* To Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("transactions.toDate")}</label>
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
                {t("transactions.clearFilters")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
