/**
 * Format a number as Vietnamese Dong string with dot separators.
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
 * Validate that dealer price does not exceed retail price.
 */
export function validatePrices(retail: number, dealer: number): boolean {
  return dealer <= retail;
}
