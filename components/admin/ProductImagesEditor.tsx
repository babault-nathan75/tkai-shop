"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { colorToHex } from "@/lib/colors";
import { ImageUploadField } from "./ImageUploadField";

interface ImageRow {
  color: string;
  url: string;
}

interface ProductImagesEditorProps {
  initial?: ImageRow[];
}

const DEFAULT_ROWS: ImageRow[] = [
  { color: "Noir", url: "" },
  { color: "Blanc", url: "" },
];

export function ProductImagesEditor({ initial }: ProductImagesEditorProps) {
  const [rows, setRows] = useState<ImageRow[]>(
    initial && initial.length > 0 ? initial : DEFAULT_ROWS
  );

  function updateRow(index: number, field: keyof ImageRow, value: string) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, { color: "", url: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Images par couleur
        </p>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/10"
        >
          <Plus size={14} />
          Ajouter une couleur
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        Uploade une image pour chaque couleur. Le client verra un toggle pour
        basculer entre les couleurs disponibles. Les lignes sans image sont
        ignorées à l&apos;enregistrement.
      </p>

      <div className="space-y-4">
        {rows.map((row, index) => {
          const swatch = colorToHex(row.color);
          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 flex-shrink-0 rounded-full border-2 border-white/20"
                    style={{ background: swatch }}
                    aria-hidden
                  />
                  <input
                    type="text"
                    name="imageColors"
                    value={row.color}
                    onChange={(e) => updateRow(index, "color", e.target.value)}
                    placeholder="Nom de la couleur"
                    className="w-44 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  aria-label="Retirer cette couleur"
                  className="rounded-full border border-red-500/40 p-2 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-4">
                <ImageUploadField
                  value={row.url}
                  onChange={(url) => updateRow(index, "url", url)}
                  scope="products"
                  name="imageUrls"
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-500">
          Aucune image. Clique sur &quot;Ajouter une couleur&quot;.
        </p>
      )}
    </div>
  );
}
