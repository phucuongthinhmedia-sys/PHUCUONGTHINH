/** Validate an email address. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate a Vietnamese phone number (10 digits, starts with 0). */
export function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone.replace(/\s/g, ""));
}

/** Validate a URL (http or https). */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate that a string is non-empty after trimming. */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/** Validate that dealer price does not exceed retail price. */
export function validatePrices(retail: number, dealer: number): boolean {
  return dealer <= retail;
}
