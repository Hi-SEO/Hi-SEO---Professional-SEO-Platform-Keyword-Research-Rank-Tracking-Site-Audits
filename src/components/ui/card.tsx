import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { clsx } from "clsx"

export type CardVariant =
  | "default"
  | "glass"
  | "glass-strong"
  | "hover"
  | "glow"
  | "premium"
  | "flat"
  | "dark"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  topAccent?: boolean
  topAccentColor?: "blue" | "orange" | "cyan" | "green" | "purple"
  animate?: boolean
  hoverLift?: boolean
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  asMotion?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: "sm" | "md" | "lg"
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean
}

const variantStyles: Record<CardVariant, string> = {
  default: [
    "bg-white border border-slate-200",
    "shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
  ].join(" "),

  glass: [
    "bg-white/5 backdrop-blur-xl",
    "border border-white/10",
    "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
  ].join(" "),

  "glass-strong": [
    "bg-white/10 backdrop-blur-2xl",
    "border border-white/18",
    "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
  ].join(" "),

  hover: [
    "bg-white border border-slate-200",
    "shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
    "cursor-pointer group",
    "hover:border-blue-200 hover:shadow-[0_16px_48px_rgba(59,130,246,0.15)]",
    "transition-all duration-300",
  ].join(" "),

  glow: [
    "bg-white/5 backdrop-blur-xl",
    "border border-blue-500/30",
    "shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(59,130,246,0.15),0_0_30px_rgba(59,130,246,0.12)]",
  ].join(" "),

  premium: [
    "bg-white/5 backdrop-blur-xl",
    "shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
  ].join(" "),

  flat: [
    "bg-white/4 border border-white/8",
  ].join(" "),

  dark: [
    "bg-[#0b1729] border border-white/8",
    "shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
  ].join(" "),
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
}

const accentColors = {
  blue: "before:bg-gradient-to-r before:from-blue-500 before:to-cyan-400",
  orange: "before:bg-gradient-to-r before:from-orange-500 before:to-amber-400",
  cyan: "before:bg-gradient-to-r before:from-cyan-500 before:to-blue-400",
  green: "before:bg-gradient-to-r before:from-emerald-500 before:to-teal-400",
  purple: "before:bg-gradient-to-r before:from-purple-500 before:to-blue-400",
}

