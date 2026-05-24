import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export function GlassCard({
  title,
  subtitle,
  className = "",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel relative z-10 rounded-2xl p-6 ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title && (
            <h2 className="font-display text-lg font-semibold tracking-wider text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
