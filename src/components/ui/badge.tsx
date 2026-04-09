import * as React from "react"
import { clsx } from "clsx"

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "orange"
  | "purple"
  | "cyan"
  | "dark"
  | "outline"

export type BadgeSize = "sm" | "md" | "lg"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  icon?: React.ReactNode
  pill?: boolean
  glow?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: [
    "bg-white/10 text-white/80",
    "border border-white/15",
  ].join(" "),

  success: [
    "bg-emerald-500/15 text-emerald-400",
    "border border-emerald-500/25",
  ].join(" "),

  warning: [
    "bg-amber-500/15 text-amber-400",
    "border border-amber-500/25",
  ].join(" "),

  error: [
    "bg-red-500/15 text-red-400",
    "border border-red-500/25",
  ].join(" "),

  info: [
    "bg-blue-500/15 text-blue-400",
    "border border-blue-500/25",
  ].join(" "),

  orange: [
    "bg-orange-500/15 text-orange-400",
    "border border-orange-500/25",
  ].join(" "),

  purple: [
    "bg-purple-500/15 text-purple-400",
    "border border-purple-500/25",
  ].join(" "),

  cyan: [
    "bg-cyan-500/15 text-cyan-400",
    "border border-cyan-500/25",
  ].join(" "),

  dark: [
    "bg-white/5 text-white/60",
    "border border-white/8",
  ].join(" "),

  outline: [
    "bg-transparent text-white/70",
    "border border-white/20",
  ].join(" "),
}

const lightVariantStyles: Record<BadgeVariant, string> = {
  default: [
    "bg-slate-100 text-slate-600",
    "border border-slate-200",
  ].join(" "),

  success: [
    "bg-emerald-50 text-emerald-700",
    "border border-emerald-200",
  ].join(" "),

  warning: [
    "bg-amber-50 text-amber-700",
    "border border-amber-200",
  ].join(" "),

  error: [
    "bg-red-50 text-red-600",
    "border border-red-200",
  ].join(" "),

  info: [
    "bg-blue-50 text-blue-700",
    "border border-blue-200",
  ].join(" "),

  orange: [
    "bg-orange-50 text-orange-700",
    "border border-orange-200",
  ].join(" "),

  purple: [
    "bg-purple-50 text-purple-700",
    "border border-purple-200",
  ].join(" "),

  cyan: [
    "bg-cyan-50 text-cyan-700",
    "border border-cyan-200",
  ].join(" "),

  dark: [
    "bg-slate-800 text-slate-200",
    "border border-slate-700",
  ].join(" "),

  outline: [
    "bg-transparent text-slate-600",
    "border border-slate-300",
  ].join(" "),
}

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-white/60",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
  info: "bg-blue-400",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  cyan: "bg-cyan-400",
  dark: "bg-white/40",
  outline: "bg-white/40",
}

const lightDotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  dark: "bg-slate-400",
  outline: "bg-slate-400",
}

const glowStyles: Record<BadgeVariant, string> = {
  default: "shadow-[0_0_12px_rgba(255,255,255,0.1)]",
  success: "shadow-[0_0_12px_rgba(16,185,129,0.3)]",
  warning: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
  error: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
  info: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
  orange: "shadow-[0_0_12px_rgba(249,115,22,0.3)]",
  purple: "shadow-[0_0_12px_rgba(168,85,247,0.3)]",
  cyan: "shadow-[0_0_12px_rgba(6,182,212,0.3)]",
  dark: "shadow-[0_0_8px_rgba(255,255,255,0.05)]",
  outline: "shadow-none",
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps & { light?: boolean }>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      icon,
      pill = true,
      glow = false,
      light = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const styles = light ? lightVariantStyles : variantStyles
    const dotStyle = light ? lightDotColors : dotColors

    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-semibold",
          "transition-all duration-200 whitespace-nowrap",
          pill ? "rounded-full" : "rounded-lg",
          styles[variant],
          sizeStyles[size],
          glow ? glowStyles[variant] : "",
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={clsx(
              "rounded-full shrink-0",
              size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2",
              dotStyle[variant]
            )}
          />
        )}
        {icon && !dot && (
          <span className="shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"

const PlanBadge = ({ plan }: { plan: string }) => {
  const planMap: Record<string, { variant: BadgeVariant; label: string }> = {
    free: { variant: "default", label: "Free" },
    starter: { variant: "info", label: "Starter" },
    pro: { variant: "cyan", label: "Pro" },
    business: { variant: "orange", label: "Business" },
    agency: { variant: "purple", label: "Agency" },
  }

  const config = planMap[plan?.toLowerCase()] || planMap["free"]

  return (
    <Badge variant={config.variant} size="sm" dot glow>
      {config.label}
    </Badge>
  )
}

PlanBadge.displayName = "PlanBadge"

const StatusBadge = ({
  status,
}: {
  status: "active" | "inactive" | "pending" | "failed" | "completed" | "running"
}) => {
  const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "default", label: "Inactive" },
    pending: { variant: "warning", label: "Pending" },
    failed: { variant: "error", label: "Failed" },
    completed: { variant: "success", label: "Completed" },
    running: { variant: "info", label: "Running" },
  }

  const config = statusMap[status] || statusMap["inactive"]

  return (
    <Badge variant={config.variant} size="sm" dot>
      {config.label}
    </Badge>
  )
}

StatusBadge.displayName = "StatusBadge"

const ScoreBadge = ({ score }: { score: number }) => {
  let variant: BadgeVariant = "error"
  let label = "Poor"

  if (score >= 90) {
    variant = "success"
    label = "Excellent"
  } else if (score >= 70) {
    variant = "info"
    label = "Good"
  } else if (score >= 50) {
    variant = "warning"
    label = "Fair"
  }

  return (
    <Badge variant={variant} size="md" glow>
      {score}/100 {label}
    </Badge>
  )
}

ScoreBadge.displayName = "ScoreBadge"

const NewBadge = () => (
  <Badge
    variant="orange"
    size="sm"
    glow
    className="animate-pulse"
  >
    NEW
  </Badge>
)

NewBadge.displayName = "NewBadge"

const PopularBadge = () => (
  <Badge
    variant="orange"
    size="md"
    glow
    className="shadow-[0_0_20px_rgba(249,115,22,0.4)]"
  >
    Most Popular
  </Badge>
)

PopularBadge.displayName = "PopularBadge"

const BetaBadge = () => (
  <Badge variant="purple" size="sm">
    Beta
  </Badge>
)

BetaBadge.displayName = "BetaBadge"

export {
  Badge,
  PlanBadge,
  StatusBadge,
  ScoreBadge,
  NewBadge,
  PopularBadge,
  BetaBadge,
}

export default Badge
