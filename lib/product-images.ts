export interface ImageInput {
  color: string | null;
  url: string;
  position: number;
}

// Lit les inputs "imageColors[]" + "imageUrls[]" d'un FormData
// et retourne la liste des paires valides (URL non vide).
export function parseImageRows(formData: FormData): ImageInput[] {
  const colors = formData.getAll("imageColors").map((v) => String(v));
  const urls = formData.getAll("imageUrls").map((v) => String(v));
  const len = Math.max(colors.length, urls.length);
  const rows: ImageInput[] = [];
  for (let i = 0; i < len; i++) {
    const url = (urls[i] || "").trim();
    if (!url) continue;
    const color = (colors[i] || "").trim() || null;
    rows.push({ color, url, position: rows.length });
  }
  return rows;
}
