import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { BRAND_NAME } from "@/lib/brand";

export default function Home() {
  return (
    <AppShell centered>
      <div className="w-full max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide neon-text sm:text-4xl md:text-5xl">
          {BRAND_NAME}
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-text-muted">
          Faça{" "}
          <Link
            href="/login"
            className="text-neon-primary underline-offset-4 hover:underline"
          >
            login
          </Link>{" "}
          ou{" "}
          <Link
            href="/registro"
            className="text-neon-primary underline-offset-4 hover:underline"
          >
            crie sua conta
          </Link>{" "}
          para começar.
        </p>
        <p className="mx-auto mt-6 text-sm">
          <Link
            href="/sobre-nos"
            className="text-neon-primary underline-offset-4 hover:underline"
          >
            Sobre nós
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
