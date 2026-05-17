import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function fmtPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v) + " FCFA";
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
    },
  });
  if (!order) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/orders"
          className="text-sm uppercase tracking-wider text-zinc-500 hover:text-primary"
        >
          ← Toutes les commandes
        </Link>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-primary">
              Commande
            </p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">
              #{order.id}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Reçue le {new Date(order.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <OrderStatusSelect orderId={order.id} initial={order.status} />
            <DeleteButton
              endpoint={`/api/admin/orders/${order.id}`}
              confirmMessage={`Supprimer la commande #${order.id} ?`}
            />
          </div>
        </div>

        {/* CLIENT */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-surface p-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Client
            </h2>
            <p className="mt-4 text-xl font-black">{order.customerName}</p>
            <div className="mt-3 space-y-1 text-sm text-zinc-300">
              <p>
                ✉️{" "}
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="text-primary hover:underline"
                >
                  {order.customerEmail}
                </a>
              </p>
              <p>
                📞{" "}
                <a
                  href={`tel:${order.phone}`}
                  className="text-primary hover:underline"
                >
                  {order.phone}
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-surface p-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Livraison
            </h2>
            <p className="mt-4 text-zinc-300">📍 {order.city}</p>
            {order.address && (
              <p className="mt-1 text-zinc-400">{order.address}</p>
            )}
          </div>
        </div>

        {/* ARTICLES */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-surface">
          <div className="border-b border-white/10 bg-black/30 px-6 py-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Articles ({order.items.reduce((s, it) => s + it.quantity, 0)})
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4 text-center">Qté</th>
                <th className="px-6 py-4 text-right">Prix</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-b border-white/5">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/products/${it.productId}/edit`}
                      className="font-bold hover:text-primary"
                    >
                      {it.product.name}
                    </Link>
                    {(it.size || it.color) && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {[it.size, it.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">{it.quantity}</td>
                  <td className="px-6 py-4 text-right text-zinc-400">
                    {fmtPrice(it.price)}
                  </td>
                  <td className="px-6 py-4 text-right font-black">
                    {fmtPrice(it.price * it.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-black/30">
                <td
                  colSpan={3}
                  className="px-6 py-5 text-right font-black uppercase tracking-wider"
                >
                  Total
                </td>
                <td className="px-6 py-5 text-right text-2xl font-black text-primary">
                  {fmtPrice(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* MÉTADONNÉES */}
        <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-surface p-6 text-sm text-zinc-400 md:grid-cols-2">
          <div>
            <span className="text-zinc-500">Statut paiement :</span>{" "}
            <span className="font-bold text-white">{order.paymentStatus}</span>
          </div>
          <div>
            <span className="text-zinc-500">Méthode :</span>{" "}
            <span className="font-bold text-white">
              {order.paymentMethod || "—"}
            </span>
          </div>
          {order.publicRef && (
            <div className="md:col-span-2">
              <span className="text-zinc-500">Lien de suivi client :</span>{" "}
              <Link
                href={`/track/${order.publicRef}`}
                className="text-primary hover:underline"
              >
                /track/{order.publicRef}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
