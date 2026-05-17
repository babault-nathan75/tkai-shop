import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductImagesEditor } from "@/components/admin/ProductImagesEditor";
import { parseImageRows } from "@/lib/product-images";

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const categoryId = Number(formData.get("categoryId") || 0);

  if (!name || !description || !price || !categoryId) return;

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const images = parseImageRows(formData);

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      categoryId,
      images:
        images.length > 0
          ? {
              create: images.map((img) => ({
                url: img.url,
                color: img.color,
                position: img.position,
                alt: name,
              })),
            }
          : undefined,
    },
  });

  redirect("/admin/products");
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-sm uppercase tracking-wider text-zinc-500 hover:text-primary"
        >
          ← Produits
        </Link>

        <div className="mt-2 mb-10">
          <p className="font-black uppercase tracking-[0.25em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">
            Nouveau produit
          </h1>
          <p className="mt-4 text-zinc-400">
            Ajoute un nouveau produit à la boutique T-KAI.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/5 p-8 text-yellow-200">
            <p className="font-bold">Crée d&apos;abord une catégorie.</p>
            <Link
              href="/admin/categories/new"
              className="mt-4 inline-block rounded-full bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              + Nouvelle catégorie
            </Link>
          </div>
        ) : (
          <form
            action={createProduct}
            className="space-y-8 rounded-[2rem] border border-white/10 bg-surface p-8"
          >
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Nom du produit
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ex: Shadow Ronin Hoodie"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Description du produit..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Prix (FCFA)
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder="25000"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Catégorie
              </label>
              <select
                name="categoryId"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <ProductImagesEditor />

            <button
              type="submit"
              className="rounded-full bg-primary px-8 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-accent"
            >
              Créer le produit
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
