"use client";

import { useState, useRef, useCallback, useMemo } from "react";

export const PRODUCTS = [
  { id: "tshirt", label: "T-Shirt", emoji: "\u{1F455}" },
  { id: "hoodie", label: "Hoodie", emoji: "\u{1F9E5}" },
  { id: "cap", label: "Casquette", emoji: "\u{1F9E2}" },
  { id: "tote", label: "Tote Bag", emoji: "\u{1F45C}" },
  { id: "mug", label: "Mug", emoji: "\u2615" },
  { id: "phone", label: "Phone Case", emoji: "\u{1F4F1}" },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

export const COLORS = [
  { name: "black", label: "Noir", hex: "#1a1a1a" },
  { name: "white", label: "Blanc", hex: "#f5f5f5" },
  { name: "red", label: "Rouge", hex: "#D61F1F" },
  { name: "navy", label: "Bleu marine", hex: "#1E3A5F" },
  { name: "blue", label: "Bleu", hex: "#2563EB" },
  { name: "green", label: "Vert", hex: "#16A34A" },
  { name: "yellow", label: "Jaune", hex: "#EAB308" },
  { name: "pink", label: "Rose", hex: "#EC4899" },
  { name: "purple", label: "Violet", hex: "#8B5CF6" },
  { name: "orange", label: "Orange", hex: "#F97316" },
  { name: "grey", label: "Gris", hex: "#71717A" },
  { name: "beige", label: "Beige", hex: "#D2B48C" },
];

function pickTextColor(bgHex: string): string {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF";
}

/* ─── SVG Shapes ─── */

function TShirtShape({ color }: { color: string }) {
  return (
    <>
      <path
        d="M 140,0 L 60,30 L 0,120 L 55,155 L 95,80 L 95,530 L 405,530 L 405,80 L 445,155 L 500,120 L 440,30 L 360,0 C 340,45 290,70 250,70 C 210,70 160,45 140,0 Z"
        fill={color}
        stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}
        strokeWidth="1"
      />
      <path
        d="M 140,0 L 60,30 L 0,120 L 55,155 L 95,80 L 95,530 L 405,530 L 405,80 L 445,155 L 500,120 L 440,30 L 360,0 C 340,45 290,70 250,70 C 210,70 160,45 140,0 Z"
        fill="url(#shirt-shade)"
      />
      <path d="M 195,8 C 210,35 230,48 250,50 C 270,48 290,35 305,8" fill="none" stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} strokeWidth="2" />
    </>
  );
}

function HoodieShape({ color }: { color: string }) {
  return (
    <>
      <path
        d="M 145,55 C 145,0 200,-20 250,-20 C 300,-20 355,0 355,55 L 360,80 C 340,60 290,48 250,48 C 210,48 160,60 140,80 Z"
        fill={color}
        stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}
        strokeWidth="1"
      />
      <path
        d="M 130,75 L 40,110 L 0,200 L 60,225 L 85,150 L 85,580 L 415,580 L 415,150 L 440,225 L 500,200 L 460,110 L 370,75 C 350,95 300,110 250,110 C 200,110 150,95 130,75 Z"
        fill={color}
        stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}
        strokeWidth="1"
      />
      <path
        d="M 130,75 L 40,110 L 0,200 L 60,225 L 85,150 L 85,580 L 415,580 L 415,150 L 440,225 L 500,200 L 460,110 L 370,75 C 350,95 300,110 250,110 C 200,110 150,95 130,75 Z"
        fill="url(#hoodie-shade)"
      />
      <path d="M 170,400 L 330,400 L 330,500 L 170,500 Z" fill="none" stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"} strokeWidth="1.5" />
      <line x1="230" y1="110" x2="230" y2="170" stroke={pickTextColor(color)} strokeWidth="2" opacity="0.3" />
      <line x1="270" y1="110" x2="270" y2="170" stroke={pickTextColor(color)} strokeWidth="2" opacity="0.3" />
    </>
  );
}

function CapShape({ color }: { color: string }) {
  return (
    <>
      <path d="M 100,220 C 100,220 130,300 250,310 C 370,300 400,220 400,220 L 380,230 C 380,230 350,290 250,300 C 150,290 120,230 120,230 Z" fill={color} stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"} strokeWidth="1" />
      <path d="M 100,220 C 100,120 140,40 250,40 C 360,40 400,120 400,220 L 100,220 Z" fill={color} stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"} strokeWidth="1" />
      <path d="M 100,220 C 100,120 140,40 250,40 C 360,40 400,120 400,220 L 100,220 Z" fill="url(#cap-shade)" />
      <circle cx="250" cy="42" r="6" fill={pickTextColor(color)} opacity="0.3" />
      <line x1="250" y1="42" x2="250" y2="220" stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="1" />
      <line x1="175" y1="55" x2="155" y2="220" stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"} strokeWidth="1" />
      <line x1="325" y1="55" x2="345" y2="220" stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"} strokeWidth="1" />
    </>
  );
}

