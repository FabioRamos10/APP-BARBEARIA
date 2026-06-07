import { AppShell } from "@/components/layout/AppShell";
import { HomeLink } from "@/components/ui/HomeLink";
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
        <div className="mt-10 flex justify-center">
          <HomeLink compact />
        </div>
      </div>
    </AppShell>
  );
}
