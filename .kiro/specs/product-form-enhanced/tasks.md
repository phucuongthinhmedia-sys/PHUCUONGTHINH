# Implementation Plan: Product Form Enhanced

## Overview

Nâng cấp form đăng sản phẩm CMS theo từng bước incremental. Mỗi task build trên task trước, kết thúc bằng wiring toàn bộ vào form chính.

## Tasks

- [x] 1. Backend: thêm `social_link` vào media type validation
  - Thêm `"social_link"` vào `@IsIn` list trong `create-media.dto.ts` và `upload-media.dto.ts`
  - _Requirements: 2.2_

- [x] 2. Utility functions và spec templates
  - [x] 2.1 Tạo `cms/src/lib/price-utils.ts`
    - `formatVND(n: number): string` — format số thành "1.500.000"
    - `parseVND(s: string): number` — parse "1.500.000" thành 1500000
    - `validatePrices(retail: number, dealer: number): boolean`
    - _Requirements: 4.2, 4.4_
  - [ ]\* 2.2 Viết property tests cho price-utils
    - **Property 6: Price format round-trip** — `parseVND(formatVND(n)) === n`
    - **Property 7: Dealer price validation** — `validatePrices(retail, dealer)` false khi dealer > retail
    - **Validates: Requirements 4.2, 4.4**
  - [x] 2.3 Tạo `cms/src/lib/spec-templates.ts`
    - Interface `SpecField` với key, label, type, unit, options, placeholder, required
    - `SPEC_TEMPLATES` map cho 3 nhóm: gach, thiet-bi-ve-sinh, vat-lieu-phu-tro
    - `getSpecTemplate(categorySlug: string): SpecField[]`
    - `mergeSpecs(template: Record<string, any>, custom: Record<string, any>): Record<string, any>`
    - _Requirements: 5.1, 5.2, 5.5_
  - [ ]\* 2.4 Viết property tests cho spec-templates
    - **Property 8: Spec merge completeness** — merge chứa tất cả keys từ cả hai objects
    - **Validates: Requirements 5.5**
  - [x] 2.5 Tạo `cms/src/lib/media-service.ts`
    - `getPresignedUrl(productId, filename, mediaType, contentType)`
    - `createMediaRecord(data: CreateMediaDto)`
    - `deleteMedia(id: string)`
    - `updateSortOrder(productId, orders)`
    - `validateFile(file: File, mediaType: string): { valid: boolean; error?: string }`
    - `validateSocialUrl(url: string): boolean`
    - _Requirements: 1.1, 1.3, 1.4, 1.7, 2.1_
  - [ ]\* 2.6 Viết property tests cho media-service utils
    - **Property 1: File validation** — invalid extension hoặc size > 50MB → valid: false
    - **Property 3: Social URL domain validation** — chỉ accept đúng 4 domains
    - **Validates: Requirements 1.1, 1.7, 2.1**

- [x] 3. Checkpoint — chạy tất cả tests, đảm bảo utilities hoạt động đúng

- [x] 4. Component: CategoryPicker
  - [x] 4.1 Tạo `cms/src/components/category-picker.tsx`
    - `buildCategoryTree(categories: Category[]): CategoryNode[]`
    - Accordion UI: click parent → expand children
    - Hiển thị breadcrumb khi đã chọn: "Nhóm > Danh mục"
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]\* 4.2 Viết property tests cho category tree logic
    - **Property 4: Category tree build** — mọi child xuất hiện đúng dưới parent, không duplicate
    - **Property 5: Breadcrumb generation** — trả về "Parent > Child" đúng
    - **Validates: Requirements 3.1, 3.3**

- [x] 5. Component: PriceSection
  - Tạo `cms/src/components/price-section.tsx`
  - Fields: giá bán lẻ (formatted input), giá đại lý (optional), đơn vị tính (select: m², viên, bộ, cái, set), ghi chú giá
  - Dùng `formatVND`/`parseVND` từ price-utils
  - Validate dealer ≤ retail inline
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Component: SpecTable
  - Tạo `cms/src/components/spec-table.tsx`
  - Nhận `categoryId` prop, tự load template qua `getSpecTemplate`
  - Render template fields với label tiếng Việt, input phù hợp (text/number/select)
  - Section "Thông số tùy chỉnh": thêm key-value tự do
  - Visual phân biệt: trường bắt buộc có dấu \*, trường đã điền highlight nhẹ
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 7. Component: MediaUploader
  - Tạo `cms/src/components/media-uploader.tsx`
  - [x] 7.1 Drag & drop zone + file input, preview thumbnails
    - Validate file trước khi thêm vào queue
    - Hiển thị progress bar khi upload
    - _Requirements: 1.1, 1.2, 1.3, 1.7_
  - [x] 7.2 Cover image selection và sort order
    - Click để chọn ảnh bìa (is_cover), enforce invariant: chỉ 1 ảnh bìa
    - Drag để reorder (sort_order)
    - _Requirements: 1.5, 1.6_
  - [x] 7.3 Viết property test cho cover invariant
    - **Property 2: Cover image invariant** — sau setCover, đúng 1 item có is_cover = true
    - **Validates: Requirements 1.6**

  - [x] 7.4 Social links panel
    - Input URL + validate domain + hiển thị platform icon
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8. Checkpoint — kiểm tra từng component render đúng, không có lỗi TypeScript

- [x] 9. Rebuild product-form.tsx
  - [x] 9.1 Tổ chức lại thành 5 sections với tiêu đề rõ ràng
    - Section 1: Thông tin cơ bản (name, sku, description, CategoryPicker)
    - Section 2: Media & Hình ảnh (MediaUploader)
    - Section 3: Giá cả (PriceSection)
    - Section 4: Thông số kỹ thuật (SpecTable — nhận categoryId từ section 1)
    - Section 5: Tags & Phân loại (style/space checkboxes)
    - _Requirements: 6.1_
  - [x] 9.2 Submit flow
    - Validate required fields, scroll to first error
    - Create mode: tạo product → upload pending media → tạo media records
    - Edit mode: update product → xử lý media mới/xóa/reorder
    - Toast notification khi thành công/thất bại
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  - [ ]\* 9.3 Viết property test cho form initialization
    - **Property 9: Form init từ existing product** — initFormData(p) trả về FormState đúng
    - **Validates: Requirements 6.5**

- [x] 10. Cập nhật new/page.tsx và [id]/page.tsx
  - Truyền đúng props vào ProductForm mới
  - Đảm bảo edit page load existing media vào MediaUploader
  - _Requirements: 6.5_

- [x] 11. Final checkpoint — chạy toàn bộ tests, kiểm tra end-to-end create và edit flow

## Notes

- Tasks đánh dấu `*` là optional (tests) — có thể skip để ra MVP nhanh hơn
- Price lưu vào `technical_specs` JSON, không cần migration DB
- Social links dùng bảng `Media` hiện có, chỉ cần thêm `"social_link"` vào DTO validation
- Upload S3 chỉ hoạt động khi backend có AWS credentials — trong dev có thể mock bằng cách lưu base64 hoặc dùng local URL
