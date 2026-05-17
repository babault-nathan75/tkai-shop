"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "confirmed", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_LABEL: Record<Status, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_CLASS: Record<Status, string> = {
  pending: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  confirmed: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  delivered: "border-green-500/40 bg-green-500/10 text-green-300",
  cancelled: "border-red-500/40 bg-red-500/10 text-red-300",
};

export function OrderStatusSelect({
  orderId,
  initial,
}: {
  orderId: number;
  initial: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initial);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setStatus(newStatus);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Erreur de mise à jour.");
        setStatus(initial);
      } else {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-full border px-4 py-2 text-sm font-bold outline-none transition disabled:opacity-50 ${STATUS_CLASS[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-black text-white">
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
