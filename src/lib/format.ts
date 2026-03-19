export function formatMoney(priceCents: number, currency: string) {
  const value = priceCents / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(0)}`;
  }
}

