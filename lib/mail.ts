import nodemailer, { type Transporter } from "nodemailer";
import { getShopWaLink } from "./notifications";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      "Configuration SMTP manquante (SMTP_HOST, SMTP_USER, SMTP_PASSWORD). Vérifie ton .env."
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    // Évite les hangs silencieux : on borne les timeouts.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return cachedTransporter;
}

// Vérifie la connexion SMTP (utile pour /api/admin/test-smtp).
export async function verifySmtp(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const t = getTransporter();
    await t.verify();
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v) + " FCFA";
}

interface OrderEmailPayload {
  id: number;
  publicRef?: string | null;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  address?: string | null;
  total: number;
  status: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
  }[];
  createdAt: Date;
  // URLs absolues construites côté serveur (host runtime)
  trackUrl?: string | null;
  adminUrl?: string | null;
}

function escapeHtml(str: string | null | undefined): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderItems(items: OrderEmailPayload["items"]): string {
  return items
    .map(
      (it) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#fff">
            <strong>${escapeHtml(it.name)}</strong>
            ${
              it.size || it.color
                ? `<br><span style="color:#999;font-size:12px">${escapeHtml([it.size, it.color].filter(Boolean).join(" · "))}</span>`
                : ""
            }
          </td>
          <td style="padding:10px;border-bottom:1px solid #2a2a2a;text-align:center;color:#bbb">${it.quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #2a2a2a;text-align:right;color:#bbb">${formatPrice(it.price)}</td>
          <td style="padding:10px;border-bottom:1px solid #2a2a2a;text-align:right;color:#fff"><strong>${formatPrice(it.price * it.quantity)}</strong></td>
        </tr>`
    )
    .join("");
}

function statusLabel(status: string): string {
  switch (status) {
    case "confirmed":
      return "Confirmée";
    case "delivered":
      return "Livrée";
    case "cancelled":
      return "Annulée";
    default:
      return "En attente de confirmation";
  }
}

function clientHtml(order: OrderEmailPayload): string {
  const waLink = getShopWaLink(
    `Bonjour T-KAI, je viens de passer la commande #${order.id}.`
  );

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#050505;padding:24px;color:#fff">
    <div style="max-width:640px;margin:0 auto;background:#0f0f0f;border:1px solid #222;border-radius:16px;overflow:hidden">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#D61F1F 0%,#7a0000 100%);padding:28px 32px">
        <p style="margin:0;color:#fff;font-size:11px;letter-spacing:3px;font-weight:bold">T-KAI · OTAKU STREETWEAR</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:26px">Merci, ${escapeHtml(order.customerName)} !</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px">
          Commande <strong>#${order.id}</strong> reçue le ${order.createdAt.toLocaleString("fr-FR")}
        </p>
      </div>

      <div style="padding:28px 32px">
        <p style="color:#bbb;margin:0 0 16px;line-height:1.5">
          Nous avons bien reçu ta commande. Notre équipe te contactera très rapidement
          (téléphone ou WhatsApp) pour confirmer le mode de paiement et la livraison.
        </p>

        <!-- STATUS -->
        <div style="background:#1a1a1a;border-left:4px solid #fbbf24;padding:14px 18px;border-radius:8px;margin-bottom:24px">
          <p style="margin:0;color:#fbbf24;font-size:12px;letter-spacing:2px;font-weight:bold">STATUT</p>
          <p style="margin:4px 0 0;color:#fff;font-size:16px;font-weight:bold">${statusLabel(order.status)}</p>
        </div>

        ${
          order.trackUrl
            ? `<p style="margin:0 0 24px"><a href="${order.trackUrl}" style="display:inline-block;background:#D61F1F;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:999px">📦 Suivre ma commande</a></p>`
            : ""
        }

        <!-- ITEMS -->
        <h2 style="color:#fff;font-size:14px;letter-spacing:2px;margin:0 0 12px">DÉTAILS DE LA COMMANDE</h2>
        <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:10px;overflow:hidden">
          <thead>
            <tr style="background:#222">
              <th style="padding:10px;text-align:left;color:#bbb;font-size:11px;letter-spacing:1px">PRODUIT</th>
              <th style="padding:10px;color:#bbb;font-size:11px;letter-spacing:1px">QTÉ</th>
              <th style="padding:10px;text-align:right;color:#bbb;font-size:11px;letter-spacing:1px">PRIX</th>
              <th style="padding:10px;text-align:right;color:#bbb;font-size:11px;letter-spacing:1px">TOTAL</th>
            </tr>
          </thead>
          <tbody>${renderItems(order.items)}</tbody>
          <tfoot>
            <tr style="background:#222">
              <td colspan="3" style="padding:14px;text-align:right;color:#fff;font-weight:bold">Total à payer</td>
              <td style="padding:14px;text-align:right;color:#D61F1F;font-weight:bold;font-size:18px">${formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- LIVRAISON -->
        <h2 style="color:#fff;font-size:14px;letter-spacing:2px;margin:28px 0 12px">LIVRAISON</h2>
        <div style="background:#1a1a1a;border-radius:10px;padding:16px 18px;color:#ddd;line-height:1.6">
          <p style="margin:0"><strong style="color:#fff">${escapeHtml(order.customerName)}</strong></p>
          <p style="margin:4px 0 0">📍 ${escapeHtml(order.city)}${order.address ? " — " + escapeHtml(order.address) : ""}</p>
          <p style="margin:4px 0 0">📞 ${escapeHtml(order.phone)}</p>
          <p style="margin:4px 0 0">✉️ ${escapeHtml(order.customerEmail)}</p>
        </div>

        ${
          waLink
            ? `<p style="margin:28px 0 0;text-align:center"><a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:999px">💬 Nous écrire sur WhatsApp</a></p>`
            : ""
        }

        <p style="margin:32px 0 0;color:#666;font-size:11px;text-align:center;line-height:1.6">
          T-KAI Studio · Otaku streetwear · Côte d'Ivoire<br>
          Si tu as une question, réponds simplement à cet email.
        </p>
      </div>
    </div>
  </div>`;
}

function adminHtml(order: OrderEmailPayload): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;padding:24px;background:#f5f5f5">
    <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <div style="background:#D61F1F;padding:20px 28px;color:#fff">
        <p style="margin:0;font-size:11px;letter-spacing:3px;font-weight:bold;opacity:0.9">T-KAI ADMIN</p>
        <h1 style="margin:6px 0 0;font-size:22px">🛒 Nouvelle commande #${order.id}</h1>
        <p style="margin:6px 0 0;font-size:13px;opacity:0.9">${order.createdAt.toLocaleString("fr-FR")}</p>
      </div>

      <div style="padding:24px 28px">

        ${
          order.adminUrl
            ? `<p style="margin:0 0 20px"><a href="${order.adminUrl}" style="display:inline-block;background:#D61F1F;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:8px;font-size:14px">→ Ouvrir la commande dans l'admin</a></p>`
            : ""
        }

        <h2 style="margin:0 0 8px;font-size:13px;letter-spacing:1px;color:#888">CLIENT</h2>
        <div style="background:#fafafa;border-radius:8px;padding:14px 18px;line-height:1.7">
          <p style="margin:0"><strong>${escapeHtml(order.customerName)}</strong></p>
          <p style="margin:0">📞 <a href="tel:${escapeHtml(order.phone)}" style="color:#D61F1F">${escapeHtml(order.phone)}</a></p>
          <p style="margin:0">✉️ <a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#D61F1F">${escapeHtml(order.customerEmail)}</a></p>
          <p style="margin:0">📍 ${escapeHtml(order.city)}${order.address ? " — " + escapeHtml(order.address) : ""}</p>
        </div>

        <h2 style="margin:24px 0 8px;font-size:13px;letter-spacing:1px;color:#888">ARTICLES</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">
          <thead>
            <tr style="background:#fafafa">
              <th style="padding:10px;text-align:left;font-size:12px;color:#666">Produit</th>
              <th style="padding:10px;font-size:12px;color:#666">Qté</th>
              <th style="padding:10px;text-align:right;font-size:12px;color:#666">Prix</th>
              <th style="padding:10px;text-align:right;font-size:12px;color:#666">Total</th>
            </tr>
          </thead>
          <tbody>${order.items
            .map(
              (it) => `
            <tr>
              <td style="padding:10px;border-top:1px solid #eee">
                <strong>${escapeHtml(it.name)}</strong>
                ${
                  it.size || it.color
                    ? `<br><span style="color:#888;font-size:12px">${escapeHtml([it.size, it.color].filter(Boolean).join(" · "))}</span>`
                    : ""
                }
              </td>
              <td style="padding:10px;border-top:1px solid #eee;text-align:center">${it.quantity}</td>
              <td style="padding:10px;border-top:1px solid #eee;text-align:right">${formatPrice(it.price)}</td>
              <td style="padding:10px;border-top:1px solid #eee;text-align:right"><strong>${formatPrice(it.price * it.quantity)}</strong></td>
            </tr>`
            )
            .join("")}
          </tbody>
          <tfoot>
            <tr style="background:#fafafa">
              <td colspan="3" style="padding:12px;text-align:right;font-weight:bold">TOTAL</td>
              <td style="padding:12px;text-align:right;color:#D61F1F;font-weight:bold;font-size:16px">${formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <h2 style="margin:24px 0 8px;font-size:13px;letter-spacing:1px;color:#888">STATUT</h2>
        <div style="background:#fff3cd;border-left:4px solid #fbbf24;padding:10px 14px;border-radius:6px">
          <p style="margin:0;font-weight:bold">${statusLabel(order.status)}</p>
          <p style="margin:4px 0 0;color:#666;font-size:13px">Paiement à finaliser avec le client.</p>
        </div>

      </div>
    </div>
  </div>`;
}

export async function sendOrderEmails(order: OrderEmailPayload): Promise<void> {
  const from =
    process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@t-kai.com";
  const adminTo = process.env.ADMIN_EMAIL;

  if (!adminTo) {
    throw new Error("ADMIN_EMAIL manquant dans .env");
  }

  const transporter = getTransporter();

  // Envois SÉQUENTIELS plutôt qu'en parallèle : si Gmail bloque, on a un log
  // précis de quel mail a échoué (client vs admin) au lieu de tout planter d'un coup.
  try {
    console.log(
      `[mail] → envoi mail client à ${order.customerEmail} (commande #${order.id})`
    );
    const infoClient = await transporter.sendMail({
      from,
      to: order.customerEmail,
      subject: `T-KAI · Confirmation de commande #${order.id}`,
      html: clientHtml(order),
    });
    console.log(
      `[mail] ✓ mail client envoyé. messageId=${infoClient.messageId}`
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[mail] ✗ ÉCHEC mail client : ${msg}`);
    throw new Error(`Mail client échoué : ${msg}`);
  }

  try {
    console.log(`[mail] → envoi mail admin à ${adminTo}`);
    const infoAdmin = await transporter.sendMail({
      from,
      to: adminTo,
      subject: `🛒 Commande T-KAI #${order.id} — ${order.customerName}`,
      html: adminHtml(order),
    });
    console.log(`[mail] ✓ mail admin envoyé. messageId=${infoAdmin.messageId}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[mail] ✗ ÉCHEC mail admin : ${msg}`);
    throw new Error(`Mail admin échoué : ${msg}`);
  }
}

