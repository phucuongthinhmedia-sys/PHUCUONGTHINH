/**
 * Format a number as Vietnamese Dong (VND) with dot separators.
 * e.g. 1500000 → "1.500.000"
 */
export function formatVND(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    useGrouping: true,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/\u00a0/g, ".")
    .replace(/,/g, ".");
}

/**
 * Parse a VND-formatted string back to a number.
 * e.g. "1.500.000" → 1500000
 */
export function parseVND(s: string): number {
  const cleaned = s.replace(/[.\s\u00a0]/g, "").replace(/,/g, "");
  const result = parseInt(cleaned, 10);
  return isNaN(result) ? 0 : result;
}

/**
 * Format a number as a generic currency string.
 */
export function formatCurrency(
  amount: number,
  currency = "VND",
  locale = "vi-VN",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a Date or ISO string to a localised date string.
 */
export function formatDate(
  value: Date | string,
  locale = "vi-VN",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format a Date or ISO string to a localised date-time string.
 */
export function formatDateTime(value: Date | string, locale = "vi-VN"): string {
  return formatDate(value, locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a plain number with thousand separators.
 */
export function formatNumber(n: number, locale = "vi-VN"): string {
  return new Intl.NumberFormat(locale).format(n);
}
