import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Layers3,
  ArrowRight,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { ResetDemoButton } from "@/components/admin/ResetDemoButton";
import { TestSmtpButton } from "@/components/admin/TestSmtpButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const modules = [
  {
    title: "Produits",
    description:
      "Ajoute, modifie et gère les produits de la boutique T-KAI.",
    href: "/admin/products",
    icon: Package,
  },

  {
    title: "Commandes",
    description:
      "Consulte les commandes clients et gère les statuts de livraison.",
    href: "/admin/orders",
    icon: ShoppingCart,
  },

  {
    title: "Catégories",
    description:
      "Crée les collections et catégories affichées sur le site.",
    href: "/admin/categories",
    icon: Layers3,
  },
];

export default async function AdminPage() {
  const [productCount, orderCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
  ]);

  const stats: Record<string, number> = {
    "/admin/products": productCount,
    "/admin/orders": orderCount,
    "/admin/categories": categoryCount,
  };

  return (
    <main className="min-h-screen bg-background text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-primary">
              T-KAI Admin
            </p>

            <h1 className="mt-4 text-5xl font-black uppercase leading-none md:text-7xl">
              Dashboard
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Gérez votre boutique manga streetwear, vos collections,
              commandes et produits depuis un panneau d&apos;administration moderne.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TestSmtpButton />
            <ResetDemoButton />
            <AdminLogoutButton />
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            const count = stats[module.href] ?? 0;

            return (
              <Link
                key={module.title}
                href={module.href}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-8 transition duration-300 hover:border-primary hover:bg-primary/5"
              >
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={30} strokeWidth={2.5} />
                  </div>

                  <h2 className="text-3xl font-black uppercase">
                    {module.title}
                  </h2>

                  <p className="mt-4 leading-relaxed text-zinc-400">
                    {module.description}
                  </p>

                  <div className="mt-6 text-3xl font-black text-primary">
                    {count}
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-black text-primary">
                    Accéder
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
