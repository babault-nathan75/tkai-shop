"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Sparkles, Check } from "lucide-react";

export default function CustomLab() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("AKAI MODE");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("black");
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          text,
          color,
          notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Erreur lors de l'envoi.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau, réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-7xl px-4 py-6 md:py-14">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
            Custom Lab
          </p>
          <h1 className="mt-2 text-3xl font-black md:mt-3 md:text-7xl">
            Personnalise ton outfit
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 md:mt-5 md:text-lg">
            Crée ton propre style manga streetwear. Ajoute ton texte, ton image
            et transforme ton idée en pièce unique T-KAI.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:mt-14 md:gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-surface p-5 md:rounded-[2rem] md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ton nom"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
                autoComplete="name"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ton email"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
                autoComplete="email"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Téléphone (optionnel)"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary sm:col-span-2"
                autoComplete="tel"
              />
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Texte à imprimer
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
                placeholder="Ex: AKAI MODE"
              />
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Couleur du produit
              </label>
              <div className="flex gap-3">
                {["black", "white", "red"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Couleur ${c}`}
                    className={`h-12 w-12 rounded-full border-2 transition ${
                      color === c
                        ? "border-primary scale-110"
                        : "border-white/10"
                    }`}
                    style={{
                      background:
                        c === "black"
                          ? "#000"
                          : c === "white"
                          ? "#fff"
                          : "#D61F1F",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Upload image/logo (preview seulement)
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-black/30 px-5 py-10 transition hover:bg-primary/5">
                <Upload size={20} />
                <span className="font-bold">Importer une image</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
              <p className="mt-2 text-xs text-zinc-500">
                Les fichiers ne sont pas encore uploadés au serveur. Décris ton
                visuel dans les notes ci-dessous.
              </p>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-zinc-400">
                Notes supplémentaires
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-primary"
                placeholder="Décris ton idée..."
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {done ? (
              <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-green-500/20 px-6 py-3 font-black text-green-300">
                <Check size={18} /> Demande envoyée — on te recontacte vite.
              </div>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-accent disabled:opacity-50"
              >
                <Sparkles size={20} />
                {submitting ? "Envoi..." : "Envoyer la demande"}
              </button>
            )}
          </form>

          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/10 via-black to-black p-8">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10">
              <p className="font-black uppercase tracking-[0.25em] text-primary">
                Live Preview
              </p>
              <h2 className="mt-3 text-4xl font-black">Prévisualisation</h2>

              <div
                className={`relative mt-10 flex aspect-square items-center justify-center rounded-[2rem] border border-white/10 ${
                  color === "black"
                    ? "bg-black"
                    : color === "white"
                    ? "bg-white"
                    : "bg-[#D61F1F]"
                }`}
              >
                {preview && (
                  <div className="absolute top-16">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={120}
                      height={120}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                )}
                <div
                  className={`mt-32 px-8 text-center text-3xl font-black uppercase tracking-wide ${
                    color === "white" ? "text-black" : "text-white"
                  }`}
                >
                  {text}
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm uppercase tracking-wider text-zinc-500">
                  Notes client
                </p>
                <p className="mt-3 text-zinc-300">
                  {notes || "Aucune note ajoutée."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
