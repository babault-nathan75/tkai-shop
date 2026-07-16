"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, Plus, Sparkles, Check } from "lucide-react";
import { ClothingMockup, PRODUCTS, COLORS, type ProductId, type MockupImage } from "@/components/ClothingMockup";
import { FontPicker } from "@/components/FontPicker";

const TEXT_COLORS = [
  { name: "auto", label: "Auto" },
  { name: "white", label: "Blanc", hex: "#ffffff" },
  { name: "black", label: "Noir", hex: "#000000" },
  { name: "red", label: "Rouge", hex: "#D61F1F" },
  { name: "blue", label: "Bleu", hex: "#2563EB" },
  { name: "yellow", label: "Jaune", hex: "#EAB308" },
];

function pickTextColor(bgHex: string): string {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF";
}

let imgIdCounter = 0;
function nextImgId() {
  return `img-${++imgIdCounter}-${Date.now()}`;
}

export default function CustomLab() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("AKAI MODE");
  const [fontFamily, setFontFamily] = useState("Impact");
  const [notes, setNotes] = useState("");
  const [productType, setProductType] = useState<ProductId>("tshirt");
  const [color, setColor] = useState("#1a1a1a");
  const [textColor, setTextColor] = useState("auto");
  const [images, setImages] = useState<MockupImage[]>([]);
  const [textX, setTextX] = useState(250);
  const [textY, setTextY] = useState(280);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = nextImgId();
    setImages((prev) => [...prev, { id, url, x: 200, y: 200, size: 100 }]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleImageUpdate = useCallback((id: string, x: number, y: number, size: number) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, x, y, size } : img)));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const payload = {
      customerName,
      email,
      phone,
      text,
      fontFamily,
      color: COLORS.find((c) => c.hex === color)?.name ?? "black",
      product: PRODUCTS.find((p) => p.id === productType)?.label ?? "T-Shirt",
      notes,
      imageCount: images.length,
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/custom-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.message || "Erreur lors de l'envoi.");
          return;
        }
        setDone(true);
      } catch {
        setError("Erreur réseau, réessaie.");
      }
    });
  }

  const resolvedTextColor =
    textColor === "auto" ? pickTextColor(color) : TEXT_COLORS.find((c) => c.name === textColor)?.hex || "#ffffff";

  const productObj = PRODUCTS.find((p) => p.id === productType);

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-7xl px-4 py-6 md:py-14">
        {/* Header */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
            Custom Lab
          </p>
          <h1 className="mt-2 text-3xl font-black md:mt-3 md:text-7xl">
            Personnalise ton outfit
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 md:mt-5 md:text-lg">
            Crée ton propre style manga streetwear. Choisis ton produit, ta
            couleur, ajoute ton texte et tes images — l&apos;aperçu se met à jour
            en direct.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:mt-14 md:gap-8 lg:grid-cols-[1fr_480px]">
          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-white/10 bg-surface p-5 md:rounded-[2rem] md:p-8"
          >
            {/* Type de produit */}
            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-zinc-400">
                Type de produit
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductType(p.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition ${
                      productType === p.id
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-white/10 bg-black/30 hover:border-white/30"
                    }`}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-[10px] font-bold leading-tight text-zinc-300">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Couleur du produit */}
            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-zinc-400">
                Couleur du produit
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    aria-label={`Couleur ${c.label}`}
                    title={c.label}
                    className={`relative h-10 w-10 rounded-full border-2 transition ${
                      color === c.hex
                        ? "border-primary scale-110 shadow-glow"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    style={{ background: c.hex }}
                  >
                    {color === c.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            c.name === "white" || c.name === "beige" || c.name === "yellow"
                              ? "bg-black"
                              : "bg-white"
                          }`}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Texte */}
            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-zinc-400">
                Texte à imprimer
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-primary"
                placeholder="Ex: AKAI MODE"
                maxLength={30}
              />
              <p className="mt-1 text-right text-xs text-zinc-600">
                {text.length}/30
              </p>
            </div>

            {/* Police */}
            <FontPicker value={fontFamily} onChange={setFontFamily} />

            {/* Couleur du texte */}
            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-zinc-400">
                Couleur du texte
              </label>
              <div className="flex flex-wrap gap-2">
                {TEXT_COLORS.map((tc) => (
                  <button
                    key={tc.name}
                    type="button"
                    onClick={() => setTextColor(tc.name)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      textColor === tc.name
                        ? "border-primary bg-primary text-white"
                        : "border-white/10 bg-surface hover:border-white/30"
                    }`}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload images */}
            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-zinc-400">
                Images / Logos
              </label>

              {/* Image list */}
              {images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-black/40">
                        <Image
                          src={img.url}
                          alt={`Design ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-contain p-0.5"
                        />
                      </div>
                      <span className="text-xs text-zinc-400">#{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="ml-1 text-red-400 transition hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-black/30 px-5 py-6 transition hover:bg-primary/5">
                <Plus size={18} className="text-zinc-400" />
                <span className="text-sm font-bold text-zinc-300">
                  {images.length === 0 ? "Importer une image" : "Ajouter une image"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
              {images.length > 0 && (
                <p className="mt-1 text-[10px] text-zinc-600">
                  Sur l&apos;aperçu : glisse pour déplacer, molette pour redimensionner
                </p>
              )}
            </div>

            {/* Infos client */}
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ton nom"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-primary"
                autoComplete="name"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ton email"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-primary"
                autoComplete="email"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Téléphone (optionnel)"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-primary sm:col-span-2"
                autoComplete="tel"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-zinc-400">
                Notes supplémentaires
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-primary"
                placeholder="Décris ton idée, le positionnement souhaité..."
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {done ? (
              <div className="inline-flex items-center gap-3 rounded-full bg-green-500/20 px-6 py-3 font-black text-green-300">
                <Check size={18} /> Demande envoyée — on te recontacte vite.
              </div>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-accent disabled:opacity-50"
              >
                <Sparkles size={20} />
                {isPending ? "Envoi..." : "Envoyer la demande"}
              </button>
            )}
          </form>

          {/* Preview */}
          <div className="sticky top-24 self-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#0c0c0c] p-6 md:p-8">
              {/* Texture de fond */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(214,31,31,0.06),transparent_60%)]" />
              <div className="absolute inset-0 opacity-[0.03] bg-[repeating-conic-gradient(rgba(255,255,255,0.1)_0%_25%,transparent_0%_50%)] bg-[length:4px_4px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Live Preview
                  </p>
                </div>
                <h2 className="mt-1 text-xl font-black text-white/90">
                  Prévisualisation
                </h2>

                {/* Product Preview */}
                <div className="mt-6">
                  <ClothingMockup
                    productType={productType}
                    colorName={color}
                    text={text}
                    textColor={resolvedTextColor}
                    fontFamily={fontFamily}
                    images={images}
                    onImageUpdate={handleImageUpdate}
                    textX={textX}
                    textY={textY}
                    onTextMove={(x, y) => { setTextX(x); setTextY(y); }}
                  />
                </div>

                {/* Résumé */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5">
                    <span className="text-xs text-zinc-500">Produit</span>
                    <span className="text-xs font-bold text-white/80">
                      {productObj?.emoji} {productObj?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5">
                    <span className="text-xs text-zinc-500">Couleur</span>
                    <span className="flex items-center gap-2 text-xs font-bold text-white/80">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-white/10"
                        style={{ background: color }}
                      />
                      {COLORS.find((c) => c.hex === color)?.label}
                    </span>
                  </div>
                  {text && (
                    <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5">
                      <span className="text-xs text-zinc-500">Texte</span>
                      <span className="text-xs font-bold text-white/80">
                        &ldquo;{text}&rdquo; — {fontFamily}
                      </span>
                    </div>
                  )}
                  {images.length > 0 && (
                    <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5">
                      <span className="text-xs text-zinc-500">Images</span>
                      <span className="text-xs font-bold text-green-400">
                        {images.length} logo{images.length > 1 ? "s" : ""} chargé{images.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {notes && (
                  <div className="mt-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                      Notes
                    </p>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
