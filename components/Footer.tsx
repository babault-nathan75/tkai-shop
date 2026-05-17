import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function fetchCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return [];
  }
}

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const categories = await fetchCategories();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black text-zinc-400">
      <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl md:h-72 md:w-72" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow md:h-3 md:w-3" />
              <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                T-KAI
              </h3>
            </div>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400 md:mt-5 md:text-base">
              Otaku streetwear. Manga energy. Urban identity. Le style qui
              définit la nouvelle génération.
            </p>

            <div className="mt-4 flex items-center gap-3 md:mt-6 md:gap-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface transition hover:border-primary hover:bg-primary/10 hover:text-white md:h-11 md:w-11"
              >
                <Instagram size={16} className="md:h-[18px] md:w-[18px]" />
              </Link>
              <Link
                href="https://www.facebook.com/share/18jd899x2M/"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface transition hover:border-primary hover:bg-primary/10 hover:text-white md:h-11 md:w-11"
              >
                <Facebook size={16} className="md:h-[18px] md:w-[18px]" />
              </Link>
            </div>
          </div>

          {/* COLLECTIONS */}
          <div>
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary md:mb-6 md:text-xs md:tracking-[0.3em]">
              Collections
            </h4>

            <nav className="grid gap-2 md:gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group flex items-center gap-3 text-sm transition hover:text-white md:text-base"
                >
                  <div className="h-2 w-2 rounded-full bg-primary/40 transition group-hover:bg-primary" />
                  <span className="font-medium">{category.name}</span>
                </Link>
              ))}

              {categories.length === 0 && (
                <p className="text-xs text-zinc-500 md:text-sm">
                  Aucune collection pour le moment.
                </p>
              )}
            </nav>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary md:mb-6 md:text-xs md:tracking-[0.3em]">
              Infos & Contact
            </h4>

            <div className="space-y-3 text-sm md:space-y-4">
              <div className="rounded-xl border border-white/10 bg-surface p-3 md:rounded-2xl md:p-4">
                <p className="font-bold text-white">📍 Livraison</p>
                <p className="mt-1 text-xs text-zinc-400 md:mt-2 md:text-sm">
                  Livraison partout en Côte d&rsquo;Ivoire.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-surface p-3 md:rounded-2xl md:p-4">
                <p className="font-bold text-white">💳 Paiement</p>
                <p className="mt-1 text-xs text-zinc-400 md:mt-2 md:text-sm">
                  Mobile Money (MTN, Orange), Carte bancaire, PayPal. Paiement
                  sécurisé à 100%.
                </p>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 md:rounded-2xl md:p-4">
                <p className="text-[10px] uppercase tracking-widest text-primary md:text-xs">
                  Support
                </p>
                <p className="mt-1 break-all text-sm font-bold text-white md:mt-2 md:text-base">
                  tkaishop26@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-5 md:mt-14 md:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:gap-4">
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:text-xs md:tracking-[0.3em]">
              © {currentYear} T-KAI Studio. Tous les droits réservés.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-wider text-zinc-500 md:gap-6 md:text-xs">
              <Link href="/" className="transition hover:text-white">
                Accueil
              </Link>
              <Link href="/shop" className="transition hover:text-white">
                Boutique
              </Link>
              <Link href="/custom-lab" className="transition hover:text-white">
                Personaliser
              </Link>
              <Link href="/track" className="transition hover:text-white">
                Mes commandes
              </Link>
              <Link href="/admin" className="transition hover:text-white">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
