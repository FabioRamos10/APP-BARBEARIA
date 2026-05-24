import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AppProtectedPlaceholder() {
  return (
    <AppShell>
      <GlassCard
        title="Área autenticada"
        subtitle="Rota protegida pelo middleware — Fase 2+"
        className="mx-auto max-w-lg"
      >
        <p className="text-sm text-text-muted">
          Se você vê esta página, o cookie{" "}
          <code className="text-neon-primary">barbearia_token</code> está
          presente.
        </p>
        <Link
          href="/teste"
          className="mt-6 inline-block text-sm text-neon-primary hover:underline"
        >
          ← Voltar aos testes
        </Link>
      </GlassCard>
    </AppShell>
  );
}
