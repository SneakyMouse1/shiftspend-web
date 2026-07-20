// Single source of truth for all currency-related data and formatting.

export const CURRENCIES = [
  { code: "USD", label: "USD ($)", symbol: "$" },
  { code: "EUR", label: "EUR (€)", symbol: "€" },
  { code: "GBP", label: "GBP (£)", symbol: "£" },
  { code: "CNY", label: "CNY (¥)", symbol: "¥" },
  { code: "JPY", label: "JPY (¥)", symbol: "¥" },
  { code: "RUB", label: "RUB (₽)", symbol: "₽" },
];

// Derived map for O(1) symbol lookup
const CURRENCY_SYMBOLS = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.symbol])
);

export const getCurrencySymbol = (code) =>
  CURRENCY_SYMBOLS[code?.toUpperCase()] ?? "€";

export const formatCurrency = (amount, code = "EUR") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      useGrouping: Math.abs(amount) >= 10000,
    }).format(amount);
  } catch {
    return `${amount} ${code}`;
  }
};

export const formatCompact = (amount, code = "EUR") => {
  const sym = getCurrencySymbol(code);
  if (Math.abs(amount) >= 1000) return `${sym}${(amount / 1000).toFixed(1)}k`;
  return `${sym}${Number(amount).toFixed(0)}`;
};
