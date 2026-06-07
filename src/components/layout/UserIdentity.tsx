"use client";

import { roleDotClass, roleLabel } from "@/lib/auth/roles";
import type { Role } from "@/lib/types/enums";

interface UserIdentityProps {
  name: string;
  role: Role;
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

export function UserIdentity({ name, role }: UserIdentityProps) {
  const initials = initialsFromName(name);

  return (
    <div
      className="flex max-w-full items-center gap-2.5 rounded-full border border-neon-primary/20 bg-bg-surface/80 px-2.5 py-1.5 backdrop-blur-sm sm:px-3"
      title={roleLabel(role)}
      aria-label={`${name}, ${roleLabel(role)}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon-primary/30 bg-gradient-to-br from-neon-primary/20 to-neon-primary/5 font-display text-[10px] font-bold tracking-wider text-neon-primary sm:text-xs">
        {initials}
      </span>
      <span className="min-w-0 max-w-[7rem] truncate text-sm font-medium text-foreground sm:max-w-[10rem]">
        {name}
      </span>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${roleDotClass(role)}`}
        aria-hidden
      />
    </div>
  );
}
