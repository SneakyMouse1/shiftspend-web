import React, { useState, useEffect, useRef } from "react";
import { User, Save, KeyRound, Loader2, Camera, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth, useUpdateProfile, useChangePassword, useDeleteAccount } from "@/hooks/useAuth";
import { CURRENCIES } from "@/config/currencies";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";


export default function Settings() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.settings?.currency || "EUR");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");
  const changePasswordMutation = useChangePassword();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const deleteAccountMutation = useDeleteAccount();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ current_password: "" });


  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPreviewUrl(user.avatar || "");
      if (user.settings?.currency) {
        setCurrency(user.settings.currency);
      }
    }
  }, [user]);


  // CHANGE AVATAR
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };


  // INITIAL STATE FRO PASSWORD CHANGE IN MODAL
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
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      avatar: avatarFile || undefined,
      settings: { currency },
    });
  };


  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences and personal profile settings.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="w-40 px-5 h-12 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-bold shadow-md glow-income disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </span>
          )}
        </Button>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* AVATAR CARD */}
          <div className="bg-card border border-border/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative group">
              <img
                src={previewUrl || DEFAULT_AVATAR}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-income/40 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-white cursor-pointer"
              >
                <Camera className="h-5 w-5 mb-1" />
                Change
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{name || "No Name"}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="md:col-span-2 bg-card border border-border/20 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
              <User className="h-4 w-4 text-income" /> Personal Info
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Subscriptions, Freelance..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/10 border border-border/20 text-muted-foreground text-sm cursor-not-allowed opacity-70"
              />
            </div>

            {/* Default Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Default Currency
              </label>
              <Select value={currency} onValueChange={(val) => setCurrency(val)}>
                <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl data-[size=default]:h-11">
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

        <div className="grid grid-cols-2 gap-6">

          {/* SECURITY & DATA */}
          <div className="bg-card border border-border/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-income" /> Security Settings
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row items-center justify-between p-3.5 rounded-xl bg-secondary/10 border border-border/10">

              <h4 className="text-sm font-semibold text-primary">Password</h4>

              <Button
                onClick={() => setIsPasswordOpen(true)}
                className="bg-muted text-primary hover:bg-muted/90 font-semibold shadow-md hover-glow-income rounded-xl cursor-pointer"
              >
                <KeyRound className="h-4 w-4 mr-1" />
                <span>Change Password</span>
              </Button>
            </div>
          </div>

          {/* DELETE ACCOUNT */}
          <div className="bg-card border border-destructive/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Danger Zone
            </h2>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-destructive/5 border border-destructive/10">
              <div>
                <h4 className="text-sm font-semibold text-primary">Delete Account</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
              </div>
              <Button
                onClick={() => setIsDeleteOpen(true)}
                className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 font-semibold rounded-xl cursor-pointer shrink-0 ml-4"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>

        </div>

      </div>


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
                className="w-full h-12 bg-income hover:bg-income/90 text-primary-foreground rounded-xl font-bold shadow-md glow-income disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
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
                disabled={deleteAccountMutation.isPending || !deleteForm.current_password }
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
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