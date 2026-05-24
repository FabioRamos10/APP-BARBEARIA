import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-xs font-medium uppercase tracking-wider text-text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={[
          "w-full rounded-lg border bg-bg-deep/80 px-4 py-2.5 text-sm text-foreground",
          "placeholder:text-text-muted/50",
          "focus:border-neon-primary/60 focus:outline-none focus:ring-2 focus:ring-neon-primary/20",
          error ? "border-danger/60" : "border-neon-primary/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
