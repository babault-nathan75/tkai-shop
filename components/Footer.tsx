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
    <footer className="relative hidden overflow-hidden border-t border-white/10 bg-black text-zinc-400 md:block">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary shadow-glow" />
              <h3 className="text-3xl font-black tracking-tight text-white">
                T-KAI
              </h3>
            </div>

            <p className="mt-5 max-w-sm leading-relaxed text-zinc-400">
              Otaku streetwear. Manga energy. Urban identity. Le style qui
              définit la nouvelle génération.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface transition hover:border-primary hover:bg-primary/10 hover:text-white"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface transition hover:border-primary hover:bg-primary/10 hover:text-white"
              >
                <Facebook size={18} />
              </Link>
            </div>
          </div>

          {/* COLLECTIONS */}
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-primary">
              Collections
            </h4>

            <nav className="grid gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group flex items-center gap-3 transition hover:text-white"
                >
                  <div className="h-2 w-2 rounded-full bg-primary/40 transition group-hover:bg-primary" />
                  <span className="font-medium">{category.name}</span>
                </Link>
              ))}

              {categories.length === 0 && (
                <p className="text-sm text-zinc-500">
                  Aucune collection pour le moment.
                </p>
              )}
            </nav>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-primary">
              Infos & Contact
            </h4>

            <div className="space-y-4 text-sm">
              <div className="rounded-2xl border border-white/10 bg-surface p-4">
                <p className="font-bold text-white">📍 Livraison</p>
                <p className="mt-2 text-zinc-400">
                  Livraison partout en Côte d&rsquo;Ivoire.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface p-4">
                <p className="font-bold text-white">💳 Paiement</p>
                <p className="mt-2 text-zinc-400">
                  Mobile Money (MTN, Orange), Carte bancaire, PayPal. Paiement sécurisé à 100%.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs uppercase tracking-widest text-primary">
                  Support
                </p>
                <p className="mt-2 font-bold text-white">tkaishop26@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              © {currentYear} T-KAI Studio. Tous les droits réservés.
            </p>

            <div className="flex items-center gap-6 text-xs uppercase tracking-wider text-zinc-500">
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
