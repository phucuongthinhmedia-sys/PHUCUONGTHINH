# Design Document: Product Form Enhanced

## Overview

Nâng cấp `cms/src/components/product-form.tsx` thành form đầy đủ tính năng với 5 section rõ ràng. Không thay đổi backend schema (price lưu vào `technical_specs` JSON, social links lưu vào bảng `Media` với `media_type = "social_link"`). Toàn bộ là frontend-only changes trừ việc thêm `media_type = "social_link"` vào backend DTO validation.

## Architecture

```
cms/src/
├── components/
│   ├── product-form.tsx          ← rebuilt, orchestrates all sections
│   ├── media-uploader.tsx        ← NEW: drag & drop upload + social links
│   ├── category-picker.tsx       ← NEW: 2-level hierarchical picker
│   ├── price-section.tsx         ← NEW: price fields with formatting
│   └── spec-table.tsx            ← NEW: template-based spec editor
└── lib/
    ├── media-service.ts          ← NEW: presigned URL + media CRUD
    ├── spec-templates.ts         ← NEW: category → spec template mapping
    └── price-utils.ts            ← NEW: format/parse VND numbers
```

Backend change (minimal):

- `backend/src/media/dto/upload-media.dto.ts` — thêm `"social_link"` vào `@IsIn` list
- `backend/src/media/dto/create-media.dto.ts` — thêm `"social_link"` vào `@IsIn` list

## Components and Interfaces

### product-form.tsx (rebuilt)

Layout dạng vertical sections với sticky save button:

```
┌─────────────────────────────────────┐
│  [← Quay lại]   Tên sản phẩm       │
├─────────────────────────────────────┤
│  Section 1: Thông tin cơ bản        │
│  - Tên, SKU, Mô tả, Category Picker │
├─────────────────────────────────────┤
│  Section 2: Media & Hình ảnh        │
│  - MediaUploader (ảnh/video)        │
│  - Social Links                     │
├─────────────────────────────────────┤
│  Section 3: Giá cả                  │
│  - PriceSection                     │
├─────────────────────────────────────┤
│  Section 4: Thông số kỹ thuật       │
│  - SpecTable (template + custom)    │
├─────────────────────────────────────┤
│  Section 5: Tags & Phân loại        │
│  - Style checkboxes                 │
│  - Space checkboxes                 │
├─────────────────────────────────────┤
│  [Lưu nháp]  [Đăng sản phẩm]       │
└─────────────────────────────────────┘
```

Props interface:

```typescript
interface ProductFormProps {
  product?: Product; // undefined = create mode
  categories: Category[];
  styles: Tag[];
  spaces: Tag[];
  onSubmit: (
    data: CreateProductRequest | UpdateProductRequest,
  ) => Promise<void>;
  isLoading?: boolean;
}
```

### media-uploader.tsx

```typescript
interface MediaUploaderProps {
  productId?: string; // undefined khi create (upload sau khi tạo)
  existingMedia?: MediaItem[];
  onChange: (media: PendingMedia[]) => void;
}

interface PendingMedia {
  file?: File; // local file chờ upload
  url?: string; // social link hoặc đã upload
  media_type: MediaType;
  is_cover: boolean;
  sort_order: number;
  preview_url?: string; // blob URL cho preview
}

type MediaType = "lifestyle" | "cutout" | "video" | "social_link";
```

Upload flow:

1. User chọn file → tạo `PendingMedia` với `preview_url = URL.createObjectURL(file)`
2. Khi submit form → với mỗi `PendingMedia` có `file`:
   a. Gọi `POST /media/products/:id/presigned-url` → nhận `{ upload_url, public_url }`
   b. `PUT file` trực tiếp lên `upload_url`
   c. Gọi `POST /media` với `{ product_id, file_url: public_url, media_type, is_cover, sort_order }`

Social link flow:

1. User nhập URL → validate domain
2. Tạo `PendingMedia` với `url = socialUrl, media_type = "social_link"`
3. Khi submit → gọi `POST /media` với `{ file_url: url, media_type: "social_link" }`

### category-picker.tsx

```typescript
interface CategoryPickerProps {
  categories: Category[]; // flat list từ API
  value: string; // selected category_id
  onChange: (id: string) => void;
}
```

Build tree từ flat list:

```typescript
function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const parents = categories.filter((c) => !c.parent_id);
  return parents.map((p) => ({
    ...p,
    children: categories.filter((c) => c.parent_id === p.id),
  }));
}
```

