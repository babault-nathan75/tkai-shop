"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Erreur de connexion");
        setLoading(false);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Erreur réseau, réessaie.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md rounded-[2rem] border border-white/10 bg-surface p-8"
    >
      <p className="font-black uppercase tracking-[0.25em] text-primary">
        T-KAI Admin
      </p>

      <h1 className="mt-3 text-4xl font-black">Connexion</h1>

      <div className="mt-8 space-y-5">
        <input
          type="text"
          required
          autoComplete="username"
          placeholder="Pseudo admin"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
        />

        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
        />

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow transition hover:bg-accent disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-white">
      <Suspense fallback={<div className="text-zinc-400">Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
