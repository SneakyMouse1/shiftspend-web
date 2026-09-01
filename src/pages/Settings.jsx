import { useState } from "react";
import {
  User,
  Save,
  KeyRound,
  Loader2,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  Mail,
  Globe,
  Eye,
  EyeOff,
  Languages,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth, useUpdateProfile, useChangePassword, useDeleteAccount } from "@/hooks/useAuth";
import { usePrivacy } from "@/hooks/usePrivacy";
import { useTranslation } from "@/hooks/useLanguage";
import { CURRENCIES } from "@/config/currencies";
import { LANGUAGES } from "@/locales";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Settings() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { t, language, setLanguage } = useTranslation();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.settings?.currency || "EUR");

  const changePasswordMutation = useChangePassword();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const deleteAccountMutation = useDeleteAccount();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ current_password: "" });

  const { isPrivate, togglePrivacy } = usePrivacy();

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setName(user?.name || "");
    setCurrency(user?.settings?.currency || "EUR");
  }

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
      toast.error(t("settings.newPassword") + " != " + t("settings.confirmNewPassword"));
      return;
    }

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        toast.success(t("settings.passwordChanged"));
        handleClosePassword();
      },
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
    }, {
      onSuccess: () => {
        toast.success(t("settings.profileUpdated"));
      }
    });
  };

  const avatarLetter = (name.trim() || user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("settings.title")}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("settings.subtitle")}
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="w-full sm:w-auto h-11 px-6 bg-income hover:bg-income/90 text-primary-foreground font-bold rounded-xl shadow-md glow-income transition-all duration-300 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          <span>{t("common.saveChanges")}</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: PROFILE INFORMATION */}
        <div className="bg-card border border-border/30 rounded-2xl p-4 sm:p-6 space-y-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <User className="h-4 w-4 text-income" /> {t("settings.personalProfile")}
          </h2>

          {/* USER IDENTITY BANNER */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-income/10 border-2 border-income/30 flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-income shrink-0">
              {avatarLetter}
            </div>

            <div className="text-center sm:text-left space-y-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                {name.trim() || user?.name || "User"}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/50 text-[11px] text-muted-foreground font-mono">
                <span>{t("settings.defaultCurrency")}:</span>
                <span className="font-bold text-foreground">{currency}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3 w-3 text-muted-foreground" /> {t("settings.fullName")}
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
                  <Mail className="h-3 w-3 text-muted-foreground" /> {t("settings.email")}
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
                  <Globe className="h-3 w-3 text-muted-foreground" /> {t("settings.defaultCurrency")}
                </label>
                <Select value={currency} onValueChange={(val) => setCurrency(val)}>
                  <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl data-[size=default]:h-10 sm:data-[size=default]:h-11">
                    <SelectValue placeholder={t("settings.defaultCurrency")}>
                      {CURRENCIES.find((c) => c.code === currency)?.label || currency}
                    </SelectValue>
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

              {/* Display Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Languages className="h-3 w-3 text-muted-foreground" /> {t("settings.displayLanguage")}
                </label>
                <Select value={language} onValueChange={(val) => setLanguage(val)}>
                  <SelectTrigger className="w-full bg-secondary/30 border-border/40 rounded-xl data-[size=default]:h-10 sm:data-[size=default]:h-11">
                    <SelectValue placeholder={t("settings.displayLanguage")}>
                      {(() => {
                        const l = LANGUAGES.find((lang) => lang.code === language);
                        return l ? `${l.flag} ${l.label}` : language;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/40 text-foreground">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRIVACY & DISPLAY */}
        <div className="bg-card border border-border/30 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <Eye className="h-4 w-4 text-income" /> {t("privacy.title")}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/20 border border-border/30">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {isPrivate ? <EyeOff className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                <span>{t("privacy.title")}</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("privacy.description")}
              </p>
            </div>

            <Button
              type="button"
              onClick={togglePrivacy}
              variant="outline"
              className={`w-full sm:w-auto font-semibold rounded-xl cursor-pointer shrink-0 transition-all ${
                isPrivate
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-amber-500/25"
                  : "bg-secondary/50 hover:bg-secondary text-foreground border-border/40"
              }`}
            >
              {isPrivate ? t("privacy.disable") : t("privacy.enable")}
            </Button>
          </div>
        </div>

        {/* SECTION 3: SECURITY SETTINGS */}
        <div className="bg-card border border-border/30 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-income" /> {t("settings.security")}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/20 border border-border/30">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-income" /> {t("settings.accountPassword")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("settings.changePassword")}
              </p>
            </div>

            <Button
              onClick={() => setIsPasswordOpen(true)}
              variant="outline"
              className="w-full sm:w-auto bg-secondary/50 hover:bg-secondary text-foreground border-border/40 font-semibold rounded-xl cursor-pointer shrink-0 transition-all"
            >
              <KeyRound className="h-4 w-4 mr-1.5" />
              <span>{t("settings.changePassword")}</span>
            </Button>
          </div>
        </div>

        {/* SECTION 4: DANGER ZONE (VISUALLY SEPARATED) */}
        <div className="pt-4 sm:pt-6">
          <div className="bg-destructive/[0.03] border border-destructive/25 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider">{t("settings.dangerZone")}</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-destructive/[0.06] border border-destructive/15">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">{t("settings.deleteAccountTitle")}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("settings.deleteAccountDescription")}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                variant="destructive"
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl cursor-pointer shrink-0 shadow-md transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>{t("settings.deleteAccountButton")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD DIALOG */}
      <Dialog open={isPasswordOpen} onOpenChange={(open) => !open && handleClosePassword()}>
        <DialogContent className="modal-theme">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">{t("settings.changePassword")}</DialogTitle>
            <DialogDescription className="hidden">{t("settings.changePassword")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("settings.currentPassword")}</label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("settings.newPassword")}</label>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-foreground text-sm focus:outline-none focus:border-income focus:ring-1 focus:ring-income"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("settings.confirmNewPassword")}</label>
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
                  <span>{t("settings.updatePassword")}</span>
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
            <DialogTitle className="text-xl font-bold tracking-tight text-destructive">{t("settings.deleteAccountConfirmTitle")}</DialogTitle>
            <DialogDescription className="hidden">{t("settings.deleteAccountDescription")}</DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive my-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-xs leading-snug">
              {t("settings.deleteAccountWarning")}
            </p>
          </div>

          <form onSubmit={handleDeleteSubmit} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("settings.currentPassword")}</label>
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
                  <span>{t("settings.deleteAccountButton")}</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}