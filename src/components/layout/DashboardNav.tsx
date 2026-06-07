"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useNavigationProgress } from "@/contexts/NavigationProgressContext";
import type { NavItem } from "@/lib/navigation/dashboard-nav";

interface DashboardNavProps {
  items: NavItem[];
}

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) {
    return true;
  }
  if (href === "/dashboard/barbeiro") {
    return pathname === href;
  }
  return pathname.startsWith(`${href}/`);
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();
  const { startNavigation } = useNavigationProgress();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div className="nav-scroll-mask relative -mx-4 mb-6 sm:mx-0">
      <nav
        className="flex gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        aria-label="Módulos do painel"
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const mobileLabel = item.shortLabel ?? item.label;

          return (
            <Link
              key={item.href}
              ref={active ? activeRef : undefined}
              href={item.href}
              onClick={() => {
                if (!active) {
                  startNavigation();
                }
              }}
              className={[
                "shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200",
                active
                  ? "border-neon-primary bg-gradient-to-r from-neon-primary/25 to-neon-primary/10 text-neon-primary shadow-[0_0_20px_rgba(0,255,156,0.15)]"
                  : "border-neon-primary/15 bg-bg-surface/60 text-text-muted hover:border-neon-primary/40 hover:text-neon-primary",
              ].join(" ")}
            >
              <span className="sm:hidden">{mobileLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
