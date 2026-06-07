import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "border-neon-primary/50 bg-bg-surface text-neon-primary hover:neon-border-glow hover:border-neon-primary",
  accent:
    "border-neon-primary/60 bg-gradient-to-r from-neon-primary/25 via-neon-primary/15 to-neon-primary/5 text-neon-primary shadow-[0_0_28px_rgba(0,255,156,0.15)] hover:border-neon-primary hover:shadow-[0_0_36px_rgba(0,255,156,0.28)] hover:from-neon-primary/30",
  outline:
    "border-neon-primary/25 bg-bg-elevated/80 text-foreground backdrop-blur-sm hover:border-neon-primary/50 hover:bg-neon-primary/5 hover:text-neon-primary",
  ghost:
    "border-white/10 bg-white/[0.03] text-text-muted hover:border-neon-primary/35 hover:bg-neon-primary/5 hover:text-neon-primary",
  danger:
    "border-danger/50 bg-bg-surface text-danger hover:shadow-[0_0_20px_rgba(255,77,109,0.2)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm sm:text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-xl border font-medium tracking-wide transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        fullWidth ? "w-full" : "",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
