import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductImagesEditor } from "@/components/admin/ProductImagesEditor";
import { parseImageRows } from "@/lib/product-images";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  async function updateProduct(formData: FormData) {
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

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { name, slug, description, price, categoryId },
      }),
      prisma.productImage.deleteMany({ where: { productId } }),
      ...(images.length > 0
        ? [
            prisma.productImage.createMany({
              data: images.map((img) => ({
                productId,
                url: img.url,
                color: img.color,
                position: img.position,
                alt: name,
              })),
            }),
          ]
        : []),
    ]);

    redirect("/admin/products");
  }

  const initialImages = product.images.map((img) => ({
    color: img.color || "",
    url: img.url,
  }));

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
            Modifier le produit
          </h1>
        </div>

        <form
          action={updateProduct}
          className="space-y-8 rounded-[2rem] border border-white/10 bg-surface p-8"
        >
          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Nom
            </label>
            <input
              type="text"
              name="name"
              defaultValue={product.name}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={product.description}
              required
              rows={5}
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
              defaultValue={product.price}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Catégorie
            </label>
            <select
              name="categoryId"
              defaultValue={product.categoryId}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <ProductImagesEditor initial={initialImages} />

          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-4 font-black text-white shadow-glow hover:bg-accent"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </main>
  );
}
