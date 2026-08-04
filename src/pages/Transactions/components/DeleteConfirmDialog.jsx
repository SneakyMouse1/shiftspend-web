import { Loader2 } from "lucide-react";
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

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl border border-border/40 bg-popover sm:max-w-100">
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
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl cursor-pointer"
          >
            {/* Delete Confirmation Action */}
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Confirm</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
