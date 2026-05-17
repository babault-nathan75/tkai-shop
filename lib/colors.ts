// Mapping couleur → swatch CSS pour les toggles visuels.
// Ajoute simplement une entrée ici pour gérer une nouvelle couleur.

export const COLOR_PRESETS: Record<string, string> = {
  noir: "#000000",
  black: "#000000",
  blanc: "#FFFFFF",
  white: "#FFFFFF",
  rouge: "#D61F1F",
  red: "#D61F1F",
  bleu: "#1E40AF",
  blue: "#1E40AF",
  vert: "#16A34A",
  green: "#16A34A",
  jaune: "#FBBF24",
  yellow: "#FBBF24",
  gris: "#6B7280",
  grey: "#6B7280",
  gray: "#6B7280",
  beige: "#D6C7A0",
  marron: "#7C2D12",
  brown: "#7C2D12",
  orange: "#F97316",
  rose: "#EC4899",
  pink: "#EC4899",
  violet: "#8B5CF6",
  purple: "#8B5CF6",
};

export function colorToHex(name: string | null | undefined): string {
  if (!name) return "#444";
  const key = name.toLowerCase().trim();
  return COLOR_PRESETS[key] || "#444";
}

export function isLightColor(name: string | null | undefined): boolean {
  const hex = colorToHex(name).replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}
