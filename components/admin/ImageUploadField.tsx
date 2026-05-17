"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  scope?: "products" | "categories";
  name?: string; // si défini, ajoute un input hidden pour les form server actions
  label?: string;
  size?: "sm" | "md";
}

export function ImageUploadField({
  value,
  onChange,
  scope = "products",
  name,
  label,
  size = "md",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/admin/upload?scope=${scope}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Erreur lors de l'upload.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewSize = size === "sm" ? 80 : 120;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold uppercase tracking-wider text-zinc-400">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        {value ? (
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            style={{ width: previewSize, height: previewSize }}
          >
            <Image
              src={value}
              alt="Aperçu"
              fill
              sizes={`${previewSize}px`}
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Retirer l'image"
              className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-red-300 transition hover:bg-red-500/30"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/30 text-zinc-500"
            style={{ width: previewSize, height: previewSize }}
          >
            <Upload size={20} />
          </div>
        )}

        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading
              ? "Upload..."
              : value
              ? "Remplacer l'image"
              : "Choisir une image"}
          </button>
          <p className="mt-2 text-xs text-zinc-500">
            PNG, JPG, WEBP ou GIF · 5 Mo max
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {name && <input type="hidden" name={name} value={value || ""} />}
    </div>
  );
}