Hiển thị dạng accordion — click parent để expand/collapse children. Breadcrumb: "Gạch Tấm Lớn > Ốp vách Sảnh & Tivi".

### price-section.tsx

```typescript
interface PriceSectionProps {
  value: PriceData;
  onChange: (data: PriceData) => void;
}

interface PriceData {
  price_retail?: number; // VNĐ, lưu raw number
  price_dealer?: number;
  unit: "M2" | "VIEN" | "BO" | "CAI" | "SET";
  price_note?: string;
}
```

Format/parse VND: `1500000` ↔ `"1.500.000"` — dùng `Intl.NumberFormat('vi-VN')`.

Lưu vào `technical_specs`:

```json
{
  "price_retail": 1500000,
  "price_dealer": 1200000,
  "unit": "M2",
  "price_note": "Giá chưa bao gồm VAT"
}
```

### spec-table.tsx

```typescript
interface SpecTableProps {
  categoryId: string;
  value: Record<string, any>;
  onChange: (specs: Record<string, any>) => void;
}

interface SpecField {
  key: string;
  label: string; // tiếng Việt
  type: "text" | "number" | "select";
  unit?: string; // "mm", "cm", "%"
  options?: string[]; // cho type = select
  placeholder?: string;
  required?: boolean;
}
```

### spec-templates.ts

```typescript
const SPEC_TEMPLATES: Record<string, SpecField[]> = {
  // Gạch Tấm Lớn & Gạch Ốp Lát
  gach: [
    {
      key: "kich_thuoc",
      label: "Kích thước",
      type: "text",
      placeholder: "VD: 600x1200mm",
      required: true,
    },
    { key: "do_day", label: "Độ dày", type: "number", unit: "mm" },
    { key: "do_hut_nuoc", label: "Độ hút nước", type: "number", unit: "%" },
    { key: "do_cung", label: "Độ cứng bề mặt (Mohs)", type: "number" },
    {
      key: "chong_tron",
      label: "Chống trơn (R)",
      type: "select",
      options: ["R9", "R10", "R11", "R12"],
    },
    {
      key: "xuat_xu",
      label: "Xuất xứ",
      type: "text",
      placeholder: "VD: Ý, Tây Ban Nha, Việt Nam",
    },
    { key: "thuong_hieu", label: "Thương hiệu", type: "text" },
  ],
  // Thiết Bị Vệ Sinh
  "thiet-bi-ve-sinh": [
    {
      key: "chat_lieu",
      label: "Chất liệu",
      type: "select",
      options: ["Sứ cao cấp", "Inox 304", "Acrylic", "Đồng mạ"],
    },
    {
      key: "mau_sac",
      label: "Màu sắc",
      type: "text",
      placeholder: "VD: Trắng bóng, Đen mờ",
    },
    {
      key: "kich_thuoc_lap_dat",
      label: "Kích thước lắp đặt",
      type: "text",
      placeholder: "VD: 360x680mm",
    },
    {
      key: "cong_nghe",
      label: "Công nghệ",
      type: "text",
      placeholder: "VD: Rimless, Tornado Flush",
    },
    { key: "xuat_xu", label: "Xuất xứ", type: "text" },
    {
      key: "bao_hanh",
      label: "Bảo hành",
      type: "text",
      placeholder: "VD: 5 năm",
    },
  ],
  // Vật Liệu Phụ Trợ
  "vat-lieu-phu-tro": [
    { key: "thanh_phan", label: "Thành phần", type: "text" },
    {
      key: "dong_goi",
      label: "Đóng gói",
      type: "text",
      placeholder: "VD: Túi 25kg",
    },
    {
      key: "thoi_gian_dong_cung",
      label: "Thời gian đông cứng",
      type: "text",
      placeholder: "VD: 24 giờ",
    },
    {
      key: "nhiet_do_su_dung",
      label: "Nhiệt độ sử dụng",
      type: "text",
      placeholder: "VD: 5°C - 35°C",
    },
    { key: "xuat_xu", label: "Xuất xứ", type: "text" },
  ],
};

function getSpecTemplate(categorySlug: string): SpecField[] {
  // Match by slug prefix
  if (categorySlug.includes("gach") || categorySlug.includes("op-lat"))
    return SPEC_TEMPLATES["gach"];
  if (categorySlug.includes("ve-sinh") || categorySlug.includes("bep"))
    return SPEC_TEMPLATES["thiet-bi-ve-sinh"];
  if (categorySlug.includes("phu-tro") || categorySlug.includes("keo"))
    return SPEC_TEMPLATES["vat-lieu-phu-tro"];
  return []; // no template, only custom fields
}
```

