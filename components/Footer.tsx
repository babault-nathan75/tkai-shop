import Link from "next/link";
import { ArrowUpRight, Facebook, Mail, MoveRight, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getCachedCategories = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { createdAt: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["footer-categories"],
  { revalidate: 300, tags: ["categories"] }
);

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const categories = await getCachedCategories();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background text-zinc-400">
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 md:px-8 md:pb-10 md:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.35fr_.8fr_1fr] md:gap-16 md:pb-16">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-black tracking-[.12em] text-primary transition group-hover:rotate-[-8deg]">
                TK
              </span>
              <span className="text-xl font-black tracking-[.22em] text-foreground">
                T-KAI
              </span>
            </Link>
            <p className="display-type mt-6 max-w-sm text-3xl leading-tight text-foreground md:text-4xl">
              Porte ce que tu <span className="italic text-primary">aimes.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
              Otaku streetwear imaginé à Abidjan. Une culture, mille façons de
              la porter.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://www.facebook.com/share/18jd899x2M/"
                aria-label="Facebook T-KAI"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-primary hover:text-white"
              >
                <Facebook size={16} />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[.22em] text-primary">
              La boutique
            </h2>
            <nav className="mt-5 grid gap-3">
              <Link
                href="/shop"
                className="group flex items-center justify-between border-b border-white/[.06] pb-3 text-sm text-zinc-400 transition hover:text-white"
              >
                Toute la collection
                <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-primary" />
              </Link>
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group flex items-center justify-between border-b border-white/[.06] pb-3 text-sm text-zinc-400 transition hover:text-white"
                >
                  {category.name}
                  <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-primary" />
                </Link>
              ))}
              <Link
                href="/custom-lab"
                className="group flex items-center justify-between border-b border-white/[.06] pb-3 text-sm text-zinc-400 transition hover:text-white"
              >
                Custom Lab
                <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-primary" />
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[.22em] text-primary">
              Besoin d&apos;aide ?
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">
              Une question sur une pièce, ta commande ou une personnalisation ?
              Notre équipe est là pour toi.
            </p>
            <div className="mt-5 grid gap-3">
              <a
                href="mailto:tkaishop26@gmail.com"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] px-4 text-sm text-zinc-300 transition hover:border-primary/40 hover:text-white"
              >
                <Mail size={15} className="text-primary" />
                tkaishop26@gmail.com
              </a>
              <a
                href="tel:+2250500903433"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] px-4 text-sm text-zinc-300 transition hover:border-primary/40 hover:text-white"
              >
                <Phone size={15} className="text-primary" />
                +225 05 00 90 34 33
              </a>
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-zinc-600">
              Livraison partout en Côte d&apos;Ivoire
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 pt-6 sm:flex-row">
          <p className="text-center text-[10px] uppercase tracking-[.12em] text-zinc-600 sm:text-left">
            © {currentYear} <Link href="/admin/login" className="hover:text-white"> T-KAI Studio </Link>. Tous les droits réservés.
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-zinc-400 transition hover:text-white"
          >
            Rejoindre la collection
            <MoveRight size={14} className="text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