const hoverMotion = {
  rest: { y: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  hover: { y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" },
}

const glassHoverMotion = {
  rest: {
    y: 0,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  hover: {
    y: -6,
    backgroundColor: "rgba(255,255,255,0.09)",
    borderColor: "rgba(59,130,246,0.30)",
  },
}

const defaultHoverMotion = {
  rest: { y: 0 },
  hover: { y: -4 },
}

function PremiumBorder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("relative rounded-2xl p-[1px]", className)}>
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.7) 0%, rgba(6,182,212,0.4) 50%, rgba(99,102,241,0.2) 100%)",
        }}
      />
      {children}
    </div>
  )
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      topAccent = false,
      topAccentColor = "blue",
      animate = false,
      hoverLift = false,
      padding = "none",
      asMotion = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()

    const topAccentClass = topAccent
      ? [
          "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-2xl",
          accentColors[topAccentColor],
          "relative overflow-hidden",
        ].join(" ")
      : ""

    const baseClass = clsx(
      "rounded-2xl",
      variantStyles[variant],
      paddingStyles[padding],
      topAccentClass,
      className
    )

    if (variant === "premium") {
      const inner = (
        <div
          ref={ref}
          className={clsx(
            "rounded-2xl bg-[#0a1628] backdrop-blur-xl relative",
            paddingStyles[padding],
            topAccentClass,
            className
          )}
          {...props}
        >
          {children}
        </div>
      )

      if (hoverLift && !shouldReduceMotion) {
        return (
          <PremiumBorder>
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={hoverMotion}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="rounded-2xl"
            >
              {inner}
            </motion.div>
          </PremiumBorder>
        )
      }

      return <PremiumBorder>{inner}</PremiumBorder>
    }

    if (hoverLift && !shouldReduceMotion) {
      const isGlass = variant === "glass" || variant === "glass-strong" || variant === "glow" || variant === "flat"
      const motionVariants = isGlass ? glassHoverMotion : defaultHoverMotion

      return (
        <motion.div
          ref={ref}
          className={baseClass}
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={motionVariants}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          {...(props as React.ComponentPropsWithRef<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )
    }

    if (animate && !shouldReduceMotion) {
      return (
        <motion.div
          ref={ref}
          className={baseClass}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          {...(props as React.ComponentPropsWithRef<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={baseClass} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ compact = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col space-y-1.5",
        compact ? "p-4 pb-2" : "p-6 pb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ size = "md", className, children, ...props }, ref) => {
    const sizeClass = {
      sm: "text-sm font-semibold",
      md: "text-base font-bold",
      lg: "text-lg font-bold",
    }[size]

    return (
      <h3
        ref={ref}
        className={clsx(
          sizeClass,
          "leading-tight tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    )
  }
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx("text-sm leading-relaxed opacity-60", className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ compact = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(compact ? "p-4 pt-0" : "p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ border = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex items-center p-6 pt-0",
        border ? "border-t border-white/8 pt-4 mt-2" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"

const CardSkeleton = ({
  className,
  dark = true,
}: {
  className?: string
  dark?: boolean
}) => (
  <div
    className={clsx(
      "rounded-2xl overflow-hidden",
      dark ? "bg-white/5 border border-white/8" : "bg-slate-100 border border-slate-200",
      className
    )}
  >
    <div className="p-6 space-y-4">
      <div
        className={clsx(
          "h-4 rounded-lg w-2/3",
          dark ? "skeleton" : "skeleton-light"
        )}
      />
      <div
        className={clsx(
          "h-3 rounded-lg w-full",
          dark ? "skeleton" : "skeleton-light"
        )}
      />
      <div
        className={clsx(
          "h-3 rounded-lg w-4/5",
          dark ? "skeleton" : "skeleton-light"
        )}
      />
      <div
        className={clsx(
          "h-8 rounded-xl w-1/3 mt-4",
          dark ? "skeleton" : "skeleton-light"
        )}
      />
    </div>
  </div>
)

CardSkeleton.displayName = "CardSkeleton"

const MetricCard = ({
  label,
  value,
  change,
  changeLabel,
  icon,
  accent = "blue",
  dark = true,
  animate: animateProp = true,
  delay = 0,
}: {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  accent?: "blue" | "orange" | "cyan" | "green" | "purple"
  dark?: boolean
  animate?: boolean
  delay?: number
}) => {
  const shouldReduceMotion = useReducedMotion()
  const isPositive = change !== undefined && change >= 0

  const accentColorMap = {
    blue: "text-blue-400",
    orange: "text-orange-400",
    cyan: "text-cyan-400",
    green: "text-emerald-400",
    purple: "text-purple-400",
  }

  const iconBgMap = {
    blue: "bg-blue-500/15 text-blue-400",
    orange: "bg-orange-500/15 text-orange-400",
    cyan: "bg-cyan-500/15 text-cyan-400",
    green: "bg-emerald-500/15 text-emerald-400",
    purple: "bg-purple-500/15 text-purple-400",
  }

  const barColorMap = {
    blue: "from-blue-500 to-cyan-400",
    orange: "from-orange-500 to-amber-400",
    cyan: "from-cyan-500 to-blue-400",
    green: "from-emerald-500 to-teal-400",
    purple: "from-purple-500 to-blue-400",
  }

  const content = (
    <div
      className={clsx(
        "rounded-2xl p-5 relative overflow-hidden",
        "transition-all duration-300 group cursor-default",
        dark
          ? "bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/18"
          : "bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg shadow-sm"
      )}
    >
      <div
        className={clsx(
          "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
          barColorMap[accent]
        )}
      />
      <div className="flex items-start justify-between mb-3">
        <p
          className={clsx(
            "text-xs font-semibold uppercase tracking-widest",
            dark ? "text-white/50" : "text-slate-500"
          )}
        >
          {label}
        </p>
        {icon && (
          <div className={clsx("p-2 rounded-xl", iconBgMap[accent])}>
            <span className="text-sm">{icon}</span>
          </div>
        )}
      </div>
      <div
        className={clsx(
          "text-3xl font-black tracking-tight leading-none mb-2",
          dark ? "text-white" : "text-slate-900"
        )}
      >
        {value}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={clsx(
              "text-xs font-semibold",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {isPositive ? "+" : ""}{change}%
          </span>
          {changeLabel && (
            <span
              className={clsx(
                "text-xs",
                dark ? "text-white/40" : "text-slate-400"
              )}
            >
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (!animateProp || shouldReduceMotion) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {content}
    </motion.div>
  )
}

MetricCard.displayName = "MetricCard"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardSkeleton,
  MetricCard,
}

export default Card
