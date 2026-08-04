import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { motion, AnimatePresence } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({
  open,
  children,
  ...props
}) {
  return (
    <DialogPrimitive.Root open={open} data-slot="dialog" {...props}>
      <AnimatePresence>
        {open && children}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
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

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        render={
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          />
        }
        className={cn(
          "fixed z-50 grid w-full gap-6 bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none dark:ring-foreground/10",
          // Mobile: SlideSheet layout anchored flush to bottom edge
          "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:translate-x-0 max-md:translate-y-0 max-md:w-full max-md:max-w-full max-md:rounded-t-3xl max-md:rounded-b-none max-md:border-t max-md:border-border/40 max-md:p-6 max-md:max-h-[90vh] max-md:overflow-y-auto max-md:mb-0 max-md:m-0",
          // Desktop: Centered modal dialog
          "md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-4xl md:p-6",
          className
        )}
        {...props}>
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto -mt-1 mb-1 md:hidden shrink-0" />
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4 bg-secondary"
                size="icon-sm" />
            }>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props} />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props} />
  );
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