function ToteShape({ color }: { color: string }) {
  return (
    <>
      <path d="M 130,90 C 130,20 160,0 180,0" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <path d="M 270,90 C 270,20 240,0 220,0" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <path d="M 50,100 L 70,480 L 330,480 L 350,100 Z" fill={color} stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"} strokeWidth="1" />
      <path d="M 50,100 L 70,480 L 330,480 L 350,100 Z" fill="url(#tote-shade)" />
      <line x1="50" y1="100" x2="350" y2="100" stroke={pickTextColor(color) === "#000000" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"} strokeWidth="2" />
    </>
  );
}

function MugShape({ color }: { color: string }) {
  return (
    <>
      <path d="M 100,80 L 100,380 C 100,400 120,420 160,420 L 320,420 C 360,420 380,400 380,380 L 380,80 Z" fill={color} />
      <path d="M 100,80 L 100,380 C 100,400 120,420 160,420 L 320,420 C 360,420 380,400 380,380 L 380,80 Z" fill="url(#mug-shade)" />
      <path d="M 380,140 C 440,140 460,200 460,250 C 460,300 440,360 380,360" fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" />
      <ellipse cx="240" cy="80" rx="140" ry="18" fill={color} opacity="0.9" />
      <ellipse cx="240" cy="80" rx="140" ry="18" fill="rgba(0,0,0,0.1)" />
    </>
  );
}

function PhoneShape({ color }: { color: string }) {
  return (
    <>
      <rect x="30" y="10" width="240" height="580" rx="36" ry="36" fill={color} />
      <rect x="30" y="10" width="240" height="580" rx="36" ry="36" fill="url(#phone-shade)" />
      <rect x="44" y="50" width="212" height="480" rx="20" ry="20" fill="rgba(0,0,0,0.6)" />
      <circle cx="75" cy="95" r="14" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="75" cy="95" r="8" fill="rgba(0,0,0,0.6)" />
      <circle cx="110" cy="95" r="10" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </>
  );
}

const SHAPES: Record<ProductId, React.FC<{ color: string }>> = {
  tshirt: TShirtShape,
  hoodie: HoodieShape,
  cap: CapShape,
  tote: ToteShape,
  mug: MugShape,
  phone: PhoneShape,
};

const VIEWBOX: Record<ProductId, { w: number; h: number }> = {
  tshirt: { w: 500, h: 550 },
  hoodie: { w: 500, h: 600 },
  cap: { w: 500, h: 400 },
  tote: { w: 400, h: 500 },
  mug: { w: 500, h: 450 },
  phone: { w: 300, h: 600 },
};

/* ─── Image Type ─── */

export interface MockupImage {
  id: string;
  url: string;
  x: number;
  y: number;
  size: number;
}

/* ─── Main Component ─── */

interface ClothingMockupProps {
  productType: ProductId;
  colorName: string;
  text: string;
  textColor: string;
  fontFamily: string;
  textScale: number;
  images: MockupImage[];
  onImageUpdate: (id: string, x: number, y: number, size: number) => void;
  textX: number;
  textY: number;
  onTextMove: (x: number, y: number) => void;
}

export function ClothingMockup({
  productType,
  colorName,
  text,
  textColor,
  fontFamily,
  textScale,
  images,
  onImageUpdate,
  textX,
  textY,
  onTextMove,
}: ClothingMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ type: "text" | "image"; id?: string } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, origX: 0, origY: 0, origSize: 0 });

  const colorObj = COLORS.find((c) => c.hex === colorName) ?? COLORS[0];
  const resolvedTextColor = textColor || pickTextColor(colorName);
  const productDef = PRODUCTS.find((p) => p.id === productType);
  const Shape = SHAPES[productType];
  const vb = VIEWBOX[productType];

  const toSVGCoords = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return { x: 0, y: 0 };
      const rect = container.querySelector("svg")?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const x = ((clientX - rect.left) / rect.width) * vb.w;
      const y = ((clientY - rect.top) / rect.height) * vb.h;
      return { x: Math.max(0, Math.min(vb.w, x)), y: Math.max(0, Math.min(vb.h, y)) };
    },
    [vb.w, vb.h],
  );

  const handlePointerDown = useCallback(
    (target: "text" | "image", id: string | undefined, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pos = toSVGCoords(e.clientX, e.clientY);

      if (target === "image" && id) {
        const img = images.find((i) => i.id === id);
        setDragging({ type: "image", id });
        dragStart.current = { x: pos.x, y: pos.y, origX: img?.x ?? 0, origY: img?.y ?? 0, origSize: img?.size ?? 100 };
      } else {
        setDragging({ type: "text" });
        dragStart.current = { x: pos.x, y: pos.y, origX: textX, origY: textY, origSize: 0 };
      }
    },
    [toSVGCoords, textX, textY, images],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const pos = toSVGCoords(e.clientX, e.clientY);
      const dx = pos.x - dragStart.current.x;
      const dy = pos.y - dragStart.current.y;
      const newX = Math.max(0, Math.min(vb.w, dragStart.current.origX + dx));
      const newY = Math.max(0, Math.min(vb.h, dragStart.current.origY + dy));

      if (dragging.type === "text") {
        onTextMove(newX, newY);
      } else if (dragging.id) {
        const img = images.find((i) => i.id === dragging.id);
        if (img) onImageUpdate(img.id, newX, newY, img.size);
      }
    },
    [dragging, toSVGCoords, vb.w, vb.h, onTextMove, onImageUpdate, images],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!dragging || dragging.type !== "image" || !dragging.id) return;
      e.preventDefault();
      const img = images.find((i) => i.id === dragging.id);
      if (!img) return;
      const delta = e.deltaY > 0 ? -8 : 8;
      const newSize = Math.max(20, Math.min(400, img.size + delta));
      onImageUpdate(img.id, img.x, img.y, newSize);
    },
    [dragging, images, onImageUpdate],
  );

  const fontSize = useMemo(() => {
    const len = text.trim().length;
    let base: number;
    if (len > 18) base = vb.w * 0.055;
    else if (len > 12) base = vb.w * 0.065;
    else base = vb.w * 0.08;
    return base * textScale;
  }, [text, vb.w, textScale]);

  const textPctX = (textX / vb.w) * 100;
  const textPctY = (textY / vb.h) * 100;

  return (
    <div className="relative flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] shadow-2xl touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(214,31,31,0.04),transparent_60%)]" />

        <div className="relative z-10 p-6">
          <div className="mx-auto aspect-square max-w-[380px]">
            <svg viewBox={`0 0 ${vb.w} ${vb.h}`} className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shirt-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
                </linearGradient>
                <linearGradient id="hoodie-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                </linearGradient>
                <linearGradient id="cap-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                </linearGradient>
                <linearGradient id="tote-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
                </linearGradient>
                <linearGradient id="mug-shade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                </linearGradient>
                <linearGradient id="phone-shade" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
                </linearGradient>
                <filter id="shirt-shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3" /></filter>
                <filter id="hoodie-shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3" /></filter>
                <filter id="cap-shadow"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3" /></filter>
                <filter id="tote-shadow"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.25" /></filter>
                <filter id="phone-shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3" /></filter>
              </defs>

              <Shape color={colorName} />

              {/* Draggable text */}
              {text.trim() && (
                <g
                  onPointerDown={(e) => handlePointerDown("text", undefined, e)}
                  style={{ cursor: dragging?.type === "text" ? "grabbing" : "grab" }}
                >
                  <rect
                    x={textX - vb.w * 0.25}
                    y={textY - fontSize * 0.8}
                    width={vb.w * 0.5}
                    height={fontSize * 1.6}
                    fill="transparent"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={resolvedTextColor}
                    fontFamily={`${fontFamily}, Impact, Arial Black, sans-serif`}
                    fontSize={fontSize}
                    letterSpacing="3"
                    pointerEvents="none"
                  >
                    {text.trim().toUpperCase()}
                  </text>
                </g>
              )}
            </svg>

            {/* Draggable image overlays */}
            {images.map((img) => {
              const pctX = (img.x / vb.w) * 100;
              const pctY = (img.y / vb.h) * 100;
              const pctSize = (img.size / vb.w) * 100;
              const isActive = dragging?.type === "image" && dragging.id === img.id;

              return (
                <div
                  key={img.id}
                  className="absolute z-20 touch-none"
                  style={{
                    left: `${pctX}%`,
                    top: `${pctY}%`,
                    width: `${pctSize}%`,
                    height: `${pctSize}%`,
                    cursor: isActive ? "grabbing" : "grab",
                    outline: isActive ? "2px dashed rgba(214,31,31,0.6)" : "none",
                    outlineOffset: "4px",
                    borderRadius: "4px",
                  }}
                  onPointerDown={(e) => handlePointerDown("image", img.id, e)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt="Design"
                    className="h-full w-full object-contain drop-shadow-md pointer-events-none"
                  />
                </div>
              );
            })}
          </div>

          {/* Hint */}
          <p className="mt-3 text-center text-[10px] text-zinc-600">
            {dragging?.type === "image"
              ? "Molette pour redimensionner, glisse pour d\u00e9placer"
              : dragging?.type === "text"
              ? "Glisse pour repositionner le texte"
              : "Glisse texte & images pour les positionner"}
          </p>
        </div>
      </div>

      {/* Product label */}
      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-3 w-3 rounded-full border border-white/10" style={{ background: colorName }} />
        <span>{productDef?.emoji} {productDef?.label} {colorObj.label}</span>
      </div>
    </div>
  );
}
