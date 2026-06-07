"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProgressContextValue {
  startNavigation: () => void;
}

const NavigationProgressContext =
  createContext<NavigationProgressContextValue | null>(null);

const MIN_VISIBLE_MS = 320;

export function NavigationProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading: authLoading, notifyRouteReady } = useAuth();
  const [navigating, setNavigating] = useState(false);
  const prevPath = useRef(pathname);
  const hideTimer = useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const startNavigation = useCallback(() => {
    clearHideTimer();
    setNavigating(true);
  }, []);

  useEffect(() => {
    if (prevPath.current === pathname) {
      return;
    }
    prevPath.current = pathname;
    notifyRouteReady();
    setNavigating(true);
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => {
      setNavigating(false);
      hideTimer.current = null;
    }, MIN_VISIBLE_MS);
    return clearHideTimer;
  }, [pathname]);

  const visible = authLoading || navigating;

  return (
    <NavigationProgressContext.Provider value={{ startNavigation }}>
      {children}
      <PageLoader visible={visible} />
    </NavigationProgressContext.Provider>
  );
}

export function useNavigationProgress(): NavigationProgressContextValue {
  const ctx = useContext(NavigationProgressContext);
  if (!ctx) {
    throw new Error(
      "useNavigationProgress deve ser usado dentro de NavigationProgressProvider",
    );
  }
  return ctx;
}
