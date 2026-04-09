import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { clsx } from "clsx"

export type ButtonVariant =
  | "primary"
  | "orange"
  | "outline"
  | "ghost"
  | "premium"
  | "destructive"
  | "secondary"

export type ButtonSize = "sm" | "md" | "lg" | "xl"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glow?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-blue-600 text-white border border-blue-500",
    "hover:bg-blue-500 hover:border-blue-400",
    "shadow-[0_4px_20px_rgba(59,130,246,0.35)]",
    "hover:shadow-[0_6px_30px_rgba(59,130,246,0.55)]",
  ].join(" "),

  orange: [
    "bg-orange-500 text-white border border-orange-400",
    "hover:bg-orange-400 hover:border-orange-300",
    "shadow-[0_4px_20px_rgba(249,115,22,0.4)]",
    "hover:shadow-[0_6px_32px_rgba(249,115,22,0.65)]",
  ].join(" "),

  outline: [
    "bg-transparent text-white border border-white/20",
    "hover:bg-white/10 hover:border-white/40",
    "shadow-none hover:shadow-[0_4px_20px_rgba(255,255,255,0.08)]",
  ].join(" "),

  ghost: [
    "bg-transparent text-white/80 border border-transparent",
    "hover:bg-white/8 hover:text-white",
    "shadow-none",
  ].join(" "),

  premium: [
    "text-white border border-blue-400/30",
    "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500",
    "shadow-[0_4px_24px_rgba(59,130,246,0.4)]",
    "hover:shadow-[0_8px_40px_rgba(59,130,246,0.65)]",
    "hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400",
  ].join(" "),

  destructive: [
    "bg-red-600 text-white border border-red-500",
    "hover:bg-red-700 hover:border-red-600",
    "shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
    "hover:shadow-[0_6px_24px_rgba(239,68,68,0.5)]",
  ].join(" "),

  secondary: [
    "bg-white/10 text-white border border-white/15",
    "hover:bg-white/18 hover:border-white/30",
    "shadow-none",
  ].join(" "),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2",
  xl: "h-14 px-9 text-base gap-2.5",
}

const hoverAnimations: Record<ButtonVariant, object> = {
  primary: { scale: 1.02, y: -1 },
  orange: { scale: 1.03, y: -1 },
  outline: { scale: 1.01 },
  ghost: { scale: 1.01 },
  premium: { scale: 1.03, y: -2 },
  destructive: { scale: 1.01 },
  secondary: { scale: 1.01 },
}

const tapAnimation = { scale: 0.97 }

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

const ButtonInner = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      glow = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const baseStyles = [
      "relative inline-flex items-center justify-center",
      "font-semibold rounded-xl",
      "transition-all duration-300 ease-out",
      "cursor-pointer select-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      "overflow-hidden",
      fullWidth ? "w-full" : "",
    ].join(" ")

    const glowClass = glow
      ? variant === "orange"
        ? "animate-glow-orange"
        : "animate-glow-blue"
      : ""

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            glowClass,
            className
          )}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glowClass,
          className
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
            <LoadingSpinner />
          </span>
        )}
        <span
          className={clsx(
            "flex items-center justify-center gap-inherit",
            sizeStyles[size].includes("gap") ? "" : "gap-2",
            loading ? "opacity-0" : "opacity-100"
          )}
        >
          {leftIcon && (
            <span className="shrink-0 flex items-center">{leftIcon}</span>
          )}
          {children}
          {rightIcon && (
            <span className="shrink-0 flex items-center">{rightIcon}</span>
          )}
        </span>
      </button>
    )
  }
)

ButtonInner.displayName = "ButtonInner"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const { variant = "primary", disabled, loading } = props
    const isDisabled = disabled || loading

    if (shouldReduceMotion || isDisabled) {
      return <ButtonInner ref={ref} {...props} />
    }

    return (
      <motion.div
        className={clsx(
          "inline-flex",
          props.fullWidth ? "w-full" : "",
          "rounded-xl"
        )}
        whileHover={hoverAnimations[variant]}
        whileTap={tapAnimation}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <ButtonInner ref={ref} {...props} className={clsx("w-full", props.className)} />
      </motion.div>
    )
  }
)

Button.displayName = "Button"

export { Button }
export default Button