interface CustomRequestPayload {
  customerName: string;
  email: string;
  phone?: string;
  text?: string;
  color?: string;
  notes?: string;
  imageUrl?: string;
}

export async function sendCustomRequestEmails(
  payload: CustomRequestPayload
): Promise<void> {
  const from =
    process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@t-kai.com";
  const adminTo = process.env.ADMIN_EMAIL;
  if (!adminTo) throw new Error("ADMIN_EMAIL manquant dans .env");

  const transporter = getTransporter();

  const html = `
    <div style="font-family:Arial,sans-serif;padding:24px">
      <h1 style="color:#D61F1F">Nouvelle demande Custom Lab</h1>
      <p><strong>Client :</strong> ${escapeHtml(payload.customerName)} (${escapeHtml(payload.email)})</p>
      ${payload.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</p>` : ""}
      ${payload.text ? `<p><strong>Texte :</strong> ${escapeHtml(payload.text)}</p>` : ""}
      ${payload.color ? `<p><strong>Couleur :</strong> ${escapeHtml(payload.color)}</p>` : ""}
      ${payload.notes ? `<p><strong>Notes :</strong><br>${escapeHtml(payload.notes)}</p>` : ""}
    </div>`;

  const waLink = getShopWaLink(
    `Bonjour T-KAI, je viens d'envoyer une demande Custom Lab.`
  );
  const waBlock = waLink
    ? `<p style="margin:16px 0"><a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:999px">💬 Nous écrire sur WhatsApp</a></p>`
    : "";

  try {
    console.log(`[mail] → envoi mail custom client à ${payload.email}`);
    await transporter.sendMail({
      from,
      to: payload.email,
      subject: "T-KAI · Ta demande de personnalisation est reçue",
      html: `<p>Bonjour ${escapeHtml(payload.customerName)},</p>
             <p>Nous avons bien reçu ta demande Custom Lab. Notre équipe revient vers toi très vite.</p>${waBlock}${html}`,
    });
    console.log(`[mail] ✓ mail custom client envoyé`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[mail] ✗ ÉCHEC mail custom client : ${msg}`);
    throw new Error(`Mail custom client échoué : ${msg}`);
  }

  try {
    console.log(`[mail] → envoi mail custom admin à ${adminTo}`);
    await transporter.sendMail({
      from,
      to: adminTo,
      subject: `Custom Lab — Demande de ${payload.customerName}`,
      html,
    });
    console.log(`[mail] ✓ mail custom admin envoyé`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[mail] ✗ ÉCHEC mail custom admin : ${msg}`);
    throw new Error(`Mail custom admin échoué : ${msg}`);
  }
}
