import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// POST /api/admin/reset?scope=demo
// Supprime toutes les catégories et tous les produits.
// Ne touche pas aux commandes existantes (le FK Order->OrderItem->Product
// empêcherait la suppression de produits commandés). Seuls les produits SANS
// commandes sont supprimés ; les catégories vides sont supprimées.
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const url = new URL(request.url);
  const scope = url.searchParams.get("scope");

  if (scope !== "demo") {
    return NextResponse.json(
      { message: "Scope requis : ?scope=demo" },
      { status: 400 }
    );
  }

  // Produits sans commandes uniquement
  const removableProducts = await prisma.product.findMany({
    where: { orderItems: { none: {} } },
    select: { id: true },
  });
  const removableIds = removableProducts.map((p) => p.id);

  await prisma.product.deleteMany({
    where: { id: { in: removableIds } },
  });

  // Catégories vides uniquement
  const removableCategories = await prisma.category.findMany({
    where: { products: { none: {} } },
    select: { id: true },
  });
  await prisma.category.deleteMany({
    where: { id: { in: removableCategories.map((c) => c.id) } },
  });

  const remainingProducts = await prisma.product.count();
  const remainingCategories = await prisma.category.count();

  return NextResponse.json({
    success: true,
    deletedProducts: removableIds.length,
    deletedCategories: removableCategories.length,
    remainingProducts,
    remainingCategories,
  });
}
