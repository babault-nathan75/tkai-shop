import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
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
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Produits</h1>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-full bg-primary px-6 py-4 font-black shadow-glow transition hover:scale-105 hover:bg-accent"
          >
            + Nouveau produit
          </Link>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-surface">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-white/10 bg-black/30">
              <tr>
                <th className="px-6 py-5 text-left text-sm uppercase text-zinc-400">
                  Produit
                </th>
                <th className="px-6 py-5 text-left text-sm uppercase text-zinc-400">
                  Catégorie
                </th>
                <th className="px-6 py-5 text-left text-sm uppercase text-zinc-400">
                  Prix
                </th>
                <th className="px-6 py-5 text-right text-sm uppercase text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-primary/5"
                >
                  <td className="px-6 py-5 font-bold">{product.name}</td>
                  <td className="px-6 py-5 text-zinc-400">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-5 text-primary font-black">
                    {product.price.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-full border border-primary/40 px-4 py-2 text-sm font-bold hover:bg-primary/10"
                      >
                        Modifier
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/products/${product.id}`}
                        confirmMessage={`Supprimer le produit "${product.name}" ?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-zinc-500"
                  >
                    Aucun produit disponible.
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
