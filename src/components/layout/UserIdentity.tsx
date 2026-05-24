"use client";

import { roleDotClass, roleLabel } from "@/lib/auth/roles";
import type { Role } from "@/lib/types/enums";

interface UserIdentityProps {
  name: string;
  role: Role;
}

export function UserIdentity({ name, role }: UserIdentityProps) {
  return (
    <div
      className="flex flex-col items-center gap-1.5"
      title={roleLabel(role)}
      aria-label={`${name}, ${roleLabel(role)}`}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${roleDotClass(role)}`}
        aria-hidden
      />
      <span className="max-w-[10rem] truncate text-sm font-medium text-foreground">
        {name}
      </span>
    </div>
  );
}
