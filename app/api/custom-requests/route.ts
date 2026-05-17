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
    color?: string;
    notes?: string;
    imageUrl?: string;
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
  const color = body.color ? String(body.color).trim() : "";
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

  let mailWarning: string | null = null;
  let pushWarning: string | null = null;

  const [mailResult, pushResult] = await Promise.allSettled([
    sendCustomRequestEmails({
      customerName,
      email,
      phone,
      text,
      color,
      notes,
      imageUrl,
    }),
    sendAdminNotification(
      buildAdminCustomNotification({
        customerName,
        email,
        phone,
        text,
        color,
        notes,
      })
    ),
  ]);

  if (mailResult.status === "rejected") {
    console.error("Erreur envoi email custom-lab:", mailResult.reason);
    mailWarning =
      "Demande enregistrée, mais l'envoi du mail a échoué (config SMTP).";
  }
  if (pushResult.status === "rejected") {
    console.error("Erreur notification ntfy custom-lab:", pushResult.reason);
    pushWarning =
      "Notification push admin non envoyée (vérifie NTFY_TOPIC).";
  }

  return NextResponse.json(
    { success: true, mailWarning, pushWarning },
    { status: 201 }
  );
}
