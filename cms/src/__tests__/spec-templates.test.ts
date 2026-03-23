import {
  getSpecTemplate,
  mergeSpecs,
  SPEC_TEMPLATES,
} from "@/lib/spec-templates";

describe("spec-templates", () => {
  describe("getSpecTemplate", () => {
    it("returns gach template for slug containing 'gach'", () => {
      expect(getSpecTemplate("gach-tam-lon")).toEqual(SPEC_TEMPLATES["gach"]);
    });

    it("returns gach template for slug containing 'op-lat'", () => {
      expect(getSpecTemplate("op-lat-trang-tri")).toEqual(
        SPEC_TEMPLATES["gach"],
      );
    });

    it("returns thiet-bi-ve-sinh template for slug containing 've-sinh'", () => {
      expect(getSpecTemplate("thiet-bi-ve-sinh")).toEqual(
        SPEC_TEMPLATES["thiet-bi-ve-sinh"],
      );
    });

    it("returns thiet-bi-ve-sinh template for slug containing 'bep'", () => {
      expect(getSpecTemplate("thiet-bi-bep")).toEqual(
        SPEC_TEMPLATES["thiet-bi-ve-sinh"],
      );
    });

    it("returns vat-lieu-phu-tro template for slug containing 'phu-tro'", () => {
      expect(getSpecTemplate("vat-lieu-phu-tro")).toEqual(
        SPEC_TEMPLATES["vat-lieu-phu-tro"],
      );
    });

    it("returns vat-lieu-phu-tro template for slug containing 'keo'", () => {
      // "keo-xi-mang" has no 'gach'/'op-lat'/'ve-sinh'/'bep' so it falls through to phu-tro
      expect(getSpecTemplate("keo-xi-mang")).toEqual(
        SPEC_TEMPLATES["vat-lieu-phu-tro"],
      );
    });

    it("returns empty array for unknown slug", () => {
      expect(getSpecTemplate("unknown-category")).toEqual([]);
    });
  });

  describe("mergeSpecs", () => {
    it("merges two disjoint objects", () => {
      const template = { a: 1, b: 2 };
      const custom = { c: 3 };
      const result = mergeSpecs(template, custom);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("custom values override template on conflict", () => {
      const template = { a: 1, b: 2 };
      const custom = { b: 99, c: 3 };
      const result = mergeSpecs(template, custom);
      expect(result.b).toBe(99);
    });

    it("contains all keys from both objects", () => {
      const template = { x: "foo", y: "bar" };
      const custom = { z: "baz" };
      const result = mergeSpecs(template, custom);
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["x", "y", "z"]),
      );
    });

    it("handles empty template", () => {
      expect(mergeSpecs({}, { a: 1 })).toEqual({ a: 1 });
    });

    it("handles empty custom", () => {
      expect(mergeSpecs({ a: 1 }, {})).toEqual({ a: 1 });
    });
  });
});
