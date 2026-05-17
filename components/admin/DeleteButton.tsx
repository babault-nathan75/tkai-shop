"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  endpoint: string;
  confirmMessage?: string;
  label?: string;
}

export function DeleteButton({
  endpoint,
  confirmMessage = "Confirmer la suppression ?",
  label = "Supprimer",
}: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || "Erreur lors de la suppression.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      alert("Erreur réseau.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={14} />
      {loading ? "..." : label}
    </button>
  );
}
