import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  User, Shield, Bell, AlertTriangle, Save, RefreshCw,
  Eye, EyeOff, CheckCircle2, AlertCircle, X, Lock,
  Mail, Building2, Camera, Trash2, LogOut, Key,
  Toggle3dOff, ChevronRight, Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tab = "profile" | "security" | "notifications" | "danger";

interface ProfileForm {
  full_name: string;
  company_name: string;
  email: string;
  avatar_url: string;
}

interface SecurityForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface NotificationSettings {
  email_reports: boolean;
  email_alerts: boolean;
  rank_changes: boolean;
  audit_complete: boolean;
  weekly_digest: boolean;
  product_updates: boolean;
  billing_alerts: boolean;
  security_alerts: boolean;
}

interface State {
  activeTab: Tab;
  profile: ProfileForm;
  profileLoading: boolean;
  profileSaving: boolean;
  profileSuccess: boolean;
  profileError: string | null;
  security: SecurityForm;
  securitySaving: boolean;
  securitySuccess: boolean;
  securityError: string | null;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  notifications: NotificationSettings;
  notifLoading: boolean;
  notifSaving: boolean;
  notifSuccess: boolean;
  notifError: string | null;
  dangerEmail: string;
  dangerConfirm: string;
  dangerDeleting: boolean;
  dangerError: string | null;
  dangerSuccess: boolean;
}

type Action =
  | { type: "SET_TAB"; payload: Tab }
  | { type: "SET_PROFILE"; payload: Partial<ProfileForm> }
  | { type: "SET_PROFILE_LOADING"; payload: boolean }
  | { type: "SET_PROFILE_SAVING"; payload: boolean }
  | { type: "SET_PROFILE_SUCCESS"; payload: boolean }
  | { type: "SET_PROFILE_ERROR"; payload: string | null }
  | { type: "SET_SECURITY"; payload: Partial<SecurityForm> }
  | { type: "SET_SECURITY_SAVING"; payload: boolean }
  | { type: "SET_SECURITY_SUCCESS"; payload: boolean }
  | { type: "SET_SECURITY_ERROR"; payload: string | null }
  | { type: "TOGGLE_SHOW_CURRENT" }
  | { type: "TOGGLE_SHOW_NEW" }
  | { type: "TOGGLE_SHOW_CONFIRM" }
  | { type: "SET_NOTIF"; payload: Partial<NotificationSettings> }
  | { type: "SET_NOTIF_LOADING"; payload: boolean }
  | { type: "SET_NOTIF_SAVING"; payload: boolean }
  | { type: "SET_NOTIF_SUCCESS"; payload: boolean }
  | { type: "SET_NOTIF_ERROR"; payload: string | null }
  | { type: "SET_DANGER_EMAIL"; payload: string }
  | { type: "SET_DANGER_CONFIRM"; payload: string }
  | { type: "SET_DANGER_DELETING"; payload: boolean }
  | { type: "SET_DANGER_ERROR"; payload: string | null }
  | { type: "SET_DANGER_SUCCESS"; payload: boolean };

const defaultNotifs: NotificationSettings = {
  email_reports: true,
  email_alerts: true,
  rank_changes: true,
  audit_complete: true,
  weekly_digest: false,
  product_updates: false,
  billing_alerts: true,
  security_alerts: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "SET_PROFILE": return { ...state, profile: { ...state.profile, ...action.payload } };
    case "SET_PROFILE_LOADING": return { ...state, profileLoading: action.payload };
    case "SET_PROFILE_SAVING": return { ...state, profileSaving: action.payload };
    case "SET_PROFILE_SUCCESS": return { ...state, profileSuccess: action.payload };
    case "SET_PROFILE_ERROR": return { ...state, profileError: action.payload };
    case "SET_SECURITY": return { ...state, security: { ...state.security, ...action.payload } };
    case "SET_SECURITY_SAVING": return { ...state, securitySaving: action.payload };
    case "SET_SECURITY_SUCCESS": return { ...state, securitySuccess: action.payload };
    case "SET_SECURITY_ERROR": return { ...state, securityError: action.payload };
    case "TOGGLE_SHOW_CURRENT": return { ...state, showCurrent: !state.showCurrent };
    case "TOGGLE_SHOW_NEW": return { ...state, showNew: !state.showNew };
    case "TOGGLE_SHOW_CONFIRM": return { ...state, showConfirm: !state.showConfirm };
    case "SET_NOTIF": return { ...state, notifications: { ...state.notifications, ...action.payload } };
    case "SET_NOTIF_LOADING": return { ...state, notifLoading: action.payload };
    case "SET_NOTIF_SAVING": return { ...state, notifSaving: action.payload };
    case "SET_NOTIF_SUCCESS": return { ...state, notifSuccess: action.payload };
    case "SET_NOTIF_ERROR": return { ...state, notifError: action.payload };
    case "SET_DANGER_EMAIL": return { ...state, dangerEmail: action.payload };
    case "SET_DANGER_CONFIRM": return { ...state, dangerConfirm: action.payload };
    case "SET_DANGER_DELETING": return { ...state, dangerDeleting: action.payload };
    case "SET_DANGER_ERROR": return { ...state, dangerError: action.payload };
    case "SET_DANGER_SUCCESS": return { ...state, dangerSuccess: action.payload };
    default: return state;
  }
}

