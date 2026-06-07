"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME } from "@/lib/brand";

interface BrandRevealProps {
  className?: string;
  waitForAuth?: boolean;
  /** hero = tela inicial — mais rápido e intenso */
  variant?: "default" | "hero";
  onComplete?: () => void;
}

const GLITCH_CHARS = "OBS#01▮▯░▒▓XZ9";

const TIMING = {
  default: {
    startDelay: 280,
    flickerMs: 38,
    maxFlickers: 3,
    pauseChar: 48,
    pauseSpace: 60,
    letterDelay: 32,
  },
  hero: {
    startDelay: 80,
    flickerMs: 22,
    maxFlickers: 2,
    pauseChar: 22,
    pauseSpace: 28,
    letterDelay: 18,
  },
} as const;

function randomGlitchChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] ?? "▮";
}

export function BrandReveal({
  className = "",
  waitForAuth = true,
  variant = "default",
  onComplete,
}: BrandRevealProps) {
  const { isLoading } = useAuth();
  const timing = TIMING[variant];
  const [started, setStarted] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);
  const [displayChars, setDisplayChars] = useState<string[]>(
    () => Array.from(BRAND_NAME, () => ""),
  );
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);
  const completedRef = useRef(false);
  const flickerRef = useRef<number | null>(null);
  const text = BRAND_NAME;

  const finish = useCallback(() => {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;
    setFlash(true);
    setDone(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (waitForAuth && isLoading) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setDisplayChars(text.split(""));
      setLockedCount(text.length);
      finish();
      return;
    }

    const startTimer = window.setTimeout(
      () => setStarted(true),
      timing.startDelay,
    );
    return () => window.clearTimeout(startTimer);
  }, [isLoading, waitForAuth, text, finish, timing.startDelay]);

  useEffect(() => {
    if (!started || lockedCount >= text.length) {
      if (started && lockedCount >= text.length && !done) {
        finish();
      }
      return;
    }

    const targetChar = text[lockedCount];
    let flickers = 0;
    const maxFlickers =
      targetChar === " " ? 1 : timing.maxFlickers;

    const runFlicker = () => {
      if (flickers < maxFlickers) {
        setDisplayChars((prev) => {
          const next = [...prev];
          next[lockedCount] =
            targetChar === " " ? "\u00A0" : randomGlitchChar();
          return next;
        });
        flickers += 1;
        flickerRef.current = window.setTimeout(runFlicker, timing.flickerMs);
        return;
      }

      setDisplayChars((prev) => {
        const next = [...prev];
        next[lockedCount] = targetChar === " " ? "\u00A0" : targetChar;
        return next;
      });

      const pause =
        targetChar === " " ? timing.pauseSpace : timing.pauseChar;
      flickerRef.current = window.setTimeout(() => {
        setLockedCount((count) => count + 1);
      }, pause);
    };

    runFlicker();

    return () => {
      if (flickerRef.current !== null) {
        window.clearTimeout(flickerRef.current);
      }
    };
  }, [started, lockedCount, text, done, finish, timing]);

  return (
    <div
      className={[
        "brand-reveal-wrap relative inline-block max-w-full",
        variant === "hero" ? "brand-reveal-wrap-hero" : "",
        done ? "brand-reveal-wrap-done" : "",
        flash ? "brand-reveal-wrap-flash" : "",
      ].join(" ")}
    >
      {variant === "hero" && started && (
        <>
          <span className="brand-spark brand-spark-a" aria-hidden />
          <span className="brand-spark brand-spark-b" aria-hidden />
          <span className="brand-spark brand-spark-c" aria-hidden />
        </>
      )}
      <h1
        className={[
          "font-display font-bold tracking-wide neon-text",
          variant === "hero" ? "brand-title-hero" : "",
          className,
        ].join(" ")}
        aria-label={done ? text : undefined}
      >
        {text.split("").map((char, index) => {
          const locked = index < lockedCount;
          const displayed = displayChars[index] ?? "";
          const isSpace = char === " ";
          const isHero = variant === "hero";

          return (
            <span
              key={`${char}-${index}`}
              className={[
                "brand-letter inline-block",
                locked
                  ? isHero
                    ? "brand-letter-locked-hero"
                    : "brand-letter-locked"
                  : started
                    ? isHero
                      ? "brand-letter-scramble-hero"
                      : "brand-letter-scramble"
                    : "brand-letter-hidden",
                isSpace ? "brand-letter-space" : "",
              ].join(" ")}
              style={
                locked
                  ? { animationDelay: `${index * timing.letterDelay}ms` }
                  : undefined
              }
              aria-hidden={!locked}
            >
              {locked ? (isSpace ? "\u00A0" : char) : displayed || "▮"}
            </span>
          );
        })}
        {started && !done && (
          <span className="brand-cursor ml-0.5 inline-block" aria-hidden>
            {variant === "hero" ? "◆" : "▮"}
          </span>
        )}
      </h1>
      {done && (
        <>
          <span className="brand-scanline" aria-hidden />
          {variant === "hero" && (
            <span className="brand-scanline brand-scanline-2" aria-hidden />
          )}
        </>
      )}
    </div>
  );
}
