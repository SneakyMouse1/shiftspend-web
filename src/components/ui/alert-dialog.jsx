import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { motion, AnimatePresence } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function AlertDialog({
  open,
  children,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Root open={open} data-slot="alert-dialog" {...props}>
      <AnimatePresence>
        {open && children}
      </AnimatePresence>
    </AlertDialogPrimitive.Root>
  );
}

function AlertDialogTrigger({
  ...props
}) {
  return (<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />);
}

function AlertDialogPortal({
  ...props
}) {
  return (<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />);
}

function AlertDialogOverlay({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      render={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      }
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/60 supports-backdrop-filter:backdrop-blur-sm",
        className
      )}
      {...props} />
  );
}

function AlertDialogContent({
  className,
  size = "default",
  children,
  ...props
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        render={
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          />
        }
        className={cn(
          "group/alert-dialog-content fixed z-50 grid w-full gap-6 bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none dark:ring-foreground/10",
          // Mobile: SlideSheet layout anchored flush to bottom edge
          "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:translate-x-0 max-md:translate-y-0 max-md:w-full max-md:max-w-full max-md:rounded-t-3xl max-md:rounded-b-none max-md:border-t max-md:border-border/40 max-md:p-6 max-md:max-h-[90vh] max-md:overflow-y-auto max-md:mb-0 max-md:m-0",
          // Desktop: Centered alert dialog
          "md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:data-[size=default]:max-w-xs md:data-[size=sm]:max-w-xs md:data-[size=default]:md:max-w-md md:rounded-4xl md:p-6",
          className
        )}
        {...props}>
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto -mt-1 mb-1 md:hidden shrink-0" />
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props} />
  );
}

function AlertDialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props} />
  );
}

function AlertDialogMedia({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-16 items-center justify-center rounded-full bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props} />
  );
}

function AlertDialogTitle({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props} />
  );
}

function AlertDialogDescription({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props} />
  );
}

function AlertDialogAction({
  className,
  ...props
}) {
  return (<Button data-slot="alert-dialog-action" className={cn(className)} {...props} />);
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props} />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
