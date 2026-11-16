"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Lock, Package } from "lucide-react";
import { getCartItemPrice, useCart } from "@/components/CartContext";
import { useClientOrders } from "@/components/ClientOrdersContext";
import { formatPrice } from "@/lib/data";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, now, clear, hydrated } = useCart();
  const { saveOrder } = useClientOrders();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    city: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState<{
    orderId: number;
    publicRef: string | null;
    trackUrl: string | null;
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

    // Snapshot des données avant le transition
    const orderPayload = {
      ...form,
      items: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        size: it.size,
        color: it.color,
      })),
    };
    const orderItems = [...items];
    const orderTotal = totalPrice;

    // Optimistic : on vide le panier et affiche le succès immédiatement
    startTransition(async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.message || "Erreur lors de la commande.");
          return;
        }

        if (data.orderId && data.publicRef) {
          const itemsSummary =
            orderItems
              .slice(0, 3)
              .map((it) => `${it.name} x${it.quantity}`)
              .join(", ") +
            (orderItems.length > 3 ? `, +${orderItems.length - 3} autre(s)` : "");
          saveOrder({
            orderId: data.orderId,
            publicRef: data.publicRef,
            total: data.total ?? orderTotal,
            createdAt: new Date().toISOString(),
            itemsSummary,
          });
        }

        clear();
        setSuccess({
          orderId: data.orderId,
          publicRef: data.publicRef || null,
          trackUrl: data.trackUrl || null,
        });
      } catch {
        setError("Erreur réseau, réessaie.");
      }
    });
  }

  if (success) {
    const trackHref = success.publicRef
      ? `/track/${success.publicRef}`
      : "/track";

    return (
      <section className="mx-auto max-w-4xl px-4 py-10 text-white md:py-20">
        <div className="paper-noise rounded-[1.5rem] px-5 py-10 text-center text-ink shadow-paper md:rounded-[2rem] md:px-12 md:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-700/10 text-green-800">
            <Check size={32} strokeWidth={3} />
          </div>

          <p className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-primary">
            Commande confirmée · #{success.orderId}
          </p>
          <h1 className="display-type text-balance mt-3 text-4xl leading-[.98] md:text-6xl">
            C&apos;est dans la boîte.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/65">
            Merci pour ta commande ! Notre équipe T-KAI vient d&apos;être
            notifiée et te contactera très rapidement pour finaliser le
            paiement et organiser la livraison.
          </p>

          <div className="mt-8 rounded-2xl border border-ink/10 bg-white/40 p-5 md:mt-10 md:p-7">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Package size={18} />
              <p className="font-black uppercase tracking-wider text-xs">
                Suivi de commande
              </p>
            </div>
            <p className="mt-3 text-sm text-ink/65">
              Garde ce lien pour suivre l&apos;avancement de ta commande à tout
              moment :
            </p>
            {success.trackUrl && (
              <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                <code className="break-all rounded-lg border border-ink/10 bg-white/70 px-3 py-2 text-xs text-ink/70">
                  {success.trackUrl}
                </code>
                <button
                  onClick={copyTrackLink}
                  className="inline-flex min-h-10 items-center gap-1 rounded-full border border-ink/15 px-3 py-2 text-xs font-bold text-ink transition hover:border-primary"
                >
                  <Copy size={12} />
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            )}
            <Link
              href={trackHref}
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-[10px] font-black uppercase tracking-[.14em] text-white transition hover:bg-primary"
            >
              <Package size={16} />
              Suivre ma commande
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full border border-ink/15 px-6 py-3 text-[10px] font-black uppercase tracking-[.14em] text-ink/65 transition hover:border-ink hover:text-ink"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 text-white md:px-8 md:py-14">
      <Link
        href="/cart"
        className="mb-6 inline-flex min-h-10 items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-zinc-500 transition hover:text-white md:mb-8"
      >
        ← Retour au panier
      </Link>

      <div className="border-b border-white/10 pb-6 md:pb-8">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-primary">
          Dernière étape
        </p>
        <h1 className="display-type text-balance mt-3 text-4xl leading-[.98] text-foreground md:text-6xl">
          On te garde ces pièces.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 md:mt-5 md:text-base">
          Confirme ta commande et notre équipe te contactera rapidement pour
          finaliser le paiement (Mobile Money, Cash à la livraison...).
        </p>
      </div>

      {hydrated && items.length === 0 ? (
        <div className="paper-noise mt-10 rounded-[1.5rem] px-6 py-14 text-center text-ink">
          <h2 className="display-type text-3xl">Il manque une pièce.</h2>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-[10px] font-black uppercase tracking-[.14em] text-white transition hover:bg-primary"
          >
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid items-start gap-6 md:mt-9 md:gap-10 lg:grid-cols-[1fr_370px]">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-surface p-5 md:gap-5 md:p-8"
          >
            <div className="sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-primary">Tes informations</p>
              <p className="mt-2 text-sm text-zinc-500">Pour qu&apos;on prépare ta commande et qu&apos;on te recontacte.</p>
            </div>
            <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">
              Nom complet
              <input
                required
                minLength={2}
                value={form.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                className="min-h-12 rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                placeholder="Ex. Aïcha Koné"
                autoComplete="name"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">
              Adresse e-mail
              <input
                required
                type="email"
                value={form.customerEmail}
                onChange={(e) => updateField("customerEmail", e.target.value)}
                className="min-h-12 rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                placeholder="toi@exemple.com"
                autoComplete="email"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">
              Téléphone
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="min-h-12 rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                placeholder="+225 07 00 00 00 00"
                autoComplete="tel"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">
              Ville
              <input
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="min-h-12 rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                placeholder="Ex. Abidjan"
                autoComplete="address-level2"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400 sm:col-span-2">
              Adresse de livraison <span className="font-medium normal-case tracking-normal text-zinc-600">(facultatif)</span>
              <textarea
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                placeholder="Quartier, rue, repère…"
                rows={3}
                autoComplete="street-address"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 sm:col-span-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !hydrated || items.length === 0}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-primary px-5 text-[10px] font-black uppercase tracking-[.12em] text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
            >
              <Lock size={18} />
              {isPending
                ? "Envoi en cours..."
                : `Confirmer ma commande · ${formatPrice(totalPrice)}`}
            </button>

            <p className="text-center text-xs leading-5 text-zinc-600 sm:col-span-2">
              Notre équipe te contacte rapidement après confirmation pour
              finaliser le paiement.
            </p>
          </form>

          <aside className="h-fit overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface2 p-5 md:sticky md:top-32 md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-primary">Ta sélection</p>
            <h2 className="display-type mt-2 text-3xl text-foreground">Dans le colis.</h2>
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
                  <p className="text-right font-black text-foreground">
                    {formatPrice(getCartItemPrice(it, now) * it.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[10px] font-black uppercase tracking-[.15em] text-zinc-500">Total</span>
              <span className="text-2xl font-black text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
