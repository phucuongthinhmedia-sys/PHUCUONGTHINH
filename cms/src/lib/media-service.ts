import axios from "axios";
import { apiClient } from "./api-client";

export type MediaType =
  | "lifestyle"
  | "cutout"
  | "video"
  | "3d_file"
  | "pdf"
  | "social_link";

export interface CreateMediaDto {
  product_id: string;
  file_url: string;
  file_type: string;
  media_type: MediaType;
  is_cover?: boolean;
  sort_order?: number;
  alt_text?: string;
}

export interface MediaRecord {
  id: string;
  product_id: string;
  file_url: string;
  media_type: MediaType;
  is_cover: boolean;
  sort_order: number;
  alt_text?: string;
  created_at: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  public_url: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  lifestyle: ["jpg", "jpeg", "png", "webp"],
  cutout: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov"],
  "3d_file": ["obj", "fbx", "glb", "gltf", "skp"],
  pdf: ["pdf"],
  social_link: [],
};

const ALL_IMAGE_VIDEO_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "mp4", "mov"];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_SOCIAL_DOMAINS = [
  "pinterest.com",
  "instagram.com",
  "houzz.com",
  "facebook.com",
];

/**
 * Validate a file before uploading.
 * Checks extension and size (max 50 MB).
 */
export function validateFile(
  file: File,
  mediaType: string,
): FileValidationResult {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowed =
    ALLOWED_EXTENSIONS[mediaType as MediaType] ?? ALL_IMAGE_VIDEO_EXTENSIONS;

  if (!allowed.includes(ext)) {
    return {
      valid: false,
      error: `Định dạng không hợp lệ. Chấp nhận: ${allowed.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "File vượt quá 50MB" };
  }

  return { valid: true };
}

/**
 * Validate that a URL belongs to one of the allowed social domains.
 */
export function validateSocialUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_SOCIAL_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

/**
 * Request a presigned S3 upload URL from the backend.
 */
export async function getPresignedUrl(
  productId: string,
  filename: string,
  mediaType: MediaType,
  contentType: string,
): Promise<PresignedUrlResponse> {
  return apiClient.post<PresignedUrlResponse>(
    `/media/products/${productId}/presigned-url`,
    { filename, media_type: mediaType, content_type: contentType },
  );
}

/**
 * Upload a file directly to S3 using a presigned PUT URL or to local storage.
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<void> {
  // Check if it's a local storage URL
  if (uploadUrl.includes("/api/v1/media/upload")) {
    // Extract key from URL
    const url = new URL(uploadUrl);
    const key = url.pathname.replace("/api/v1/media/upload/", "");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", decodeURIComponent(key));

    // POST to /api/v1/media/upload
    const baseUrl = uploadUrl.split("/api/v1/media/upload")[0];
    await axios.post(`${baseUrl}/api/v1/media/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
  } else {
    // S3 presigned URL
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
  }
}

/**
 * Create a media record in the database after a successful upload.
 */
export async function createMediaRecord(
  data: CreateMediaDto,
): Promise<MediaRecord> {
  return apiClient.post<MediaRecord>("/media", data);
}

/**
 * Delete a media record by ID.
 */
export async function deleteMedia(id: string): Promise<void> {
  await apiClient.delete(`/media/${id}`);
}

/**
 * Update sort order for multiple media items of a product.
 * `orders` is an array of { id, sort_order } pairs.
 */
export async function updateSortOrder(
  productId: string,
  orders: Array<{ id: string; sort_order: number }>,
): Promise<void> {
  await apiClient.patch(`/media/products/${productId}/sort-order`, orders);
}

/**
 * Media service instance for managing media operations
 */
export const mediaService = {
  validateFile,
  validateSocialUrl,
  getPresignedUrl,
  uploadFileToS3,
  createMediaRecord,
  deleteMedia,
  updateSortOrder,
};
