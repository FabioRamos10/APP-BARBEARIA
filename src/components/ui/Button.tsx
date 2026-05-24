import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "border-neon-primary/50 bg-bg-surface text-neon-primary hover:neon-border-glow hover:border-neon-primary",
  ghost:
    "border-text-muted/30 bg-transparent text-text-muted hover:border-neon-primary/40 hover:text-neon-primary",
  danger:
    "border-danger/50 bg-bg-surface text-danger hover:shadow-[0_0_20px_rgba(255,77,109,0.2)]",
};

export function Button({
  variant = "primary",
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
        "inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-40",
        fullWidth ? "w-full" : "",
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
