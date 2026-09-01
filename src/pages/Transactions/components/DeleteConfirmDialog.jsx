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
import { useTranslation } from "@/hooks/useLanguage";

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl border border-border/40 bg-popover sm:max-w-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">{t("transactions.confirmDeleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {t("transactions.deleteTransferWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl border border-border/40 hover:bg-secondary/40 cursor-pointer">
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>{t("common.confirm")}</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
