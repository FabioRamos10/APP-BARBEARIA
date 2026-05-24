"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/navigation/dashboard-nav";

interface DashboardNavProps {
  items: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard/barbeiro" &&
            pathname.startsWith(`${item.href}/`)) ||
          (item.href === "/dashboard/barbeiro" && pathname === item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-lg border px-4 py-2 text-sm transition-all",
              active
                ? "border-neon-primary bg-neon-primary/15 text-neon-primary"
                : "border-neon-primary/15 text-text-muted hover:border-neon-primary/40 hover:text-neon-primary",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
