import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryImageField } from "@/components/admin/CategoryImageField";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditPageProps) {
  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) notFound();

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) notFound();

  async function updateCategory(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    if (!name) return;
    const description =
      String(formData.get("description") || "").trim() || null;
    const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
    const featured = formData.get("featured") === "on";

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, description, imageUrl, featured },
    });
    redirect("/admin/categories");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/categories"
          className="text-sm uppercase tracking-wider text-zinc-500 hover:text-primary"
        >
          ← Catégories
        </Link>
        <div className="mt-2 mb-10">
          <p className="font-black uppercase tracking-[0.25em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">
            Modifier catégorie
          </h1>
        </div>

        <form
          action={updateCategory}
          className="space-y-6 rounded-3xl border border-white/10 bg-surface p-8"
        >
          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Nom
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={category.name}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category.description || ""}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <CategoryImageField initialUrl={category.imageUrl || ""} />

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={category.featured}
              className="h-4 w-4 accent-primary"
            />
            Afficher en page d&apos;accueil
          </label>

          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow hover:bg-accent"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </main>
  );
}
