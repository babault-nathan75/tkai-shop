export function getActiveSalePrice(
  price: number,
  salePrice: number | null | undefined,
  saleEndsAt: Date | string | null | undefined,
  now = Date.now()
) {
  if (salePrice == null || !saleEndsAt || salePrice <= 0 || salePrice >= price) {
    return null;
  }

  const endTime =
    saleEndsAt instanceof Date ? saleEndsAt.getTime() : new Date(saleEndsAt).getTime();

  return Number.isFinite(endTime) && endTime > now ? salePrice : null;
}

export function getPromotionFromForm(formData: FormData, price: number) {
  if (formData.get("promoEnabled") !== "on") {
    return { salePrice: null, saleEndsAt: null };
  }

  const salePrice = Number(formData.get("salePrice"));
  const days = Number(formData.get("promoDays"));
  const hours = Number(formData.get("promoHours"));

  if (!Number.isInteger(salePrice) || salePrice <= 0 || salePrice >= price) {
    throw new Error("Le prix promotionnel doit être positif et inférieur au prix normal.");
  }

  if (
    !Number.isInteger(days) ||
    days < 0 ||
    days > 3650 ||
    !Number.isInteger(hours) ||
    hours < 0 ||
    hours > 23 ||
    days * 24 + hours <= 0
  ) {
    throw new Error("La durée doit être d’au moins une heure.");
  }

  const durationMs = (days * 24 + hours) * 60 * 60 * 1000;
  return {
    salePrice,
    saleEndsAt: new Date(Date.now() + durationMs),
  };
}
