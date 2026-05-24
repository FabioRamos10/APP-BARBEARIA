import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  error,
  placeholder = "Selecione…",
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-xs font-medium uppercase tracking-wider text-text-muted"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={[
          "w-full rounded-lg border bg-bg-deep/80 px-4 py-2.5 text-sm text-foreground",
          "focus:border-neon-primary/60 focus:outline-none focus:ring-2 focus:ring-neon-primary/20",
          error ? "border-danger/60" : "border-neon-primary/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
