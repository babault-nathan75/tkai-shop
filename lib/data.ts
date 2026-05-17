export const formatPrice = (v: number) =>
  new Intl.NumberFormat("fr-FR").format(v) + " FCFA";
