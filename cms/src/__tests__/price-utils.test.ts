import { formatVND, parseVND, validatePrices } from "@/lib/price-utils";

describe("price-utils", () => {
  describe("formatVND", () => {
    it("formats a million correctly", () => {
      expect(formatVND(1500000)).toBe("1.500.000");
    });

    it("formats zero", () => {
      expect(formatVND(0)).toBe("0");
    });

    it("formats a small number", () => {
      expect(formatVND(500)).toBe("500");
    });

    it("formats a large number", () => {
      expect(formatVND(10000000)).toBe("10.000.000");
    });
  });

  describe("parseVND", () => {
    it("parses a formatted VND string", () => {
      expect(parseVND("1.500.000")).toBe(1500000);
    });

    it("parses zero string", () => {
      expect(parseVND("0")).toBe(0);
    });

    it("parses a plain number string", () => {
      expect(parseVND("500")).toBe(500);
    });

    it("returns 0 for non-numeric input", () => {
      expect(parseVND("abc")).toBe(0);
    });
  });

  describe("formatVND / parseVND round-trip", () => {
    it("round-trips 1500000", () => {
      expect(parseVND(formatVND(1500000))).toBe(1500000);
    });

    it("round-trips 999000", () => {
      expect(parseVND(formatVND(999000))).toBe(999000);
    });

    it("round-trips 1", () => {
      expect(parseVND(formatVND(1))).toBe(1);
    });
  });

  describe("validatePrices", () => {
    it("returns true when dealer < retail", () => {
      expect(validatePrices(1500000, 1200000)).toBe(true);
    });

    it("returns true when dealer === retail", () => {
      expect(validatePrices(1000000, 1000000)).toBe(true);
    });

    it("returns false when dealer > retail", () => {
      expect(validatePrices(1000000, 1200000)).toBe(false);
    });
  });
});
