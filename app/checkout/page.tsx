"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Lock, Package } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useClientOrders } from "@/components/ClientOrdersContext";
import { formatPrice } from "@/lib/data";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clear, hydrated } = useCart();
  const { saveOrder } = useClientOrders();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    city: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState<{
    orderId: number;
    publicRef: string | null;
    trackUrl: string | null;
    mailWarning: string | null;
    pushWarning: string | null;
  } | null>(null);

  async function copyTrackLink() {
    if (!success?.trackUrl) return;
    try {
      await navigator.clipboard.writeText(success.trackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Ton panier est vide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            size: it.size,
            color: it.color,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Erreur lors de la commande.");
        setSubmitting(false);
        return;
      }

      // Sauvegarde côté navigateur pour permettre le suivi depuis /track
      if (data.orderId && data.publicRef) {
        const itemsSummary = items
          .slice(0, 3)
          .map((it) => `${it.name} x${it.quantity}`)
          .join(", ")
          + (items.length > 3 ? `, +${items.length - 3} autre(s)` : "");
        saveOrder({
          orderId: data.orderId,
          publicRef: data.publicRef,
          total: data.total ?? totalPrice,
          createdAt: new Date().toISOString(),
          itemsSummary,
        });
      }

      clear();
      setSuccess({
        orderId: data.orderId,
        publicRef: data.publicRef || null,
        trackUrl: data.trackUrl || null,
        mailWarning: data.mailWarning || null,
        pushWarning: data.pushWarning || null,
      });
    } catch {
      setError("Erreur réseau, réessaie.");
      setSubmitting(false);
    }
  }

  if (success) {
    const trackHref = success.publicRef
      ? `/track/${success.publicRef}`
      : "/track";

    return (
      <section className="mx-auto max-w-3xl px-4 py-14 text-white">
        <div className="rounded-3xl border border-primary/30 bg-surface p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-300">
            <Check size={32} strokeWidth={3} />
          </div>

          <p className="mt-6 font-black uppercase tracking-[0.25em] text-primary">
            Commande confirmée
          </p>
          <h1 className="mt-3 text-4xl font-black">
            Commande #{success.orderId} enregistrée
          </h1>
          <p className="mt-4 text-zinc-300">
            Merci pour ta commande ! Notre équipe T-KAI vient d&apos;être
            notifiée et te contactera très rapidement pour finaliser le
            paiement et organiser la livraison.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Un email récapitulatif a été envoyé à l&apos;adresse que tu as
            renseignée.
          </p>

          {success.mailWarning && (
            <p className="mt-6 text-sm text-yellow-400">
              {success.mailWarning}
            </p>
          )}
          {success.pushWarning && (
            <p className="mt-2 text-sm text-yellow-400">
              {success.pushWarning}
            </p>
          )}

          {/* TRACKING SECTION */}
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Package size={18} />
              <p className="font-black uppercase tracking-wider text-xs">
                Suivi de commande
              </p>
            </div>
            <p className="mt-3 text-sm text-zinc-300">
              Garde ce lien pour suivre l&apos;avancement de ta commande à tout
              moment :
            </p>
            {success.trackUrl && (
              <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                <code className="break-all rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-300">
                  {success.trackUrl}
                </code>
                <button
                  onClick={copyTrackLink}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-2 text-xs font-bold hover:border-primary"
                >
                  <Copy size={12} />
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            )}
            <Link
              href={trackHref}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-black text-white shadow-glow transition hover:bg-accent"
            >
              <Package size={16} />
              Suivre ma commande
            </Link>
            <p className="mt-3 text-xs text-zinc-500">
              Ta commande est aussi sauvegardée dans ce navigateur — tu peux y
              accéder à tout moment via &quot;Mes commandes&quot;.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full border border-white/10 px-7 py-4 font-bold hover:border-primary"
            >
              Continuer mes achats
            </Link>
            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-white/10 px-7 py-4 font-bold hover:border-primary"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 text-white md:py-14">
      <Link
        href="/cart"
        className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:text-primary md:mb-6 md:text-sm"
      >
        ← Retour au panier
      </Link>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
          Checkout
        </p>
        <h1 className="mt-1 text-3xl font-black md:mt-2 md:text-5xl">
          Finalise ta commande
        </h1>
        <p className="mt-2 text-sm text-zinc-400 md:mt-3 md:text-base">
          Confirme ta commande et notre équipe te contactera rapidement pour
          finaliser le paiement (Mobile Money, Cash à la livraison...).
        </p>
      </div>

      {hydrated && items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/10 bg-surface p-10 text-center">
          <h2 className="text-2xl font-black">Ton panier est vide</h2>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-4 font-black shadow-glow"
          >
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:mt-10 md:gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="grid gap-3 rounded-2xl border border-white/10 bg-surface p-5 md:gap-4 md:rounded-3xl md:p-8"
          >
            <input
              required
              minLength={2}
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-primary"
              placeholder="Nom complet"
              autoComplete="name"
            />
            <input
              required
              type="email"
              value={form.customerEmail}
              onChange={(e) => updateField("customerEmail", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-primary"
              placeholder="Adresse email"
              autoComplete="email"
            />
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-primary"
              placeholder="Téléphone (ex: 0700000000)"
              autoComplete="tel"
            />
            <input
              required
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-primary"
              placeholder="Ville"
              autoComplete="address-level2"
            />
            <textarea
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-primary"
              placeholder="Adresse complète (optionnel)"
              rows={3}
              autoComplete="street-address"
            />

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !hydrated || items.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow transition hover:bg-accent disabled:opacity-50"
            >
              <Lock size={18} />
              {submitting
                ? "Envoi..."
                : `Confirmer ma commande · ${formatPrice(totalPrice)}`}
            </button>

            <p className="text-center text-xs text-zinc-500">
              Notre équipe te contacte rapidement après confirmation pour
              finaliser le paiement.
            </p>
          </form>

          <aside className="h-fit rounded-3xl border border-white/10 bg-surface p-6">
            <h2 className="text-xl font-black uppercase">Ta commande</h2>
            <div className="mt-6 space-y-3">
              {items.map((it) => (
                <div
                  key={`${it.productId}-${it.size || ""}-${it.color || ""}`}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <div>
                    <p className="font-bold">{it.name}</p>
                    {(it.size || it.color) && (
                      <p className="text-xs text-zinc-500">
                        {[it.size, it.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400">× {it.quantity}</p>
                  </div>
                  <p className="font-black">
                    {formatPrice(it.price * it.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-black uppercase">Total</span>
              <span className="text-2xl font-black text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
