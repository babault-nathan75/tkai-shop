import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  let body: {
    name?: string;
    description?: string | null;
    imageUrl?: string | null;
    featured?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const data: {
    name?: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
    featured?: boolean;
  } = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) {
      return NextResponse.json({ message: "Nom requis" }, { status: 400 });
    }
    data.name = name;
    data.slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  if (body.description !== undefined) {
    data.description = body.description ? String(body.description).trim() : null;
  }
  if (body.imageUrl !== undefined) {
    data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  }
  if (body.featured !== undefined) {
    data.featured = Boolean(body.featured);
  }

  await prisma.category.update({ where: { id: categoryId }, data });

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return NextResponse.json(
      {
        message:
          "Impossible de supprimer : cette catégorie contient encore des produits.",
      },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
  return NextResponse.json({ success: true });
}