## Data Models

### PendingMedia (client-side only)

```typescript
interface PendingMedia {
  id?: string; // set nếu đã tồn tại trong DB
  file?: File;
  url?: string;
  media_type: "lifestyle" | "cutout" | "video" | "social_link";
  is_cover: boolean;
  sort_order: number;
  preview_url?: string;
  status: "pending" | "uploading" | "done" | "error";
}
```

### FormState

```typescript
interface FormState {
  name: string;
  sku: string;
  description: string;
  category_id: string;
  technical_specs: Record<string, any>; // includes price fields + spec fields
  style_ids: string[];
  space_ids: string[];
  pendingMedia: PendingMedia[];
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: File validation rejects invalid inputs

_For any_ file with extension not in `['jpg','jpeg','png','webp','mp4','mov']` or size > 50MB, `validateFile(file, mediaType)` SHALL return `{ valid: false }`.

**Validates: Requirements 1.1, 1.7**

### Property 2: Cover image invariant

_For any_ list of `PendingMedia`, after calling `setCover(list, index)`, at most one item in the list has `is_cover === true`, and that item is at `index`.

**Validates: Requirements 1.6**

### Property 3: Social URL domain validation

_For any_ URL string, `validateSocialUrl(url)` returns `true` if and only if the URL's hostname ends with one of `['pinterest.com', 'instagram.com', 'houzz.com', 'facebook.com']`.

**Validates: Requirements 2.1, 2.4**

### Property 4: Category tree build

_For any_ flat list of categories with parent/child relationships, `buildCategoryTree(categories)` returns a tree where every child appears under its correct parent and no category appears twice.

**Validates: Requirements 3.1**

### Property 5: Breadcrumb generation

_For any_ category tree and selected leaf `categoryId`, `getBreadcrumb(tree, categoryId)` returns a string `"Parent > Child"` where Parent is the root ancestor and Child is the selected category.

**Validates: Requirements 3.3**

### Property 6: Price format round-trip

_For any_ positive integer `n`, `parseVND(formatVND(n)) === n`.

**Validates: Requirements 4.2**

### Property 7: Dealer price validation

_For any_ pair `(retail, dealer)` where both are positive numbers, `validatePrices(retail, dealer)` returns `false` when `dealer > retail`.

**Validates: Requirements 4.4**

### Property 8: Spec merge completeness

_For any_ template spec object `T` and custom spec object `C`, `mergeSpecs(T, C)` contains all keys from both `T` and `C`, with `C` values taking precedence on key conflicts.

**Validates: Requirements 5.5**

### Property 9: Form init from existing product

_For any_ `Product` object `p`, `initFormData(p)` returns a `FormState` where `name === p.name`, `sku === p.sku`, `category_id === p.category_id`, and `technical_specs` deep-equals `p.technical_specs`.

**Validates: Requirements 6.5**

## Error Handling

- Upload fail: hiển thị lỗi inline dưới thumbnail, cho phép retry
- API 4xx: hiển thị message từ `error.response.data.error.message`
- Validation: highlight field đỏ + scroll to first error
- Network timeout: toast "Mất kết nối, vui lòng thử lại"

## Testing Strategy

**Unit tests** (Jest):

- `validateFile()` — test các extension hợp lệ/không hợp lệ, size boundary
- `validateSocialUrl()` — test các domain hợp lệ/không hợp lệ
- `buildCategoryTree()` — test flat list → tree
- `getBreadcrumb()` — test tree traversal
- `formatVND()` / `parseVND()` — test round-trip
- `validatePrices()` — test dealer > retail case
- `mergeSpecs()` — test merge với conflict
- `initFormData()` — test create vs edit mode

**Property-based tests** (fast-check):

- Property 1: file validation — generate random filenames và sizes
- Property 2: cover invariant — generate random media lists
- Property 3: URL validation — generate random URLs
- Property 4: tree build — generate random category hierarchies
- Property 6: price round-trip — generate random positive integers
- Property 7: price validation — generate random price pairs
- Property 8: spec merge — generate random spec objects
- Property 9: form init — generate random Product objects

Mỗi property test chạy tối thiểu 100 iterations.
Tag format: `// Feature: product-form-enhanced, Property N: <description>`
