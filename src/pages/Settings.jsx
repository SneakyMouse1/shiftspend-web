import React, { useState, useEffect, useRef } from "react";
import { User, Save, Check, KeyRound, Loader2, Camera } from "lucide-react";

import { useAuth, useUpdateProfile } from "@/hooks/useAuth";
import { CURRENCIES } from "@/config/currencies";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";


export default function Settings() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.settings?.currency || "EUR");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name.trim());

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    formData.append("settings[currency]", currency);

    updateProfile(formData);
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

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-income hover:bg-income/90 text-primary-foreground font-semibold text-sm transition-all duration-300 shadow-md glow-income cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isPending ? "Saving..." : isSuccess ? "Saved!" : "Save Changes"}</span>
        </button>
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

        {/* SECURITY & DATA */}
        <div className="bg-card border border-border/20 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-income" /> Security Settings
          </h2>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/10 border border-border/10">
            <div>
              <h4 className="text-sm font-semibold text-primary">Password</h4>
              <p className="text-xs text-muted-foreground">Last updated 3 months ago</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-xs font-semibold cursor-pointer transition-colors">
              Change Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}