export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  lifestyle: ['jpg', 'jpeg', 'png', 'webp'],
  cutout: ['jpg', 'jpeg', 'png', 'webp'],
  showcase: ['jpg', 'jpeg', 'png', 'webp'],
  video: ['mp4', 'webm', 'mov'],
  '3d_file': ['dwg', 'obj', 'fbx', 'dae', 'blend', 'glb', 'gltf', 'skp'],
  pdf: ['pdf'],
  social_link: [], // URL-based, no file extension validation
};

export const MAX_FILE_SIZES: Record<string, number> = {
  lifestyle: 10 * 1024 * 1024, // 10MB
  cutout: 10 * 1024 * 1024, // 10MB
  showcase: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  '3d_file': 50 * 1024 * 1024, // 50MB
  pdf: 20 * 1024 * 1024, // 20MB
  social_link: 0, // N/A
};

export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const UPLOAD_ENDPOINT_MAX_SIZE = 50 * 1024 * 1024; // 50MB (Multer hard limit)

export function validateFileType(filename: string, mediaType: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  const allowed = ALLOWED_FILE_TYPES[mediaType];
  if (!allowed) return false;
  if (allowed.length === 0) return true; // social_link: no file
  return allowed.includes(ext);
}

export function validateFileSize(fileSize: number, mediaType: string): boolean {
  const max = MAX_FILE_SIZES[mediaType] ?? DEFAULT_MAX_FILE_SIZE;
  return fileSize <= max;
}
