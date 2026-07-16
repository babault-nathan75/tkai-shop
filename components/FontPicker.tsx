"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

const FONTS = [
  { name: "Impact", category: "Display" },
  { name: "Arial Black", category: "Sans-serif" },
  { name: "Bebas Neue", category: "Display" },
  { name: "Oswald", category: "Sans-serif" },
  { name: "Anton", category: "Display" },
  { name: "Righteous", category: "Display" },
  { name: "Permanent Marker", category: "Handwriting" },
  { name: "Bangers", category: "Display" },
  { name: "Russo One", category: "Display" },
  { name: "Teko", category: "Display" },
  { name: "Archivo Black", category: "Sans-serif" },
  { name: "Black Ops One", category: "Display" },
  { name: "Bungee", category: "Display" },
  { name: "Press Start 2P", category: "Display" },
  { name: "Fugaz One", category: "Display" },
  { name: "Titan One", category: "Display" },
  { name: "Alfa Slab One", category: "Display" },
  { name: "Passion One", category: "Display" },
  { name: "Fjalla One", category: "Sans-serif" },
  { name: "Squada One", category: "Display" },
  { name: "Ultra", category: "Serif" },
  { name: "Abril Fatface", category: "Display" },
  { name: "Playfair Display", category: "Serif" },
  { name: "Merriweather", category: "Serif" },
  { name: "Lobster", category: "Handwriting" },
  { name: "Pacifico", category: "Handwriting" },
  { name: "Dancing Script", category: "Handwriting" },
  { name: "Satisfy", category: "Handwriting" },
  { name: "Great Vibes", category: "Handwriting" },
  { name: "Sacramento", category: "Handwriting" },
  { name: "Comfortaa", category: "Display" },
  { name: "Rubik Mono One", category: "Sans-serif" },
  { name: "Monoton", category: "Display" },
  { name: "Bungee Shade", category: "Display" },
  { name: "Silkscreen", category: "Display" },
  { name: "DotGothic16", category: "Display" },
  { name: "Hachi Mochi Pop", category: "Display" },
  { name: "Dela Gothic One", category: "Display" },
  { name: "Zen Dots", category: "Display" },
  { name: "Rampart One", category: "Display" },
  { name: "Yuji Boku", category: "Display" },
  { name: "Yuji Mai", category: "Display" },
  { name: "Yuji Syuku", category: "Display" },
  { name: "Zen Antique", category: "Serif" },
  { name: "Zen Old Mincho", category: "Serif" },
  { name: "Shippori Mincho", category: "Serif" },
  { name: "Kaisei Opti", category: "Serif" },
  { name: "Kaisei Decol", category: "Serif" },
  { name: "Kaisei Tokumin", category: "Serif" },
  { name: "Zen Kaku Gothic New", category: "Sans-serif" },
  { name: "M PLUS Rounded 1c", category: "Sans-serif" },
  { name: "Noto Sans JP", category: "Sans-serif" },
  { name: "Noto Serif JP", category: "Serif" },
  { name: "Sawarabi Gothic", category: "Sans-serif" },
  { name: "Sawarabi Mincho", category: "Serif" },
  { name: "Kosugi Maru", category: "Sans-serif" },
  { name: "Kosugi", category: "Sans-serif" },
  { name: "Cherry Bomb One", category: "Display" },
  { name: "Rozha One", category: "Serif" },
  { name: "Potta One", category: "Display" },
  { name: "Reggae One", category: "Display" },
  { name: "Stick", category: "Display" },
  { name: "Stickless", category: "Display" },
  { name: "Dots One", category: "Display" },
  { name: "Hina Mincho", category: "Serif" },
  { name: "Klee One", category: "Handwriting" },
  { name: "Zen Kurenaido", category: "Display" },
  { name: "New Rocker", category: "Display" },
  { name: "Creepster", category: "Display" },
  { name: "Eater", category: "Display" },
  { name: "Rubik Glitch", category: "Display" },
  { name: "Nabla", category: "Display" },
  { name: "Bungee Spice", category: "Display" },
  { name: "Fascinate Inline", category: "Display" },
  { name: "Metal Mania", category: "Display" },
  { name: "Vast Shadow", category: "Display" },
  { name: "Finger Paint", category: "Handwriting" },
  { name: "Nosifer", category: "Display" },
  { name: "Modak", category: "Display" },
  { name: "Bungee Hairline", category: "Display" },
  { name: "Wallpoet", category: "Display" },
  { name: "Bungee Outline", category: "Display" },
  { name: "Plaster", category: "Display" },
  { name: "Freckle Face", category: "Display" },
  { name: "Emblema One", category: "Display" },
  { name: "EduVICWANTHand-Regular", category: "Handwriting" },
  { name: "Chakra Petch", category: "Sans-serif" },
  { name: "Saira Stencil One", category: "Display" },
  { name: "Bungee Inline", category: "Display" },
  { name: "Racing Sans One", category: "Sans-serif" },
  { name: "Oleo Script", category: "Handwriting" },
  { name: "Fugaz One", category: "Display" },
  { name: "Bungee Shade", category: "Display" },
  { name: "Iceberg", category: "Display" },
  { name: "Bebas Neue", category: "Display" },
  { name: "Audiowide", category: "Display" },
];

const loaded = new Set<string>();

function loadFont(fontName: string) {
  if (loaded.has(fontName)) return;
  if (fontName === "Impact" || fontName === "Arial Black") {
    loaded.add(fontName);
    return;
  }
  const id = `font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) { loaded.add(fontName); return; }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700;900&display=swap`;
  document.head.appendChild(link);
  loaded.add(fontName);
}

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFont(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return FONTS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    ).slice(0, 30);
  }, [search]);

  const handleSelect = useCallback(
    (name: string) => {
      loadFont(name);
      onChange(name);
      setSearch("");
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div ref={ref} className="relative">
      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-zinc-400">
        Police d&apos;écriture
      </label>

      {/* Current font display + search toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-left transition hover:border-white/20 focus:border-primary"
      >
        <span style={{ fontFamily: value }} className="text-lg text-white">
          {value}
        </span>
        <svg className={`h-4 w-4 text-zinc-500 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
          {/* Search */}
          <div className="border-b border-white/10 p-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une police..."
              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary"
              autoFocus
            />
          </div>

          {/* Font list */}
          <div className="max-h-[320px] overflow-y-auto">
            {filtered.map((f) => {
              loadFont(f.name);
              return (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => handleSelect(f.name)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/5 ${value === f.name ? "bg-primary/10" : ""}`}
                >
                  <span style={{ fontFamily: f.name }} className="text-base text-white">
                    AKAI MODE
                  </span>
                  <span className="text-[10px] text-zinc-600">{f.category}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-zinc-600">
                Aucune police trouvée
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
