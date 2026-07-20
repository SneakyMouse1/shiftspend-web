import { format, isToday, parseISO } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionRow } from "./TransactionRow";

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

export function TransactionFeed({
  groupedTransactions,
  meta,
  page,
  setPage,
  onClearFilters,
  onStartEdit,
  onDelete,
  onTagClick,
}) {
  if (groupedTransactions.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-border/40 rounded-3xl bg-card/20 space-y-3">
        <p className="text-muted-foreground text-sm font-medium">No transactions matched your query.</p>
        <Button
          variant="outline"
          className="rounded-xl text-xs"
          onClick={onClearFilters}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Date Groups */}
      {groupedTransactions.map((group) => (
        <div key={group.date} className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground tracking-wider select-none">
            <Calendar className="h-4.5 w-4.5" />
            <span>{formatGroupDate(group.date)}</span>
          </div>

          <div className="space-y-3">
            {/* List of transactions in this group */}
            {group.items.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onStartEdit={onStartEdit}
                onDelete={onDelete}
                onTagClick={onTagClick}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
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
  );
}
