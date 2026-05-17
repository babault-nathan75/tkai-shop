import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
] as const;

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const status = String(body.status || "");
  if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ message: "Statut invalide" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as (typeof ALLOWED_STATUSES)[number] },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  await prisma.order.delete({ where: { id: orderId } });
  return NextResponse.json({ success: true });
}
