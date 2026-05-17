import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm uppercase tracking-wider text-zinc-500 hover:text-primary"
            >
              ← Dashboard
            </Link>
            <p className="mt-2 font-black uppercase tracking-[0.25em] text-primary">
              Admin Panel
            </p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">
              Catégories & Collections
            </h1>
            <p className="mt-3 text-zinc-400">
              Les catégories affichées en page d&apos;accueil et sur le shop
              sont créées ici.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-accent"
          >
            + Nouvelle catégorie
          </Link>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-surface">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-left">
                <th className="px-6 py-5 text-sm uppercase tracking-wider text-zinc-400">
                  Image
                </th>
                <th className="px-6 py-5 text-sm uppercase tracking-wider text-zinc-400">
                  Nom
                </th>
                <th className="px-6 py-5 text-sm uppercase tracking-wider text-zinc-400">
                  Slug
                </th>
                <th className="px-6 py-5 text-sm uppercase tracking-wider text-zinc-400">
                  Produits
                </th>
                <th className="px-6 py-5 text-sm uppercase tracking-wider text-zinc-400">
                  Accueil
                </th>
                <th className="px-6 py-5 text-right text-sm uppercase tracking-wider text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-white/5 transition hover:bg-primary/5"
                >
                  <td className="px-6 py-4">
                    {category.imageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-xl border border-white/10 bg-black/40" />
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold">{category.name}</p>
                    {category.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                        {category.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-5 text-zinc-400">{category.slug}</td>
                  <td className="px-6 py-5 text-zinc-300">
                    {category._count.products}
                  </td>
                  <td className="px-6 py-5">
                    {category.featured ? (
                      <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                        Oui
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-500">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="rounded-full border border-primary/40 px-4 py-2 text-sm font-bold transition hover:bg-primary/10"
                      >
                        Modifier
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/categories/${category.id}`}
                        confirmMessage={`Supprimer la catégorie "${category.name}" ?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-zinc-500"
                  >
                    Aucune catégorie créée. Clique sur{" "}
                    <span className="text-primary">
                      + Nouvelle catégorie
                    </span>{" "}
                    pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
