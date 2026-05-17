"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function ResetDemoButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    const ok = confirm(
      "Supprimer toutes les catégories et produits sans commandes ?\n" +
        "Les commandes existantes et leurs produits liés seront préservés."
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset?scope=demo", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || "Erreur lors de la réinitialisation.");
        setLoading(false);
        return;
      }
      alert(
        `Supprimé : ${data.deletedProducts} produit(s), ${data.deletedCategories} catégorie(s).\n` +
          `Restant : ${data.remainingProducts} produit(s), ${data.remainingCategories} catégorie(s).`
      );
      router.refresh();
    } catch {
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={14} />
      {loading ? "..." : "Vider démo"}
    </button>
  );
}
