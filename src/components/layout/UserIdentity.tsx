"use client";

import { roleDotClass, roleLabel } from "@/lib/auth/roles";
import type { Role } from "@/lib/types/enums";

interface UserIdentityProps {
  name: string;
  role: Role;
  className?: string;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserIdentity({ name, role, className = "" }: UserIdentityProps) {
  const initials = initialsFromName(name);

  return (
    <div
      className={[
        "flex min-w-0 items-center gap-2 rounded-full border border-neon-primary/20 bg-bg-surface/80 px-2.5 py-1.5 backdrop-blur-sm sm:gap-2.5 sm:px-3",
        className,
      ].join(" ")}
      title={`${name} · ${roleLabel(role)}`}
      aria-label={`${name}, ${roleLabel(role)}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neon-primary/30 bg-gradient-to-br from-neon-primary/20 to-neon-primary/5 font-display text-[10px] font-bold tracking-wider text-neon-primary sm:h-8 sm:w-8 sm:text-xs">
        {initials}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground sm:text-sm">
        {name}
      </span>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${roleDotClass(role)}`}
        aria-hidden
      />
    </div>
  );
}
