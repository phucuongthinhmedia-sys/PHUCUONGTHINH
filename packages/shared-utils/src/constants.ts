/** API endpoint paths (relative to base URL). */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_ME: "/auth/me",

  // Products
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,

  // Categories
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // Tags
  TAGS: "/tags",
  TAG_BY_ID: (id: string) => `/tags/${id}`,

  // Media
  MEDIA: "/media",
  MEDIA_BY_ID: (id: string) => `/media/${id}`,

  // Leads
  LEADS: "/leads",
  LEAD_BY_ID: (id: string) => `/leads/${id}`,

  // Import
  IMPORT_JOBS: "/import/jobs",
  IMPORT_JOB_BY_ID: (id: string) => `/import/jobs/${id}`,
  IMPORT_JOB_PREVIEW: (id: string) => `/import/jobs/${id}/preview`,
  IMPORT_JOB_CONFIRM: (id: string) => `/import/jobs/${id}/confirm`,
} as const;

/** HTTP status codes used across the app. */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** Common error messages. */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
  NOT_FOUND: "Không tìm thấy dữ liệu.",
  SERVER_ERROR: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
  NETWORK_ERROR: "Không thể kết nối đến máy chủ.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
} as const;

/** localStorage keys. */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "cms_auth_token",
  AUTH_USER: "cms_auth_user",
} as const;
