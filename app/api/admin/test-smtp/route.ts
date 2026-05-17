import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { verifySmtp } from "@/lib/mail";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// GET  → vérifie juste la connexion SMTP (verify())
// POST → envoie un vrai mail de test à ADMIN_EMAIL
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  const result = await verifySmtp();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, message: "Connexion SMTP OK." });
}

export async function POST() {
  const guard = await requireAdmin();
  if (guard) return guard;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.ADMIN_EMAIL;

  if (!host || !user || !pass) {
    return NextResponse.json(
      { ok: false, error: "Configuration SMTP incomplète (SMTP_HOST/USER/PASSWORD)." },
      { status: 400 }
    );
  }
  if (!to) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_EMAIL manquant dans .env." },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    await transporter.verify();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        step: "verify",
        error: msg,
        hint: smtpHint(msg),
      },
      { status: 502 }
    );
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "T-KAI · Test SMTP",
      text: "Si tu lis ce message, ta configuration SMTP fonctionne 🎉",
      html: `<p>Si tu lis ce message, ta configuration SMTP fonctionne 🎉</p>
             <p style="color:#666;font-size:12px">Envoyé depuis /api/admin/test-smtp</p>`,
    });
    return NextResponse.json({
      ok: true,
      messageId: info.messageId,
      to,
      from,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        step: "sendMail",
        error: msg,
        hint: smtpHint(msg),
      },
      { status: 502 }
    );
  }
}

function smtpHint(error: string): string {
  const e = error.toLowerCase();
  if (e.includes("invalid login") || e.includes("authentication failed") || e.includes("535")) {
    return "Identifiants Gmail invalides. Vérifie : (1) la 2FA est activée sur le compte, (2) SMTP_PASSWORD est un App Password (16 caractères) et pas ton vrai mot de passe.";
  }
  if (e.includes("etimedout") || e.includes("timeout")) {
    return "Timeout réseau. Vérifie ta connexion ou que ton FAI ne bloque pas le port 587.";
  }
  if (e.includes("eauth") || e.includes("username and password not accepted")) {
    return "Gmail a rejeté tes identifiants. Re-crée un App Password sur https://myaccount.google.com/apppasswords.";
  }
  if (e.includes("self signed certificate") || e.includes("ssl")) {
    return "Problème SSL/TLS. Essaie de passer SMTP_PORT à 465 (secure) ou vérifie le firewall.";
  }
  return "Vérifie ta config SMTP dans .env (host, port, user, password).";
}
