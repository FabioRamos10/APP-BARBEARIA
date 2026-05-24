import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-xs font-medium uppercase tracking-wider text-text-muted"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={3}
        className={[
          "w-full resize-y rounded-lg border bg-bg-deep/80 px-4 py-2.5 text-sm text-foreground",
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
