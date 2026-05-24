import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { SobreNosFeed } from "@/components/sobre-nos/SobreNosFeed";
import { BRAND_NAME } from "@/lib/brand";

export default function SobreNosPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-2 py-8">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-neon-primary/80">
          {BRAND_NAME}
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold neon-text">
          Sobre nós
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Notícias, novidades da equipe e elogios dos clientes.
        </p>
        <div className="mt-8">
          <SobreNosFeed />
        </div>
        <p className="mt-8 text-center text-sm">
          <Link href="/" className="text-neon-primary hover:underline">
            ← Voltar ao início
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
