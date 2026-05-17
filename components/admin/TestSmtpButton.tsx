"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export function TestSmtpButton() {
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/test-smtp", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        alert(
          `✅ Email de test envoyé à ${data.to}.\n\nVérifie ta boîte (et le dossier Spam).`
        );
      } else {
        alert(
          `❌ Échec SMTP (étape: ${data.step || "?"}) :\n\n${data.error}\n\n💡 ${data.hint || ""}`
        );
      }
    } catch {
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-primary hover:text-primary disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
      {loading ? "Test..." : "Tester SMTP"}
    </button>
  );
}
