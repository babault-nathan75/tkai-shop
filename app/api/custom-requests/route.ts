import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCustomRequestEmails } from "@/lib/mail";
import {
  buildAdminCustomNotification,
  sendAdminNotification,
} from "@/lib/notifications";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: {
    customerName?: string;
    email?: string;
    phone?: string;
    text?: string;
    fontFamily?: string;
    color?: string;
    product?: string;
    notes?: string;
    imageUrl?: string;
    imageCount?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const customerName = String(body.customerName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = body.phone ? String(body.phone).trim() : "";
  const text = body.text ? String(body.text).trim() : "";
  const fontFamily = body.fontFamily ? String(body.fontFamily).trim() : "";
  const color = body.color ? String(body.color).trim() : "";
  const product = body.product ? String(body.product).trim() : "";
  const notes = body.notes ? String(body.notes).trim() : "";
  const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : "";

  if (!customerName || customerName.length < 2) {
    return NextResponse.json({ message: "Nom requis." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Email invalide." }, { status: 400 });
  }

  await prisma.customizationRequest.create({
    data: {
      customerName,
      email,
      phone: phone || null,
      text: text || null,
      color: color || null,
      notes: notes || null,
      imageUrl: imageUrl || null,
    },
  });

  const fullNotes = [
    notes,
    product ? `Produit: ${product}` : null,
    fontFamily ? `Police: ${fontFamily}` : null,
    body.imageCount ? `${body.imageCount} image(s) uploadée(s)` : null,
  ]
    .filter(Boolean)
    .join("\n");

  // ── Fire-and-forget : emails + push notifications ──
  Promise.allSettled([
    sendCustomRequestEmails({
      customerName,
      email,
      phone,
      text,
      color,
      notes: fullNotes,
      imageUrl,
    }),
    sendAdminNotification(
      buildAdminCustomNotification({
        customerName,
        email,
        phone,
        text,
        color,
        notes: fullNotes,
      })
    ),
  ]).catch(() => {});

  return NextResponse.json(
    { success: true },
    { status: 201 }
  );
}
