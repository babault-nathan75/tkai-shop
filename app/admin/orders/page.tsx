import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Link
            href="/admin"
            className="text-sm uppercase tracking-wider text-zinc-500 hover:text-primary"
          >
            ← Dashboard
          </Link>
          <p className="mt-2 font-black uppercase tracking-[0.25em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">Commandes</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <details
              key={order.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-surface"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 hover:bg-primary/5">
                <div>
                  <p className="font-black">
                    #{order.id} · {order.customerName}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {order.city} ·{" "}
                    {new Date(order.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-primary">
                    {order.total.toLocaleString()} FCFA
                  </span>
                  {order.paymentStatus === "paid" ? (
                    <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                      Payé
                    </span>
                  ) : order.paymentStatus === "failed" ? (
                    <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
                      Échec
                    </span>
                  ) : (
                    <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                      En attente
                    </span>
                  )}
                  <OrderStatusSelect orderId={order.id} initial={order.status} />
                </div>
              </summary>
              <div className="border-t border-white/10 bg-black/30 px-6 py-5 text-sm text-zinc-300">
                <p>
                  <strong>Email :</strong>{" "}
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="text-primary hover:underline"
                  >
                    {order.customerEmail}
                  </a>
                </p>
                <p>
                  <strong>Téléphone :</strong> {order.phone}
                </p>
                {order.address && (
                  <p>
                    <strong>Adresse :</strong> {order.address}
                  </p>
                )}
                <p className="mt-2">
                  <strong>Paiement :</strong>{" "}
                  {order.paymentProvider || "—"}
                  {order.paymentMethod ? ` · ${order.paymentMethod}` : ""}
                  {order.paymentRef ? ` · ref ${order.paymentRef}` : ""}
                  {order.paidAt
                    ? ` · payé le ${new Date(order.paidAt).toLocaleString("fr-FR")}`
                    : ""}
                </p>
                <div className="mt-4">
                  <p className="mb-2 font-bold uppercase tracking-wider text-zinc-500">
                    Articles
                  </p>
                  <ul className="space-y-2">
                    {order.items.map((it) => (
                      <li key={it.id} className="flex justify-between">
                        <span>
                          {it.product.name}
                          {(it.size || it.color) && (
                            <span className="ml-2 text-xs text-zinc-500">
                              ({[it.size, it.color].filter(Boolean).join(" / ")})
                            </span>
                          )}
                          <span className="ml-2 text-zinc-500">
                            × {it.quantity}
                          </span>
                        </span>
                        <span className="font-bold">
                          {(it.price * it.quantity).toLocaleString()} FCFA
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-full border border-primary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
                  >
                    Voir le détail →
                  </Link>
                  <DeleteButton
                    endpoint={`/api/admin/orders/${order.id}`}
                    confirmMessage={`Supprimer la commande #${order.id} ?`}
                  />
                </div>
              </div>
            </details>
          ))}

          {orders.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-surface px-6 py-16 text-center text-zinc-500">
              Aucune commande passée.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
