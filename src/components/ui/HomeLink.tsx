import Link from "next/link";

interface HomeLinkProps {
  className?: string;
  compact?: boolean;
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

export function HomeLink({ className = "", compact = false }: HomeLinkProps) {
  return (
    <Link
      href="/"
      className={[
        "group inline-flex items-center justify-center gap-2.5 rounded-xl border font-display tracking-wide transition-all duration-300",
        "border-neon-primary/35 bg-gradient-to-br from-neon-primary/15 via-bg-surface/90 to-bg-surface/60",
        "text-neon-primary shadow-[0_0_24px_rgba(0,255,156,0.12)]",
        "hover:border-neon-primary/70 hover:shadow-[0_0_32px_rgba(0,255,156,0.22)] hover:from-neon-primary/20",
        "active:scale-[0.98]",
        compact ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-neon-primary/30 bg-neon-primary/10 transition group-hover:border-neon-primary/50 group-hover:bg-neon-primary/15">
        <HomeIcon />
      </span>
      Voltar ao início
    </Link>
  );
}
