"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, Plus, Sparkles, Check, Type, ImageIcon } from "lucide-react";
import { ClothingMockup, PRODUCTS, COLORS, type ProductId, type MockupImage } from "@/components/ClothingMockup";
import { FontPicker } from "@/components/FontPicker";

const TEXT_COLORS = [
  { name: "auto", label: "Auto" },
  { name: "white", label: "Blanc", hex: "#ffffff" },
  { name: "black", label: "Noir", hex: "#000000" },
  { name: "red", label: "Rouge", hex: "#E44332" },
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
  const [textScale, setTextScale] = useState(1);
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
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface2 px-5 py-8 md:rounded-[2rem] md:px-12 md:py-12">
          <div className="absolute -right-10 -top-32 h-72 w-72 rounded-full bg-primary/15 blur-[85px]" />
          <p className="relative text-[10px] font-black uppercase tracking-[.22em] text-primary">
            Custom Lab · ton studio
          </p>
          <h1 className="display-type text-balance relative mt-4 text-4xl leading-[.95] text-foreground md:mt-5 md:text-7xl">
            Imagine-le.
            <span className="italic text-primary"> Porte-le.</span>
          </h1>
          <p className="relative mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:mt-5 md:text-base">
            Compose ton style manga streetwear. Choisis ton produit, ta
            couleur, ajoute ton texte et tes images — l&apos;aperçu se met à jour
            en direct.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:mt-8 md:gap-8 lg:grid-cols-[1fr_460px]">
          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[1.5rem] border border-white/10 bg-surface p-5 md:rounded-[2rem] md:p-8"
          >
            {/* Type de produit */}
            <div>
              <label className="mb-3 block text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                01 / Choisis ta pièce
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductType(p.id)}
                    aria-pressed={productType === p.id}
                    className={`flex min-h-[76px] flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition ${
                      productType === p.id
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-white/10 bg-black/30 hover:border-white/30"
                    }`}
                  >
                    <span className="font-display text-xl font-black text-primary">{p.label.slice(0, 1)}</span>
                    <span className="text-[10px] font-bold leading-tight text-zinc-300">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Couleur du produit */}
            <div>
              <label className="mb-3 block text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                02 / Choisis ta couleur
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    aria-label={`Couleur ${c.label}`}
                    aria-pressed={color === c.hex}
                    title={c.label}
                    className={`relative h-11 w-11 rounded-full border-2 transition ${
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
              <label className="mb-3 block text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                03 / Ton message
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-primary"
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
              <label className="mb-3 block text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                Couleur du texte
              </label>
              <div className="flex flex-wrap gap-2">
                {TEXT_COLORS.map((tc) => (
                  <button
                    key={tc.name}
                    type="button"
                    onClick={() => setTextColor(tc.name)}
                    aria-pressed={textColor === tc.name}
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

            {/* Taille du texte */}
            <div>
              <label className="mb-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                <span className="flex items-center gap-2">
                  <Type size={14} />
                  Taille du texte
                </span>
                <span className="font-bold text-primary">{Math.round(textScale * 100)}%</span>
              </label>
              <input
                type="range"
                min={30}
                max={200}
                step={5}
                value={Math.round(textScale * 100)}
                onChange={(e) => setTextScale(Number(e.target.value) / 100)}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                <span>Petit</span>
                <span>Grand</span>
              </div>
            </div>

            {/* Upload images */}
            <div>
              <label className="mb-3 block text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                04 / Ajoute tes visuels
              </label>

              {/* Image list */}
              {images.length > 0 && (
                <div className="mb-3 space-y-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/40">
                        <Image
                          src={img.url}
                          alt={`Design ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-xs text-zinc-400">#{idx + 1}</span>
                        <div className="flex flex-1 items-center gap-2">
                          <ImageIcon size={12} className="shrink-0 text-zinc-500" />
                          <input
                            type="range"
                            min={20}
                            max={400}
                            step={10}
                            value={img.size}
                            onChange={(e) => handleImageUpdate(img.id, img.x, img.y, Number(e.target.value))}
                            className="flex-1 accent-primary"
                          />
                          <span className="w-8 text-right text-[10px] text-zinc-500">
                            {Math.round((img.size / 100) * 100)}%
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        aria-label={`Supprimer le visuel ${idx + 1}`}
                        className="shrink-0 text-red-400 transition hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <label className="flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[.02] px-5 py-6 transition hover:border-primary/60 hover:bg-primary/5">
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
                  Utilise les curseurs pour ajuster la taille de chaque image
                </p>
              )}
            </div>

            {/* Infos client */}
            <div className="grid gap-4 sm:grid-cols-2">
              <p className="text-[10px] font-black uppercase tracking-[.16em] text-zinc-400 sm:col-span-2">
                05 / Tes coordonnées
              </p>
              <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">
                Ton nom
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex. Aïcha Koné"
                  className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                  autoComplete="name"
                />
              </label>
              <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">
                Ton e-mail
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                  autoComplete="email"
                />
              </label>
              <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.12em] text-zinc-400 sm:col-span-2">
                Téléphone <span className="font-medium normal-case tracking-normal text-zinc-600">(facultatif)</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                  className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-primary"
                  autoComplete="tel"
                />
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-3 block text-[10px] font-black uppercase tracking-[.16em] text-zinc-400">
                06 / Notes supplémentaires
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-primary"
                placeholder="Décris ton idée, le positionnement souhaité..."
              />
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {done ? (
              <div className="inline-flex min-h-12 items-center gap-3 rounded-full bg-green-500/10 px-6 py-3 text-sm font-black text-green-300">
                <Check size={18} /> Demande envoyée — on te recontacte vite.
              </div>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-7 text-[10px] font-black uppercase tracking-[.14em] text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={20} />
                {isPending ? "Envoi..." : "Envoyer la demande"}
              </button>
            )}
          </form>

          {/* Preview */}
          <div className="self-start lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface2 p-4 md:rounded-[2rem] md:p-7">
              {/* Texture de fond */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(228,67,50,0.08),transparent_60%)]" />
              <div className="absolute inset-0 opacity-[0.03] bg-[repeating-conic-gradient(rgba(255,255,255,0.1)_0%_25%,transparent_0%_50%)] bg-[length:4px_4px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-primary">
                    En direct
                  </p>
                </div>
                <h2 className="display-type mt-2 text-3xl text-foreground">
                  Ton aperçu.
                </h2>

                {/* Product Preview */}
                <div className="mt-6">
                  <ClothingMockup
                    productType={productType}
                    colorName={color}
                    text={text}
                    textColor={resolvedTextColor}
                    fontFamily={fontFamily}
                    textScale={textScale}
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
                      {productObj?.label}
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
