"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-primary hover:text-primary disabled:opacity-50"
    >
      <LogOut size={16} />
      {loading ? "Déconnexion..." : "Déconnexion"}
    </button>
  );
}
