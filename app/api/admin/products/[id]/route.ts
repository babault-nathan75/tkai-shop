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
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  let body: {
    name?: string;
    description?: string;
    price?: number;
    salePrice?: number | null;
    saleEndsAt?: string | null;
    image?: string;
    categoryId?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const data: {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    salePrice?: number | null;
    saleEndsAt?: Date | null;
    categoryId?: number;
  } = {};
  if (body.name) {
    const name = String(body.name).trim();
    data.name = name;
    data.slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  if (body.description !== undefined)
    data.description = String(body.description);
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isInteger(price) || price <= 0) {
      return NextResponse.json({ message: "Prix invalide" }, { status: 400 });
    }
    data.price = price;
  }
  if (body.salePrice !== undefined || body.saleEndsAt !== undefined) {
    const salePrice =
      body.salePrice == null ? null : Number(body.salePrice);
    const saleEndsAt = body.saleEndsAt ? new Date(body.saleEndsAt) : null;
    const currentPrice =
      data.price ??
      (
        await prisma.product.findUnique({
          where: { id: productId },
          select: { price: true },
        })
      )?.price;
    if (
      (salePrice !== null &&
        (!Number.isInteger(salePrice) ||
          salePrice <= 0 ||
          currentPrice === undefined ||
          salePrice >= currentPrice)) ||
      (saleEndsAt && (!Number.isFinite(saleEndsAt.getTime()) || saleEndsAt <= new Date())) ||
      Boolean(salePrice) !== Boolean(saleEndsAt)
    ) {
      return NextResponse.json({ message: "Promotion invalide" }, { status: 400 });
    }
    data.salePrice = salePrice;
    data.saleEndsAt = saleEndsAt;
  }
  if (body.categoryId !== undefined) data.categoryId = Number(body.categoryId);

  await prisma.product.update({ where: { id: productId }, data });

  if (body.image) {
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.create({
      data: {
        productId,
        url: String(body.image),
        alt: data.name || "Produit",
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  // Empêche la suppression si le produit est référencé par des commandes
  const orderItems = await prisma.orderItem.count({ where: { productId } });
  if (orderItems > 0) {
    return NextResponse.json(
      {
        message:
          "Impossible de supprimer : ce produit est lié à des commandes existantes.",
      },
      { status: 409 }
    );
  }

  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ success: true });
}
