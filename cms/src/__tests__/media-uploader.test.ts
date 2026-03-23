/**
 * Feature: product-form-enhanced
 * Property 2: Cover image invariant
 * Validates: Requirements 1.6
 */

import * as fc from "fast-check";
import { setCover, PendingMedia } from "../components/media-uploader";

// ─── Arbitrary: generate a PendingMedia item ──────────────────────────────────

const pendingMediaArb = fc
  .record({
    clientId: fc.string({ minLength: 1 }),
    media_type: fc.constantFrom(
      "lifestyle" as const,
      "cutout" as const,
      "video" as const,
    ),
    is_cover: fc.boolean(),
    sort_order: fc.nat(),
    status: fc.constantFrom("pending" as const, "done" as const),
  })
  .map(
    (r): PendingMedia => ({
      ...r,
      url: undefined,
      file: undefined,
      preview_url: undefined,
    }),
  );

const nonEmptyListArb = fc.array(pendingMediaArb, {
  minLength: 1,
  maxLength: 20,
});

// ─── Property 2: Cover image invariant ───────────────────────────────────────

describe("Property 2: Cover image invariant", () => {
  it("after setCover(list, index), exactly one item has is_cover === true and it is at the given index", () => {
    fc.assert(
      fc.property(nonEmptyListArb, fc.nat(), (list, rawIndex) => {
        const index = rawIndex % list.length;
        const result = setCover(list, index);

        // Exactly one cover
        const coverCount = result.filter((i) => i.is_cover).length;
        expect(coverCount).toBe(1);

        // The cover is at the correct index
        expect(result[index].is_cover).toBe(true);

        // All other items have is_cover === false
        result.forEach((item, i) => {
          if (i !== index) {
            expect(item.is_cover).toBe(false);
          }
        });
      }),
      { numRuns: 100 },
    );
  });

  it("setCover does not mutate the original list", () => {
    fc.assert(
      fc.property(nonEmptyListArb, fc.nat(), (list, rawIndex) => {
        const index = rawIndex % list.length;
        const originalCovers = list.map((i) => i.is_cover);
        setCover(list, index);
        // Original list unchanged
        list.forEach((item, i) => {
          expect(item.is_cover).toBe(originalCovers[i]);
        });
      }),
      { numRuns: 100 },
    );
  });
});
