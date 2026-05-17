import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryImageField } from "@/components/admin/CategoryImageField";

async function createCategory(formData: FormData) {
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

  await prisma.category.create({
    data: { name, slug, description, imageUrl, featured },
  });

  redirect("/admin/categories");
}

export default function NewCategoryPage() {
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
            Admin Panel
          </p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">
            Nouvelle catégorie
          </h1>
        </div>

        <form
          action={createCategory}
          className="space-y-6 rounded-3xl border border-white/10 bg-surface p-8"
        >
          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Nom de la catégorie
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Hoodies"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
              Description (optionnel)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Ex: La collection streetwear inspirée des animes urbains."
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <CategoryImageField />

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="featured"
              defaultChecked
              className="h-4 w-4 accent-primary"
            />
            Afficher cette catégorie en page d&apos;accueil (Collections)
          </label>

          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-accent"
          >
            Créer la catégorie
          </button>
        </form>
      </div>
    </main>
  );
}
