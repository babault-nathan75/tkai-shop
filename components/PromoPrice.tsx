"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { getActiveSalePrice } from "@/lib/promotions";

interface PromoPriceProps {
  price: number;
  salePrice?: number | null;
  saleEndsAt?: string | Date | null;
  size?: "card" | "detail";
  initialNow: number;
}

function getRemainingTime(endTime: number, now: number) {
  const totalSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}j ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function PromoPrice({
  price,
  salePrice,
  saleEndsAt,
  size = "card",
  initialNow,
}: PromoPriceProps) {
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    if (salePrice == null || !saleEndsAt) return;
    const endTime = new Date(saleEndsAt).getTime();
    const updateTime = () => {
      const currentTime = Date.now();
      setNow(currentTime);
      if (currentTime >= endTime) window.clearInterval(timer);
    };
    const timer = window.setInterval(updateTime, 1000);
    updateTime();
    return () => window.clearInterval(timer);
  }, [salePrice, saleEndsAt]);

  const activePrice = getActiveSalePrice(price, salePrice, saleEndsAt, now);
  const endTime = saleEndsAt ? new Date(saleEndsAt).getTime() : Number.NaN;
  const remaining =
    activePrice !== null && Number.isFinite(endTime)
      ? getRemainingTime(endTime, now)
      : null;
  const isDetail = size === "detail";

  if (activePrice === null) {
    return (
      <p
        className={
          isDetail
            ? "text-2xl font-black text-white"
            : "text-base font-black text-white md:text-2xl"
        }
      >
        {formatPrice(price)}
      </p>
    );
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={
            isDetail
              ? "text-3xl font-black text-primary md:text-4xl"
              : "text-base font-black text-primary md:text-2xl"
          }
        >
          {formatPrice(activePrice)}
        </span>
        <span
          className={
            isDetail
              ? "text-sm font-bold text-zinc-500 line-through md:text-base"
              : "text-[10px] font-bold text-zinc-500 line-through md:text-sm"
          }
        >
          {formatPrice(price)}
        </span>
      </div>
      {remaining && (
        <p
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 font-bold tabular-nums text-primary ${
            isDetail
              ? "px-3 py-1.5 text-xs md:text-sm"
              : "px-2 py-1 text-[9px] md:px-3 md:text-xs"
          }`}
        >
          <Clock3 size={isDetail ? 15 : 12} />
          <span>Fin dans {remaining}</span>
        </p>
      )}
    </div>
  );
}
