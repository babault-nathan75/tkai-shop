import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderEmails } from "@/lib/mail";
import {
  buildAdminOrderNotification,
  sendAdminNotification,
} from "@/lib/notifications";

interface OrderItemInput {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderInput {
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  address?: string;
  items: OrderItemInput[];
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Renvoie l'URL de base du site (pour construire les liens dans les emails/notifs).
// 1. PUBLIC_BASE_URL si défini dans .env
// 2. Sinon déduit du host de la requête + protocole
function getBaseUrl(request: Request): string {
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost:3000";
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  let body: OrderInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const customerName = String(body.customerName || "").trim();
  const customerEmail = String(body.customerEmail || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const city = String(body.city || "").trim();
  const address = body.address ? String(body.address).trim() : null;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!customerName || customerName.length < 2)
    return NextResponse.json({ message: "Nom du client requis." }, { status: 400 });
  if (!isValidEmail(customerEmail))
    return NextResponse.json({ message: "Email du client invalide." }, { status: 400 });
  if (!phone || phone.length < 6)
    return NextResponse.json({ message: "Numéro de téléphone requis." }, { status: 400 });
  if (!city)
    return NextResponse.json({ message: "Ville requise." }, { status: 400 });
  if (!items.length)
    return NextResponse.json(
      { message: "Panier vide. Ajoute au moins un article." },
      { status: 400 }
    );

  // Recharge des produits depuis la DB
  const productIds = Array.from(
    new Set(items.map((i) => Number(i.productId)).filter((n) => Number.isFinite(n)))
  );
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  type LineItem = {
    productId: number;
    quantity: number;
    price: number;
    size: string | null;
    color: string | null;
    name: string;
  };

  const lines: LineItem[] = [];
  for (const raw of items) {
    const productId = Number(raw.productId);
    const quantity = Math.max(1, Math.floor(Number(raw.quantity || 1)));
    const product = byId.get(productId);
    if (!product) {
      return NextResponse.json(
        { message: `Produit introuvable (id ${productId})` },
        { status: 400 }
      );
    }
    lines.push({
      productId,
      quantity,
      price: product.price,
      size: raw.size?.toString().trim() || null,
      color: raw.color?.toString().trim() || null,
      name: product.name,
    });
  }

  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const publicRef = randomBytes(12).toString("hex"); // 24 chars

  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      phone,
      city,
      address,
      total,
      publicRef,
      paymentMethod: "manual",
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
          price: l.price,
          size: l.size,
          color: l.color,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  const baseUrl = getBaseUrl(request);
  const trackUrl = `${baseUrl}/track/${publicRef}`;
  const adminUrl = `${baseUrl}/admin/orders/${order.id}`;

  // Notifications email + push admin
  let mailWarning: string | null = null;
  let pushWarning: string | null = null;

  const emailItems = order.items.map((it) => ({
    name: it.product.name,
    quantity: it.quantity,
    price: it.price,
    size: it.size,
    color: it.color,
  }));

  const [mailResult, pushResult] = await Promise.allSettled([
    sendOrderEmails({
      id: order.id,
      publicRef: order.publicRef,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone,
      city: order.city,
      address: order.address,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: emailItems,
      trackUrl,
      adminUrl,
    }),
    sendAdminNotification(
      buildAdminOrderNotification({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        phone: order.phone,
        city: order.city,
        address: order.address,
        total: order.total,
        items: emailItems,
        adminUrl,
      })
    ),
  ]);

  if (mailResult.status === "rejected") {
    const reason =
      mailResult.reason instanceof Error
        ? mailResult.reason.message
        : String(mailResult.reason);
    console.error("[orders] échec envoi mail :", reason);
    mailWarning = `Mail non envoyé : ${reason}`;
  }
  if (pushResult.status === "rejected") {
    const reason =
      pushResult.reason instanceof Error
        ? pushResult.reason.message
        : String(pushResult.reason);
    console.error("[orders] échec ntfy :", reason);
    pushWarning = `Notification push non envoyée : ${reason}`;
  }

  return NextResponse.json(
    {
      success: true,
      orderId: order.id,
      publicRef: order.publicRef,
      trackUrl,
      total: order.total,
      mailWarning,
      pushWarning,
    },
    { status: 201 }
  );
}
