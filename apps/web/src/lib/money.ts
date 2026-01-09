const egp = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEGP(value: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "EGP 0.00";
  return egp.format(n);
}
