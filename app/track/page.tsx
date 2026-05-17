"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Package, Search, Trash2 } from "lucide-react";
import { useClientOrders } from "@/components/ClientOrdersContext";
import { formatPrice } from "@/lib/data";

export default function TrackHomePage() {
  const router = useRouter();
  const { orders, removeOrder, hydrated } = useClientOrders();
  const [refInput, setRefInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = refInput.trim();
    if (!v) return;
    router.push(`/track/${encodeURIComponent(v)}`);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-white md:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
          Mes commandes
        </p>
        <h1 className="mt-1 text-3xl font-black md:mt-2 md:text-5xl">
          Suivi des commandes
        </h1>
        <p className="mt-2 text-sm text-zinc-400 md:mt-3 md:text-base">
          Consulte le statut de tes commandes T-KAI. L&apos;historique est
          sauvegardé dans ce navigateur.
        </p>

        {/* RECHERCHE MANUELLE */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-white/10 bg-surface p-6"
        >
          <label className="block text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
            Suivre une commande par référence
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            Si tu as la référence reçue par email, colle-la ici.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="Ex: 7a3f2e1b9c8d..."
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white shadow-glow hover:bg-accent"
            >
              <Search size={16} />
              Rechercher
            </button>
          </div>
        </form>

        {/* HISTORIQUE LOCAL */}
        <div className="mt-10">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
            Historique de ce navigateur
          </h2>

          {!hydrated ? (
            <p className="mt-4 text-sm text-zinc-500">Chargement...</p>
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-surface p-8 text-center">
              <Package
                size={36}
                className="mx-auto text-zinc-500"
                strokeWidth={1.5}
              />
              <p className="mt-4 font-bold">Aucune commande pour le moment</p>
              <p className="mt-2 text-sm text-zinc-500">
                Les commandes que tu passes apparaîtront ici automatiquement.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-black shadow-glow hover:bg-accent"
              >
                Aller à la boutique
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((o) => (
                <div
                  key={o.orderId}
                  className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-black">Commande #{o.orderId}</p>
                      <span className="text-xs text-zinc-500">
                        ·{" "}
                        {new Date(o.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {o.itemsSummary && (
                      <p className="mt-1 truncate text-sm text-zinc-400">
                        {o.itemsSummary}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatPrice(o.total)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/track/${o.publicRef}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-accent"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => removeOrder(o.orderId)}
                      aria-label="Retirer cette commande de l'historique"
                      title="Retirer de l'historique (la commande reste en base)"
                      className="rounded-full border border-white/10 p-2 text-zinc-500 transition hover:border-red-500/40 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <p className="mt-4 text-xs text-zinc-500">
              💡 L&apos;historique est local à ce navigateur. Pour retrouver une
              commande depuis un autre appareil, utilise le lien reçu par
              email.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
