import * as React from "react"
import { clsx } from "clsx"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
  dark?: boolean
  inputSize?: "sm" | "md" | "lg"
  fullWidth?: boolean
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  dark?: boolean
  fullWidth?: boolean
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  dark?: boolean
  fullWidth?: boolean
  options: { label: string; value: string }[]
}

const inputSizeStyles = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-4 text-base",
}

const darkBaseInput = [
  "w-full rounded-xl font-medium",
  "bg-white/6 border border-white/12",
  "text-white placeholder:text-white/30",
  "transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60",
  "focus:bg-white/8",
  "disabled:opacity-40 disabled:cursor-not-allowed",
].join(" ")

const lightBaseInput = [
  "w-full rounded-xl font-medium",
  "bg-white border border-slate-200",
  "text-slate-900 placeholder:text-slate-400",
  "transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
  "hover:border-slate-300",
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50",
].join(" ")

const darkErrorInput = [
  "border-red-500/60 bg-red-500/8",
  "focus:ring-red-500/40 focus:border-red-500/60",
].join(" ")

const lightErrorInput = [
  "border-red-400 bg-red-50",
  "focus:ring-red-400/30 focus:border-red-400",
].join(" ")

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      dark = true,
      inputSize = "lg",
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const hasError = Boolean(error)
    const hasLeftIcon = Boolean(leftIcon)
    const hasRightIcon = Boolean(rightIcon)

    const baseClass = dark ? darkBaseInput : lightBaseInput
    const errorClass = hasError
      ? dark
        ? darkErrorInput
        : lightErrorInput
      : ""

    const paddingLeft = hasLeftIcon
      ? inputSize === "sm"
        ? "pl-8"
        : "pl-11"
      : ""
    const paddingRight = hasRightIcon
      ? inputSize === "sm"
        ? "pr-8"
        : "pr-11"
      : ""

    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              "text-sm font-semibold",
              dark ? "text-white/80" : "text-slate-700"
            )}
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className={clsx(
                "absolute left-0 flex items-center justify-center pointer-events-none",
                inputSize === "sm" ? "w-8 h-9" : "w-11 h-11",
                dark ? "text-white/40" : "text-slate-400"
              )}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {leftIcon}
              </span>
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              baseClass,
              inputSizeStyles[inputSize],
              paddingLeft,
              paddingRight,
              errorClass,
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span
              className={clsx(
                "absolute right-0 flex items-center justify-center",
                inputSize === "sm" ? "w-8 h-9" : "w-11 h-11",
                dark ? "text-white/40 hover:text-white/70" : "text-slate-400 hover:text-slate-600",
                onRightIconClick ? "cursor-pointer transition-colors duration-200" : "pointer-events-none"
              )}
              onClick={onRightIconClick}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {rightIcon}
              </span>
            </span>
          )}
        </div>

        {(hint || error) && (
          <p
            className={clsx(
              "text-xs font-medium",
              hasError
                ? "text-red-400"
                : dark
                ? "text-white/40"
                : "text-slate-500"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      dark = true,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const hasError = Boolean(error)

    const baseClass = dark ? darkBaseInput : lightBaseInput
    const errorClass = hasError
      ? dark
        ? darkErrorInput
        : lightErrorInput
      : ""

    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              "text-sm font-semibold",
              dark ? "text-white/80" : "text-slate-700"
            )}
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            baseClass,
            "px-4 py-3 resize-none min-h-[100px]",
            errorClass,
            className
          )}
          {...props}
        />

        {(hint || error) && (
          <p
            className={clsx(
              "text-xs font-medium",
              hasError
                ? "text-red-400"
                : dark
                ? "text-white/40"
                : "text-slate-500"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      dark = true,
      fullWidth = true,
      options,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const hasError = Boolean(error)

    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            htmlFor={selectId}
            className={clsx(
              "text-sm font-semibold",
              dark ? "text-white/80" : "text-slate-700"
            )}
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              "w-full h-12 px-4 rounded-xl font-medium appearance-none",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              dark
                ? [
                    "bg-white/6 border border-white/12",
                    "text-white",
                    "focus:ring-blue-500/60 focus:border-blue-500/60",
                    hasError ? darkErrorInput : "",
                  ].join(" ")
                : [
                    "bg-white border border-slate-200",
                    "text-slate-900",
                    "focus:ring-blue-500/30 focus:border-blue-500",
                    hasError ? lightErrorInput : "",
                  ].join(" "),
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className={dark ? "bg-[#0b1729] text-white" : "bg-white text-slate-900"}
              >
                {opt.label}
              </option>
            ))}
          </select>

          <span
            className={clsx(
              "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none",
              dark ? "text-white/40" : "text-slate-400"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {(hint || error) && (
          <p
            className={clsx(
              "text-xs font-medium",
              hasError
                ? "text-red-400"
                : dark
                ? "text-white/40"
                : "text-slate-500"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "leftIcon">
>((props, ref) => {
  return (
    <Input
      ref={ref}
      leftIcon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      }
      placeholder="Search..."
      {...props}
    />
  )
})

SearchInput.displayName = "SearchInput"

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "rightIcon" | "onRightIconClick">
>((props, ref) => {
  const [show, setShow] = React.useState(false)

  return (
    <Input
      ref={ref}
      type={show ? "text" : "password"}
      leftIcon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      }
      rightIcon={
        show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      }
      onRightIconClick={() => setShow(!show)}
      {...props}
    />
  )
})

PasswordInput.displayName = "PasswordInput"

export { Input, Textarea, Select, SearchInput, PasswordInput }
export default Input
