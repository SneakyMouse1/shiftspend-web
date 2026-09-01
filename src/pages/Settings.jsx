import React, { useState, useEffect } from "react";
import { User, Save, KeyRound, Loader2, AlertTriangle, Trash2, ShieldCheck, Mail, Globe } from "lucide-react";
import { toast } from "sonner";

import { useAuth, useUpdateProfile, useChangePassword, useDeleteAccount } from "@/hooks/useAuth";
import { CURRENCIES } from "@/config/currencies";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Settings() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.settings?.currency || "EUR");

  const changePasswordMutation = useChangePassword();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const deleteAccountMutation = useDeleteAccount();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ current_password: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.settings?.currency) {
        setCurrency(user.settings.currency);
      }
    }
  }, [user]);

  // INITIAL STATE FOR PASSWORD CHANGE IN MODAL
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleClosePassword = () => {
    setIsPasswordOpen(false);
    setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
  };

  // CHANGE PASSWORD
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.current_password || !passwordForm.password || !passwordForm.password_confirmation) return;
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => handleClosePassword(),
    });
  };

  // DELETE ACCOUNT
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeleteForm({ current_password: "" });
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    if (!deleteForm.current_password) return;

    deleteAccountMutation.mutate(
      { current_password: deleteForm.current_password },
      {
        onSuccess: () => {
          window.location.href = "/login";
        },
      }
    );
  };

  // SUBMIT CHANGES
  const handleSave = (e) => {
    e?.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      settings: { currency },
    });
  };

  const avatarLetter = (name.trim() || user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your personal profile, currency preferences, and security settings.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="w-full sm:w-auto px-6 h-11 sm:h-12 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-bold shadow-md glow-income disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </span>
          )}
        </Button>
      </div>

      {/* MAIN SETTINGS CONTENT */}
      <div className="space-y-6">

        {/* SECTION 1: PERSONAL INFO & PREFERENCES */}
        <div className="bg-card border border-border/30 rounded-2xl p-4 sm:p-6 space-y-6 shadow-sm">
          {/* User Identity Preview */}
          <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-secondary/30 border border-border/30">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-income/10 border border-income/30 text-income font-black text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-inner">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground truncate">{name || "Unnamed User"}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email || "No email"}</p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <User className="h-4 w-4 text-income" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-muted-foreground" /> Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-secondary/10 border border-border/20 text-muted-foreground text-sm cursor-not-allowed opacity-70 select-none"
                />
              </div>

              {/* Default Currency */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-muted-foreground" /> Default Currency
                </label>
                <Select value={currency} onValueChange={(val) => setCurrency(val)}>
                  <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl data-[size=default]:h-10 sm:data-[size=default]:h-11">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/40 text-foreground">
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SECURITY SETTINGS */}
        <div className="bg-card border border-border/30 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-income" /> Security & Authentication
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/20 border border-border/30">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-income" /> Account Password
              </h4>
              <p className="text-xs text-muted-foreground">
                Update your account password regularly to keep your financial data secure.
              </p>
            </div>

            <Button
              onClick={() => setIsPasswordOpen(true)}
              variant="outline"
              className="w-full sm:w-auto bg-secondary/50 hover:bg-secondary text-foreground border-border/40 font-semibold rounded-xl cursor-pointer shrink-0 transition-all"
            >
              <KeyRound className="h-4 w-4 mr-1.5" />
              <span>Change Password</span>
            </Button>
          </div>
        </div>

        {/* SECTION 3: DANGER ZONE (VISUALLY SEPARATED) */}
        <div className="pt-4 sm:pt-6">
          <div className="bg-destructive/[0.03] border border-destructive/25 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-destructive/[0.06] border border-destructive/15">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">Delete Account</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Permanently delete your account and all associated data including accounts, transactions, budgets, and goals. This action cannot be undone.
                </p>
              </div>

              <Button
                onClick={() => setIsDeleteOpen(true)}
                variant="destructive"
                className="w-full sm:w-auto bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/30 font-semibold rounded-xl cursor-pointer shrink-0 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* CHANGE PASSWORD DIALOG */}
      <Dialog open={isPasswordOpen} onOpenChange={(open) => !open && handleClosePassword()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Change Password</DialogTitle>
            <DialogDescription className="hidden">Update your account password</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password_confirmation: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full h-11 sm:h-12 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-bold shadow-md glow-income disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span>Update Password</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE ACCOUNT DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && handleCloseDelete()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-destructive">Delete Account</DialogTitle>
            <DialogDescription className="hidden">Permanently delete your account</DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive my-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-xs leading-snug">
              This will permanently delete your account, including all accounts, transactions, budgets, and goals. This action cannot be undone.
            </p>
          </div>

          <form onSubmit={handleDeleteSubmit} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
              <input
                type="password"
                value={deleteForm.current_password}
                onChange={(e) => setDeleteForm((prev) => ({ ...prev, current_password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive"
                required
                autoFocus
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={deleteAccountMutation.isPending || !deleteForm.current_password}
                className="w-full h-11 sm:h-12 bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
              >
                {deleteAccountMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span>Permanently Delete Account</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}