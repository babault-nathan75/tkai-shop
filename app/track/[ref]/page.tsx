import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Package, Truck, X } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ ref: string }>;
}

function fmtPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v) + " FCFA";
}

const STEPS = [
  { key: "pending", label: "Commande reçue", icon: Clock },
  { key: "confirmed", label: "Confirmée", icon: Check },
  { key: "delivered", label: "Livrée", icon: Truck },
] as const;

function getStepIndex(status: string): number {
  switch (status) {
    case "confirmed":
      return 1;
    case "delivered":
      return 2;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

export default async function TrackPage({ params }: PageProps) {
  const { ref } = await params;
  if (!ref || ref.length < 8) notFound();

  const order = await prisma.order.findUnique({
    where: { publicRef: ref },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const stepIndex = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-white md:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
          Suivi de commande
        </p>
        <h1 className="mt-1 text-3xl font-black md:mt-2 md:text-5xl">
          Commande #{order.id}
        </h1>
        <p className="mt-1 text-xs text-zinc-500 md:mt-2 md:text-sm">
          Passée le {new Date(order.createdAt).toLocaleString("fr-FR")}
        </p>

        {/* STATUS BANNER */}
        <div
          className={`mt-8 rounded-3xl border p-6 ${
            isCancelled
              ? "border-red-500/30 bg-red-500/5"
              : stepIndex === 2
              ? "border-green-500/30 bg-green-500/5"
              : "border-yellow-500/30 bg-yellow-500/5"
          }`}
        >
          <div className="flex items-start gap-4">
            {isCancelled ? (
              <X size={28} className="text-red-400" />
            ) : stepIndex === 2 ? (
              <Check size={28} className="text-green-400" />
            ) : (
              <Clock size={28} className="text-yellow-400" />
            )}
            <div>
              <p
                className={`text-xs font-black uppercase tracking-[0.25em] ${
                  isCancelled
                    ? "text-red-300"
                    : stepIndex === 2
                    ? "text-green-300"
                    : "text-yellow-300"
                }`}
              >
                Statut actuel
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {isCancelled
                  ? "Commande annulée"
                  : stepIndex === 2
                  ? "Commande livrée"
                  : stepIndex === 1
                  ? "Commande confirmée"
                  : "En attente de confirmation"}
              </h2>
              <p className="mt-2 text-sm text-zinc-300">
                {isCancelled
                  ? "Cette commande a été annulée. Pour toute question, contacte notre équipe."
                  : stepIndex === 2
                  ? "Ta commande t'a été livrée. Merci de ta confiance !"
                  : stepIndex === 1
                  ? "Notre équipe prépare ta commande pour la livraison."
                  : "Nous t'avons bien reçu. L'équipe te contacte pour finaliser le paiement et organiser la livraison."}
              </p>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        {!isCancelled && (
          <div className="mt-10">
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const reached = i <= stepIndex;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                        reached
                          ? "border-primary bg-primary text-white shadow-glow"
                          : "border-white/10 bg-surface text-zinc-500"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <p
                      className={`text-center text-xs font-bold uppercase tracking-wide ${
                        reached ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="relative -mt-12 mx-12 h-0.5 bg-white/10 -z-10">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* ARTICLES */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-surface">
          <div className="border-b border-white/10 bg-black/30 px-6 py-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              <Package size={14} className="inline mr-2" />
              Articles
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {order.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <p className="font-bold">{it.product.name}</p>
                  {(it.size || it.color) && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {[it.size, it.color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">× {it.quantity}</p>
                </div>
                <p className="font-black text-white">
                  {fmtPrice(it.price * it.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-6 py-5">
            <span className="font-black uppercase">Total</span>
            <span className="text-2xl font-black text-primary">
              {fmtPrice(order.total)}
            </span>
          </div>
        </div>

        {/* LIVRAISON */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
            Livraison
          </h2>
          <p className="mt-3 font-bold">{order.customerName}</p>
          <p className="text-sm text-zinc-300">
            📍 {order.city}
            {order.address ? ` — ${order.address}` : ""}
          </p>
          <p className="text-sm text-zinc-400">📞 {order.phone}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow hover:bg-accent"
          >
            Continuer mes achats
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-7 py-4 font-bold hover:border-primary"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
