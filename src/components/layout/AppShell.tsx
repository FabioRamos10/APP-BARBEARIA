import type { ReactNode } from "react";
import { StarfieldBackground } from "@/components/effects/StarfieldBackground";

interface AppShellProps {
  children: ReactNode;
  /** Center content vertically (auth pages) */
  centered?: boolean;
}

export function AppShell({ children, centered = false }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarfieldBackground />
      <div
        className={[
          "relative z-10 flex min-h-screen flex-col px-4 py-8",
          centered ? "items-center justify-center" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
