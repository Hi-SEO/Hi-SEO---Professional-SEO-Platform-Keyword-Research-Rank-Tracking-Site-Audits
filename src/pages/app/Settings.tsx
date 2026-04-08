import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { supabase } from "../../lib/supabase"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"
import {
  User,
  Building2,
  Mail,
  Lock,
  Shield,
  Bell,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Settings as SettingsIcon,
  Crown,
  SlidersHorizontal,
  Loader2,
} from "lucide-react"

type Tab = "profile" | "security" | "notifications" | "danger"

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth()

  const [activeTab, setActiveTab] = useState<Tab>("profile")

  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reportAlerts, setReportAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [notifMessage, setNotifMessage] = useState("")

  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    setFullName(profile?.full_name || "")
    setCompanyName(profile?.company_name || "")
  }, [profile])

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "security" as Tab, label: "Security", icon: Shield },
    { id: "notifications" as Tab, label: "Notifications", icon: Bell },
    { id: "danger" as Tab, label: "Danger Zone", icon: Trash2 },
  ]

  const initials = (profile?.full_name || user?.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setProfileLoading(true)
    setProfileMessage("")
    setProfileError("")

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company_name: companyName,
      })
      .eq("id", user.id)

    if (error) {
      setProfileError(error.message)
      setProfileLoading(false)
      return
    }

    await refreshProfile()
    setProfileMessage("Profile updated successfully.")
    setProfileLoading(false)
    setTimeout(() => setProfileMessage(""), 3000)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage("")
    setPasswordError("")

    if (!newPassword.trim()) {
      setPasswordError("New password is required.")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }

    setPasswordLoading(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
      setPasswordLoading(false)
      return
    }

    setPasswordMessage("Password updated successfully.")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordLoading(false)
    setTimeout(() => setPasswordMessage(""), 3000)
  }

  const handleSaveNotifications = () => {
    setNotifMessage("Notification preferences saved.")
    setTimeout(() => setNotifMessage(""), 3000)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) {
      setDeleteError("Email does not match. Please type your email to confirm.")
      return
    }

    setDeleteLoading(true)
    setDeleteError("")

    const { error } = await supabase
      .from("profiles")
      .update({ plan: "free" })
      .eq("id", user!.id)

    if (error) {
      setDeleteError(error.message)
      setDeleteLoading(false)
      return
    }

    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Premium account settings
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Settings</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage your profile, security, notifications, and account preferences in one clean place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground">Current plan</p>
            <div className="mt-1 flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold capitalize">{profile?.plan || "free"} plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <Card className="overflow-hidden border-border/60 bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xl font-black text-white shadow-md">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold">{profile?.full_name || "No name set"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {profile?.company_name && (
                <p className="mt-1 text-sm text-muted-foreground">{profile.company_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Profile", value: profile?.full_name ? "Complete" : "Pending" },
              { label: "Plan", value: profile?.plan || "free" },
              { label: "Security", value: "Protected" },
              { label: "Status", value: "Active" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border bg-background/70 px-4 py-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-semibold capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                "flex items-center gap-2 rounded-t-xl border-x border-t px-4 py-3 text-sm font-medium transition-colors " +
                (active
                  ? "border-border bg-card text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="h-12 pl-10 text-muted-foreground"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Profile status</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Keep your profile updated so your workspace feels more personal and organized.
              </p>
            </div>

            {profileError && <p className="text-sm text-red-500">{profileError}</p>}
            {profileMessage && <p className="text-sm text-emerald-600">{profileMessage}</p>}

            <Button type="submit" disabled={profileLoading} variant="premium" className="h-11 px-6">
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="text-sm font-medium">Password tips</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use at least 6 characters and choose something unique that you do not reuse elsewhere.
              </p>
            </div>

            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            {passwordMessage && <p className="text-sm text-emerald-600">{passwordMessage}</p>}

            <Button type="submit" disabled={passwordLoading} variant="premium" className="h-11 px-6">
              {passwordLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card className="space-y-6 border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose what kind of updates you want to see.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Email Notifications",
                description: "Receive important updates via email.",
                value: emailNotifications,
                onChange: setEmailNotifications,
              },
              {
                label: "Report Alerts",
                description: "Get notified when reports are ready.",
                value: reportAlerts,
                onChange: setReportAlerts,
              },
              {
                label: "Weekly Digest",
                description: "Receive a weekly SEO summary email.",
                value: weeklyDigest,
                onChange: setWeeklyDigest,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border bg-muted/10 p-4">
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => item.onChange(!item.value)}
                  className={
                    "relative h-6 w-11 rounded-full transition-colors " +
                    (item.value ? "bg-primary" : "bg-gray-300")
                  }
                >
                  <span
                    className={
                      "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 " +
                      (item.value ? "translate-x-5" : "translate-x-0")
                    }
                  />
                </button>
              </div>
            ))}
          </div>

          {notifMessage && <p className="text-sm text-emerald-600">{notifMessage}</p>}

          <Button onClick={handleSaveNotifications} variant="premium" className="h-11 px-6">
            Save Preferences
          </Button>
        </Card>
      )}

      {/* Danger */}
      {activeTab === "danger" && (
        <Card className="space-y-6 border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h2>

          <div className="rounded-2xl border border-red-200 bg-white p-5">
            <p className="font-semibold text-red-700">Deactivate account access</p>
            <p className="mt-1 text-sm text-red-600">
              This action signs you out and resets your plan to free. If you want full deletion, you should request support.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-red-700">
                Type your email to confirm: <span className="font-bold">{user?.email}</span>
              </label>
              <Input
                type="email"
                placeholder="Enter your email to confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="h-12 border-red-300 bg-white"
              />
            </div>

            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading || deleteConfirm !== user?.email}
              className="mt-5 h-11"
            >
              {deleteLoading ? "Processing..." : "Deactivate My Account"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
