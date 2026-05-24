"use client";

import type { ReactNode } from "react";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { DashboardShell } from "@/components/layout/DashboardShell";
import type { NavItem } from "@/lib/navigation/dashboard-nav";

interface RoleDashboardLayoutProps {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  children: ReactNode;
}

export function RoleDashboardLayout({
  title,
  subtitle,
  nav,
  children,
}: RoleDashboardLayoutProps) {
  return (
    <DashboardShell title={title} subtitle={subtitle}>
      <DashboardNav items={nav} />
      {children}
    </DashboardShell>
  );
}