const initialState: State = {
  activeTab: "profile",
  profile: { full_name: "", company_name: "", email: "", avatar_url: "" },
  profileLoading: true,
  profileSaving: false,
  profileSuccess: false,
  profileError: null,
  security: { current_password: "", new_password: "", confirm_password: "" },
  securitySaving: false,
  securitySuccess: false,
  securityError: null,
  showCurrent: false,
  showNew: false,
  showConfirm: false,
  notifications: defaultNotifs,
  notifLoading: true,
  notifSaving: false,
  notifSuccess: false,
  notifError: null,
  dangerEmail: "",
  dangerConfirm: "",
  dangerDeleting: false,
  dangerError: null,
  dangerSuccess: false,
};

function PasswordInput({ value, show, onToggle, onChange, placeholder, label }: {
  value: string; show: boolean; onToggle: () => void;
  onChange: (v: string) => void; placeholder: string; label: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-12 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-white transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? "bg-blue-600" : "bg-white/10"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ left: checked ? "calc(100% - 1.375rem)" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
  const labels = ["", "Weak", "Weak", "Fair", "Strong", "Very Strong"];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(c => (
            <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-emerald-400" : "text-blue-200/30"}`}>
              <CheckCircle2 className="w-3 h-3" />{c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-bold ${colors[score].replace("bg-", "text-")}`}>{labels[score]}</span>
      </div>
    </div>
  );
}

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function Settings() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user || !profile) return;
    dispatch({ type: "SET_PROFILE", payload: {
      full_name: profile.full_name ?? "",
      company_name: profile.company_name ?? "",
      email: profile.email ?? user.email ?? "",
      avatar_url: profile.avatar_url ?? "",
    }});
    dispatch({ type: "SET_PROFILE_LOADING", payload: false });
    loadNotifications();
  }, [user, profile]);

  async function loadNotifications() {
    dispatch({ type: "SET_NOTIF_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("notification_settings")
        .eq("id", user!.id)
        .single();
      if (!error && data?.notification_settings) {
        dispatch({ type: "SET_NOTIF", payload: { ...defaultNotifs, ...data.notification_settings } });
      }
    } catch { /* use defaults */ }
    finally { dispatch({ type: "SET_NOTIF_LOADING", payload: false }); }
  }

  async function handleSaveProfile() {
    dispatch({ type: "SET_PROFILE_SAVING", payload: true });
    dispatch({ type: "SET_PROFILE_ERROR", payload: null });
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: state.profile.full_name.trim(),
        company_name: state.profile.company_name.trim(),
        avatar_url: state.profile.avatar_url.trim(),
      }).eq("id", user!.id);
      if (error) throw error;
      await refreshProfile();
      dispatch({ type: "SET_PROFILE_SUCCESS", payload: true });
      setTimeout(() => dispatch({ type: "SET_PROFILE_SUCCESS", payload: false }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_PROFILE_ERROR", payload: err.message ?? "Failed to save profile." });
    } finally {
      dispatch({ type: "SET_PROFILE_SAVING", payload: false });
    }
  }

  async function handleChangePassword() {
    dispatch({ type: "SET_SECURITY_ERROR", payload: null });
    if (!state.security.current_password) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: "Please enter your current password." }); return;
    }
    if (state.security.new_password.length < 8) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: "New password must be at least 8 characters." }); return;
    }
    if (state.security.new_password !== state.security.confirm_password) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: "New passwords do not match." }); return;
    }
    dispatch({ type: "SET_SECURITY_SAVING", payload: true });
    try {
      const { error } = await supabase.auth.updateUser({ password: state.security.new_password });
      if (error) throw error;
      dispatch({ type: "SET_SECURITY_SUCCESS", payload: true });
      dispatch({ type: "SET_SECURITY", payload: { current_password: "", new_password: "", confirm_password: "" } });
      setTimeout(() => dispatch({ type: "SET_SECURITY_SUCCESS", payload: false }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: err.message ?? "Failed to update password." });
    } finally {
      dispatch({ type: "SET_SECURITY_SAVING", payload: false });
    }
  }

  async function handleSaveNotifications() {
    dispatch({ type: "SET_NOTIF_SAVING", payload: true });
    dispatch({ type: "SET_NOTIF_ERROR", payload: null });
    try {
      const { error } = await supabase.from("profiles").update({
        notification_settings: state.notifications,
      }).eq("id", user!.id);
      if (error) throw error;
      dispatch({ type: "SET_NOTIF_SUCCESS", payload: true });
      setTimeout(() => dispatch({ type: "SET_NOTIF_SUCCESS", payload: false }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_NOTIF_ERROR", payload: err.message ?? "Failed to save notification settings." });
    } finally {
      dispatch({ type: "SET_NOTIF_SAVING", payload: false });
    }
  }

  async function handleDeactivate() {
    dispatch({ type: "SET_DANGER_ERROR", payload: null });
    if (state.dangerEmail !== (user?.email ?? "")) {
      dispatch({ type: "SET_DANGER_ERROR", payload: "Email address does not match your account email." }); return;
    }
    if (state.dangerConfirm !== "DELETE MY ACCOUNT") {
      dispatch({ type: "SET_DANGER_ERROR", payload: 'Please type DELETE MY ACCOUNT exactly to confirm.' }); return;
    }
    dispatch({ type: "SET_DANGER_DELETING", payload: true });
    try {
      const { error } = await supabase.from("profiles").update({
        plan: "deactivated",
        full_name: "[Deactivated Account]",
        company_name: null,
      }).eq("id", user!.id);
      if (error) throw error;
      dispatch({ type: "SET_DANGER_SUCCESS", payload: true });
      setTimeout(async () => {
        await signOut();
        navigate("/");
      }, 2000);
    } catch (err: any) {
      dispatch({ type: "SET_DANGER_ERROR", payload: err.message ?? "Failed to deactivate account." });
    } finally {
      dispatch({ type: "SET_DANGER_DELETING", payload: false });
    }
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const notifGroups = [
    {
      label: "Email Notifications",
      items: [
        { key: "email_reports" as keyof NotificationSettings, label: "Report Emails", desc: "Receive completed audit and analysis reports via email" },
        { key: "email_alerts" as keyof NotificationSettings, label: "Email Alerts", desc: "Important account and system alerts sent to your email" },
        { key: "weekly_digest" as keyof NotificationSettings, label: "Weekly Digest", desc: "A weekly summary of your SEO performance and rankings" },
        { key: "product_updates" as keyof NotificationSettings, label: "Product Updates", desc: "New features, improvements, and platform announcements" },
      ],
    },
    {
      label: "Activity Notifications",
      items: [
        { key: "rank_changes" as keyof NotificationSettings, label: "Rank Changes", desc: "Alerts when your tracked keywords move up or down in position" },
        { key: "audit_complete" as keyof NotificationSettings, label: "Audit Complete", desc: "Notification when a site audit finishes processing" },
        { key: "billing_alerts" as keyof NotificationSettings, label: "Billing Alerts", desc: "Payment confirmations, receipts, and subscription changes" },
        { key: "security_alerts" as keyof NotificationSettings, label: "Security Alerts", desc: "Unusual login activity, password changes, and security events" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-blue-200/70 text-sm mt-1">Manage your profile, security, notifications, and account preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <motion.div {...fadeUp} className="lg:w-56 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            {TABS.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => dispatch({ type: "SET_TAB", payload: tab.key })}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left border-b border-white/5 last:border-0 ${
                  state.activeTab === tab.key
                    ? tab.key === "danger"
                      ? "bg-red-500/10 text-red-400 border-l-2 border-red-500"
                      : "bg-blue-600/20 text-white border-l-2 border-blue-500"
                    : "text-blue-200/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className={`w-4 h-4 flex-shrink-0 ${state.activeTab === tab.key ? (tab.key === "danger" ? "text-red-400" : "text-blue-400") : ""}`} />
                {tab.label}
                {state.activeTab === tab.key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </div>

          {/* Profile Summary */}
          {profile && (
            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-3 text-white font-black text-xl">
                {(profile.full_name ?? profile.email ?? "U").charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-bold text-white truncate">{profile.full_name || "No name set"}</p>
              <p className="text-xs text-blue-200/40 truncate mt-0.5">{profile.email}</p>
              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border mt-2 ${
                profile.plan === "pro" ? "text-blue-400 bg-blue-500/15 border-blue-500/25"
                  : profile.plan === "business" ? "text-purple-400 bg-purple-500/15 border-purple-500/25"
                  : profile.plan === "agency" ? "text-amber-400 bg-amber-500/15 border-amber-500/25"
                  : "text-slate-400 bg-slate-500/15 border-slate-500/25"
              }`}>
                {(profile.plan ?? "starter").charAt(0).toUpperCase() + (profile.plan ?? "starter").slice(1)} Plan
              </span>
            </div>
          )}
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* PROFILE TAB */}
            {state.activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="space-y-5">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />Profile Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={state.profile.full_name}
                          onChange={e => dispatch({ type: "SET_PROFILE", payload: { full_name: e.target.value } })}
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                        <input
                          type="text"
                          placeholder="Your company or agency name"
                          value={state.profile.company_name}
                          onChange={e => dispatch({ type: "SET_PROFILE", payload: { company_name: e.target.value } })}
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                        <input
                          type="email"
                          value={state.profile.email}
                          disabled
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/3 border border-white/5 text-blue-200/40 text-sm cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-blue-200/30 mt-1.5 flex items-center gap-1">
                        <Info className="w-3 h-3" />Email cannot be changed here. Contact support to update your email.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">Avatar URL <span className="text-blue-200/30 normal-case font-normal">(optional)</span></label>
                      <div className="relative">
                        <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                        <input
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          value={state.profile.avatar_url}
                          onChange={e => dispatch({ type: "SET_PROFILE", payload: { avatar_url: e.target.value } })}
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {state.profileError && (
                    <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{state.profileError}
                    </div>
                  )}
                  {state.profileSuccess && (
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Profile saved successfully.
                    </div>
                  )}

                  <div className="mt-5 flex gap-3">
                    <button onClick={handleSaveProfile} disabled={state.profileSaving}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                        state.profileSuccess ? "bg-emerald-600 text-white shadow-emerald-600/30" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                      }`}>
                      {state.profileSaving ? <><RefreshCw className="w-4 h-4 animate-spin" />Saving...</>
                        : state.profileSuccess ? <><CheckCircle2 className="w-4 h-4" />Saved!</>
                        : <><Save className="w-4 h-4" />Save Profile</>}
                    </button>
                  </div>
                </div>

                {/* Plan Info */}
                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">Current Plan</p>
                      <p className="text-xs text-blue-200/50 mt-0.5">You are on the <span className="text-white font-bold capitalize">{profile?.plan ?? "Starter"}</span> plan</p>
                    </div>
                    <a href="/pricing"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105 whitespace-nowrap">
                      Upgrade Plan
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {state.activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="space-y-5">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-400" />Change Password
                  </h2>
                  <div className="space-y-4">
                    <PasswordInput
                      label="Current Password"
                      placeholder="Enter your current password"
                      value={state.security.current_password}
                      show={state.showCurrent}
                      onToggle={() => dispatch({ type: "TOGGLE_SHOW_CURRENT" })}
                      onChange={v => dispatch({ type: "SET_SECURITY", payload: { current_password: v } })}
                    />
                    <div>
                      <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        value={state.security.new_password}
                        show={state.showNew}
                        onToggle={() => dispatch({ type: "TOGGLE_SHOW_NEW" })}
                        onChange={v => dispatch({ type: "SET_SECURITY", payload: { new_password: v } })}
                      />
                      <PasswordStrength password={state.security.new_password} />
                    </div>
                    <PasswordInput
                      label="Confirm New Password"
                      placeholder="Repeat your new password"
                      value={state.security.confirm_password}
                      show={state.showConfirm}
                      onToggle={() => dispatch({ type: "TOGGLE_SHOW_CONFIRM" })}
                      onChange={v => dispatch({ type: "SET_SECURITY", payload: { confirm_password: v } })}
                    />
                    {state.security.confirm_password && state.security.new_password !== state.security.confirm_password && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />Passwords do not match
                      </p>
                    )}
                  </div>

                  {state.securityError && (
                    <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{state.securityError}
                    </div>
                  )}
                  {state.securitySuccess && (
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Password updated successfully. You may need to log in again.
                    </div>
                  )}

                  <div className="mt-5">
                    <button onClick={handleChangePassword} disabled={state.securitySaving}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                        state.securitySuccess ? "bg-emerald-600 text-white shadow-emerald-600/30" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                      }`}>
                      {state.securitySaving ? <><RefreshCw className="w-4 h-4 animate-spin" />Updating...</>
                        : state.securitySuccess ? <><CheckCircle2 className="w-4 h-4" />Updated!</>
                        : <><Shield className="w-4 h-4" />Update Password</>}
                    </button>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />Account Security
                  </h3>
                  {[
                    { label: "Email verified", value: user?.email_confirmed_at ? "Verified" : "Not verified", ok: !!user?.email_confirmed_at },
                    { label: "Last sign in", value: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "N/A", ok: true },
                    { label: "Authentication method", value: "Email and Password", ok: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-xs text-blue-200/50">{item.label}</span>
                      <span className={`text-xs font-bold flex items-center gap-1 ${item.ok ? "text-emerald-400" : "text-amber-400"}`}>
                        {item.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {state.activeTab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="space-y-5">
                {notifGroups.map(group => (
                  <div key={group.label} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="px-5 py-4 border-b border-white/5 bg-white/3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-400" />{group.label}
                      </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {group.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{item.label}</p>
                            <p className="text-xs text-blue-200/40 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                          <Toggle
                            checked={state.notifications[item.key]}
                            onChange={v => dispatch({ type: "SET_NOTIF", payload: { [item.key]: v } })}
                            disabled={state.notifLoading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {state.notifError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{state.notifError}
                  </div>
                )}
                {state.notifSuccess && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Notification preferences saved successfully.
                  </div>
                )}

                <button onClick={handleSaveNotifications} disabled={state.notifSaving || state.notifLoading}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                    state.notifSuccess ? "bg-emerald-600 text-white shadow-emerald-600/30" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                  }`}>
                  {state.notifSaving ? <><RefreshCw className="w-4 h-4 animate-spin" />Saving...</>
                    : state.notifSuccess ? <><CheckCircle2 className="w-4 h-4" />Saved!</>
                    : <><Save className="w-4 h-4" />Save Preferences</>}
                </button>
              </motion.div>
            )}

            {/* DANGER ZONE TAB */}
            {state.activeTab === "danger" && (
              <motion.div key="danger" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="space-y-5">
                {/* Sign Out */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-amber-400" />Sign Out
                      </h3>
                      <p className="text-xs text-blue-200/40 mt-1">Sign out of your account on this device. Your data will remain safe.</p>
                    </div>
                    <button onClick={signOut}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-bold transition-all whitespace-nowrap">
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Deactivate Account */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-red-400">Deactivate Account</h3>
                      <p className="text-xs text-blue-200/50 mt-1 leading-relaxed">
                        Deactivating your account will immediately revoke access to all Hi-SEO features and cancel your subscription. Your data will be retained for 30 days before permanent deletion.
                      </p>
                    </div>
                  </div>

                  {state.dangerSuccess ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Account deactivated. Signing you out...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <p className="text-xs text-red-300 font-semibold mb-2">This action will:</p>
                        <ul className="space-y-1">
                          {["Immediately revoke access to your dashboard", "Cancel your active subscription", "Remove your projects and reports after 30 days", "Sign you out of all devices"].map(item => (
                            <li key={item} className="text-xs text-red-300/70 flex items-center gap-2">
                              <X className="w-3 h-3 text-red-400 flex-shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-red-400/70 mb-1.5 uppercase tracking-wider">Confirm your email address</label>
                        <input
                          type="email"
                          placeholder={user?.email ?? "your@email.com"}
                          value={state.dangerEmail}
                          onChange={e => dispatch({ type: "SET_DANGER_EMAIL", payload: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl bg-red-500/5 border border-red-500/20 text-white placeholder-red-300/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-red-400/70 mb-1.5 uppercase tracking-wider">
                          Type <span className="font-black text-red-400">DELETE MY ACCOUNT</span> to confirm
                        </label>
                        <input
                          type="text"
                          placeholder="DELETE MY ACCOUNT"
                          value={state.dangerConfirm}
                          onChange={e => dispatch({ type: "SET_DANGER_CONFIRM", payload: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl bg-red-500/5 border border-red-500/20 text-white placeholder-red-300/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all font-mono"
                        />
                      </div>

                      {state.dangerError && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />{state.dangerError}
                        </div>
                      )}

                      <button
                        onClick={handleDeactivate}
                        disabled={state.dangerDeleting || state.dangerEmail !== (user?.email ?? "") || state.dangerConfirm !== "DELETE MY ACCOUNT"}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                      >
                        {state.dangerDeleting
                          ? <><RefreshCw className="w-4 h-4 animate-spin" />Deactivating...</>
                          : <><Trash2 className="w-4 h-4" />Deactivate My Account</>}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
