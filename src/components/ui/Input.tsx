import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", type, ...props }: InputProps) {
  const inputId = id ?? props.name;
  const isDate = type === "date" || type === "datetime-local";

  return (
    <div className="min-w-0 max-w-full space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-xs font-medium uppercase tracking-wider text-text-muted"
      >
        {label}
      </label>
      <div
        className={[
          "min-w-0 max-w-full overflow-hidden rounded-lg border",
          error ? "border-danger/60" : "border-neon-primary/20",
        ].join(" ")}
      >
        <input
          id={inputId}
          type={type}
          className={[
            "block w-full min-w-0 max-w-full box-border rounded-lg border-0 bg-bg-deep/80 py-2.5 text-sm text-foreground",
            isDate ? "px-3 color-scheme-dark" : "px-4",
            "placeholder:text-text-muted/50",
            "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon-primary/20",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
