export const fmtMoney = (value: number | null | undefined, precision = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "Unavailable";
  if (Math.abs(value) < 0.01 && value !== 0) return `$${value.toExponential(2)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: precision }).format(value);
};

export const fmtPct = (value: number | null | undefined) => value === null || value === undefined ? "Unavailable" : `${(value * 100).toFixed(0)}%`;

export const fmtPctWhole = (value: number | null | undefined) => value === null || value === undefined ? "Unavailable" : `${value.toFixed(0)}%`;

export const short = (value: string, left = 6, right = 4) => value.length <= left + right + 3 ? value : `${value.slice(0, left)}...${value.slice(-right)}`;
