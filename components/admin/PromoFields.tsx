"use client";

import { useState } from "react";
import { Clock3, Sparkles } from "lucide-react";

interface PromoFieldsProps {
  price?: number;
  initialSalePrice?: number | null;
  initialDays?: number;
  initialHours?: number;
  initiallyEnabled?: boolean;
}

export function PromoFields({
  price,
  initialSalePrice,
  initialDays = 0,
  initialHours = 1,
  initiallyEnabled = false,
}: PromoFieldsProps) {
  const [enabled, setEnabled] = useState(initiallyEnabled);

  return (
    <section className="overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-black/30 to-black/60">
      <label className="flex cursor-pointer items-center justify-between gap-4 p-5 md:p-6">
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Sparkles size={20} />
          </span>
          <span>
            <span className="block font-black uppercase tracking-wide text-white">
              Promotion
            </span>
            <span className="mt-1 block text-sm text-zinc-400">
              Offre limitée avec compte à rebours
            </span>
          </span>
        </span>
        <input
          type="checkbox"
          name="promoEnabled"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          className="h-5 w-5 accent-primary"
        />
      </label>

      {enabled && (
        <div className="grid gap-5 border-t border-white/10 bg-black/20 p-5 md:grid-cols-2 md:p-6">
          <div>
            <label
              htmlFor="salePrice"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-zinc-400"
            >
              Prix promo (FCFA)
            </label>
            <input
              id="salePrice"
              type="number"
              name="salePrice"
              min="1"
              max={price ? price - 1 : undefined}
              step="1"
              required={enabled}
              defaultValue={initialSalePrice ?? ""}
              placeholder="Ex. 18000"
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-primary"
            />
            <p className="mt-2 text-xs text-zinc-500">
              {price
                ? `Le prix normal est de ${price.toLocaleString("fr-FR")} FCFA.`
                : "Le prix promo doit rester inférieur au prix normal."}
            </p>
          </div>

          <div>
            <p className="mb-2 block text-xs font-black uppercase tracking-wider text-zinc-400">
              Durée de la promotion
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-zinc-500">
                Jours
                <input
                  type="number"
                  name="promoDays"
                  min="0"
                  max="3650"
                  step="1"
                  required={enabled}
                  defaultValue={initialDays}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-base text-white outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs text-zinc-500">
                Heures
                <input
                  type="number"
                  name="promoHours"
                  min="0"
                  max="23"
                  step="1"
                  required={enabled}
                  defaultValue={initialHours}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-base text-white outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>

          <p className="flex items-center gap-2 text-xs text-zinc-400 md:col-span-2">
            <Clock3 size={14} className="text-primary" />
            Le compte à rebours démarre dès l’enregistrement.
          </p>
        </div>
      )}
    </section>
  );
}
