import { validateFile, validateSocialUrl } from "@/lib/media-service";

// Helper to create a File-like object with a controlled size
function makeFile(name: string, sizeBytes: number): File {
  const file = new File(["x"], name, { type: "image/jpeg" });
  Object.defineProperty(file, "size", { value: sizeBytes, configurable: true });
  return file;
}

describe("media-service utils", () => {
  describe("validateFile", () => {
    it("accepts valid jpg for lifestyle", () => {
      const file = makeFile("photo.jpg", 1024);
      expect(validateFile(file, "lifestyle").valid).toBe(true);
    });

    it("accepts valid webp for cutout", () => {
      const file = makeFile("image.webp", 1024);
      expect(validateFile(file, "cutout").valid).toBe(true);
    });

    it("accepts valid mp4 for video", () => {
      const file = makeFile("clip.mp4", 1024);
      expect(validateFile(file, "video").valid).toBe(true);
    });

    it("rejects invalid extension for lifestyle", () => {
      const file = makeFile("doc.pdf", 1024);
      const result = validateFile(file, "lifestyle");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("rejects file over 50MB", () => {
      const file = makeFile("big.jpg", 51 * 1024 * 1024);
      const result = validateFile(file, "lifestyle");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("50MB");
    });

    it("accepts file exactly at 50MB boundary", () => {
      const file = makeFile("exact.jpg", 50 * 1024 * 1024);
      expect(validateFile(file, "lifestyle").valid).toBe(true);
    });

    it("rejects mp4 for lifestyle (wrong type)", () => {
      const file = makeFile("video.mp4", 1024);
      expect(validateFile(file, "lifestyle").valid).toBe(false);
    });
  });

  describe("validateSocialUrl", () => {
    it("accepts pinterest.com URL", () => {
      expect(validateSocialUrl("https://www.pinterest.com/pin/123")).toBe(true);
    });

    it("accepts instagram.com URL", () => {
      expect(validateSocialUrl("https://instagram.com/p/abc")).toBe(true);
    });

    it("accepts houzz.com URL", () => {
      expect(validateSocialUrl("https://houzz.com/photos/123")).toBe(true);
    });

    it("accepts facebook.com URL", () => {
      expect(validateSocialUrl("https://www.facebook.com/post/123")).toBe(true);
    });

    it("rejects unknown domain", () => {
      expect(validateSocialUrl("https://twitter.com/user")).toBe(false);
    });

    it("rejects malformed URL", () => {
      expect(validateSocialUrl("not-a-url")).toBe(false);
    });

    it("rejects empty string", () => {
      expect(validateSocialUrl("")).toBe(false);
    });
  });
});
