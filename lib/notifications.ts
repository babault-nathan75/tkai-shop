// Notifications admin via ntfy.sh (gratuit, illimité, instantané)
// + lien wa.me cliquable côté client pour joindre le shop sur WhatsApp.

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function getShopWaLink(message?: string): string | null {
  const phone = process.env.SHOP_WHATSAPP_PHONE;
  if (!phone) return null;
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const url = new URL(`https://wa.me/${normalized}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}

// Construit un lien wa.me avec le RÉCAP COMPLET de la commande dans le message,
// pour que le client puisse finaliser le paiement directement avec l'équipe.
export function buildOrderCheckoutWaLink(order: {
  id: number;
  customerName: string;
  phone: string;
  city: string;
  address?: string | null;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
  }[];
}): string | null {
  const phone = process.env.SHOP_WHATSAPP_PHONE;
  if (!phone) return null;
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat("fr-FR").format(v) + " FCFA";

  const articleLines = order.items
    .map((it) => {
      const opts = [it.size, it.color].filter(Boolean).join(" / ");
      const optsTxt = opts ? ` (${opts})` : "";
      return `• ${it.name}${optsTxt} x${it.quantity} — ${fmt(it.price * it.quantity)}`;
    })
    .join("\n");

  const lines = [
    `Bonjour T-KAI 👋`,
    ``,
    `Je viens de passer la commande *#${order.id}* sur le site.`,
    `Je voudrais finaliser le paiement.`,
    ``,
    `*Mes articles :*`,
    articleLines,
    ``,
    `*Total : ${fmt(order.total)}*`,
    ``,
    `*Mes infos de livraison :*`,
    `Nom : ${order.customerName}`,
    `Téléphone : ${order.phone}`,
    `Ville : ${order.city}`,
    order.address ? `Adresse : ${order.address}` : null,
    ``,
    `Merci !`,
  ]
    .filter(Boolean)
    .join("\n");

  const url = new URL(`https://wa.me/${normalized}`);
  url.searchParams.set("text", lines);
  return url.toString();
}

interface NotificationOptions {
  title: string;
  body: string;
  priority?: "min" | "low" | "default" | "high" | "urgent";
  tags?: string[];
  clickUrl?: string;
}

// ASCII-safe encoding pour les headers ntfy (RFC 2047 fallback).
function asciiSafe(s: string): string {
  // Suffit dans 99% des cas : on retire les diacritiques.
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E]/g, "?");
}

export async function sendAdminNotification(
  opts: NotificationOptions
): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  const server = (process.env.NTFY_SERVER || "https://ntfy.sh").replace(
    /\/$/,
    ""
  );

  if (!topic) {
    throw new Error(
      "NTFY_TOPIC manquant dans .env (notifications admin désactivées)."
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    Title: asciiSafe(opts.title),
    Priority: opts.priority || "high",
  };
  if (opts.tags?.length) headers.Tags = opts.tags.join(",");
  if (opts.clickUrl) headers.Click = opts.clickUrl;

  const res = await fetch(`${server}/${encodeURIComponent(topic)}`, {
    method: "POST",
    headers,
    body: opts.body,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Échec notification ntfy (HTTP ${res.status}) : ${body.slice(0, 200)}`
    );
  }
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v) + " FCFA";
}

export function buildAdminOrderNotification(order: {
  id: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  address?: string | null;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
  }[];
  adminUrl?: string | null;
}): NotificationOptions {
  const lines = order.items
    .map((it) => {
      const opts = [it.size, it.color].filter(Boolean).join(" / ");
      const optsTxt = opts ? ` (${opts})` : "";
      return `  - ${it.name}${optsTxt} x${it.quantity} = ${formatPrice(it.price * it.quantity)}`;
    })
    .join("\n");

  return {
    title: `T-KAI: Commande #${order.id} - ${formatPrice(order.total)}`,
    body: [
      `Client : ${order.customerName}`,
      `Tel : ${order.phone}`,
      `Email : ${order.customerEmail}`,
      `Ville : ${order.city}`,
      order.address ? `Adresse : ${order.address}` : null,
      ``,
      `Articles :`,
      lines,
      ``,
      `Total : ${formatPrice(order.total)}`,
      ``,
      order.adminUrl ? `Voir la commande : ${order.adminUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    priority: "high",
    tags: ["shopping_cart"],
    clickUrl: order.adminUrl || undefined,
  };
}

export function buildAdminCustomNotification(payload: {
  customerName: string;
  email: string;
  phone?: string;
  text?: string;
  color?: string;
  notes?: string;
}): NotificationOptions {
  return {
    title: "T-KAI: Nouvelle demande Custom Lab",
    body: [
      `Client : ${payload.customerName}`,
      payload.phone ? `Tel : ${payload.phone}` : null,
      `Email : ${payload.email}`,
      payload.text ? `Texte : ${payload.text}` : null,
      payload.color ? `Couleur : ${payload.color}` : null,
      payload.notes ? `Notes : ${payload.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    priority: "default",
    tags: ["art"],
  };
}
