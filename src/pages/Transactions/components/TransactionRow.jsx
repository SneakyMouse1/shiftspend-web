import React from "react";
import {
  ArrowLeftRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getIconComponent } from "@/config/categoryIcons";
import { formatCurrency } from "@/config/currencies";

// React.memo used for performance optimization - prevents unnecessary re-renders
// How it works: If the props passed to this component haven't changed, 
// React will skip re-rendering this component and reuse the previous result.
// This is useful for long lists of transactions where only some of them are updated.
// When its not working: () => {} will cause re-renders, to avoid that, use useCallback
export const TransactionRow = React.memo(function TransactionRow({
  transaction,
  onStartEdit,
  onDelete,
  onTagClick,
}) {
  const isTransfer = transaction.type === "transfer";
  const isExpense = transaction.type === "expense";
  const isIncome = transaction.type === "income";

  const catColor = transaction.category?.color || "#9ca3af";
  const Icon = isTransfer ? ArrowLeftRight : getIconComponent(transaction.category?.icon);

  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/30 hover:border-border/60 hover:shadow-sm transition-all duration-300">
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
                <span className="text-income">→</span>
                <span>{transaction.destination_account?.name || "Chase Checking"}</span>
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
                  onClick={() => onTagClick(tag.name)}
                  className="px-1.5 py-0.5 border border-border bg-secondary/35 rounded text-[10px] text-muted-foreground font-mono cursor-pointer hover:border-foreground/30 hover:text-foreground transition-all select-none"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="p-2 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-all cursor-pointer shrink-0"
            aria-label="Transaction actions"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl min-w-30 bg-popover border border-border/40 p-1">
            {!isTransfer && (
              <DropdownMenuItem onClick={() => onStartEdit(transaction)} className="cursor-pointer flex items-center px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-all">
                <Pencil className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Edit</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(transaction.id)}
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
});
