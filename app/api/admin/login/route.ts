import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/auth";

// In-memory rate limiting per IP (best-effort, resets on server reload)
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const attempts = new Map<string, { count: number; first: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.first > ATTEMPT_WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { message: "Trop de tentatives. Réessaie dans quelques minutes." },
      { status: 429 }
    );
  }

  let body: { pseudo?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const pseudo = String(body?.pseudo || "").trim();
  const password = String(body?.password || "");

  if (!pseudo || !password) {
    return NextResponse.json(
      { message: "Identifiants invalides" },
      { status: 401 }
    );
  }

  let admin = await prisma.adminUser.findUnique({ where: { pseudo } });

  // Bootstrap: si aucun AdminUser n'existe encore en DB, on en crée un
  // à partir des variables ADMIN_PSEUDO / ADMIN_PASSWORD du .env.
  // Une fois créé, le .env ADMIN_PASSWORD n'est plus utilisé (DB fait foi).
  if (!admin) {
    const adminCount = await prisma.adminUser.count();
    const envPseudo = process.env.ADMIN_PSEUDO;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (
      adminCount === 0 &&
      envPseudo &&
      envPassword &&
      pseudo === envPseudo &&
      password === envPassword
    ) {
      const passwordHash = await bcrypt.hash(envPassword, 12);
      admin = await prisma.adminUser.create({
        data: { pseudo: envPseudo, passwordHash },
      });
    } else {
      // Compare un hash fictif pour éviter le timing leak
      await bcrypt.compare(password, "$2a$12$invalidsaltinvalidsaltinvalidsaltinval");
      return NextResponse.json(
        { message: "Identifiants invalides" },
        { status: 401 }
      );
    }
  } else {
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { message: "Identifiants invalides" },
        { status: 401 }
      );
    }
  }

  const { token, maxAge } = await createSessionToken(admin.pseudo);

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  // Réinitialise le compteur en cas de succès
  attempts.delete(ip);

  return response;
}
