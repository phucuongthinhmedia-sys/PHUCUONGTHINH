# Implementation Plan: Catalogue Bulk Import

## Overview

Triển khai tính năng import hàng loạt từ PDF catalogue theo từng bước incremental. Tập trung vào MVP: upload → AI extract → preview → bulk create. Bỏ qua tests phức tạp, ưu tiên chức năng hoạt động.

## Tasks

- [x] 1. Setup Backend Infrastructure
  - [x] 1.1 Cài đặt dependencies
    - Thêm vào `backend/package.json`: `@bull-board/api`, `@bull-board/nestjs`, `bull`, `pdf-lib`, `canvas`, `openai`
    - Run `npm install`
    - _Requirements: 2.1_
  - [x] 1.2 Setup Bull queue module
    - Tạo `backend/src/import/import.module.ts` với BullModule.registerQueue
    - Configure Redis connection (localhost:6379 trong dev)
    - _Requirements: 2.1, 7.1_
  - [x] 1.3 Tạo Prisma schema cho ImportJob và ExtractedProduct
    - Thêm models vào `backend/prisma/schema.prisma`
    - Run `npx prisma migrate dev --name add-import-tables`
    - _Requirements: 7.1, 3.1_

- [x] 2. Backend: PDF Processing Service
  - [x] 2.1 Tạo `backend/src/import/pdf.service.ts`
    - Method `convertToImages(pdfPath: string): Promise<Buffer[]>`
    - Sử dụng `pdf-lib` để load PDF
    - Sử dụng `canvas` để render từng trang thành PNG
    - _Requirements: 2.1_
  - [x] 2.2 Tạo `backend/src/import/storage.service.ts`
    - Method `savePDF(file: Express.Multer.File): Promise<string>` - lưu vào `uploads/catalogues/`
    - Method `saveImage(buffer: Buffer, filename: string): Promise<string>`
    - _Requirements: 1.3_

- [x] 3. Backend: AI Service
  - [x] 3.1 Tạo `backend/src/import/ai.service.ts`
    - Setup OpenAI client với API key từ env
    - Method `extractProducts(imageBuffer: Buffer, pageNumber: number): Promise<ExtractedProduct[]>`
    - Implement prompt engineering với structured output
    - _Requirements: 2.2, 2.3_
  - [x] 3.2 Implement retry logic với exponential backoff
    - Wrapper function `callWithRetry(fn, maxRetries = 3)`
    - Delays: 1s, 2s, 4s
    - _Requirements: 2.6, 8.1_

- [ ] 4. Backend: Import Processor (Bull Job)
  - [ ] 4.1 Tạo `backend/src/import/import.processor.ts`
    - Decorator `@Processor('import-queue')`
    - Method `handleExtraction(job: Job)` - xử lý từng trang PDF
    - Update progress: `job.progress(percentage)`
    - _Requirements: 2.1, 2.4, 7.2_
  - [ ] 4.2 Implement error handling
    - Try-catch cho từng trang
    - Lưu failed pages vào ImportJob.failed_pages
    - Continue với trang tiếp theo nếu 1 trang fail
    - _Requirements: 2.6, 8.2_

- [ ] 5. Backend: Import Controller & Service
  - [ ] 5.1 Tạo `backend/src/import/import.controller.ts`
    - `POST /import/upload` - upload PDF, tạo job
    - `GET /import/jobs/:id` - get job status
    - `GET /import/jobs/:id/products` - get extracted products
    - `POST /import/jobs/:id/bulk-create` - bulk create products
    - _Requirements: 1.1, 6.1, 7.1_
  - [ ] 5.2 Tạo `backend/src/import/import.service.ts`
    - `createJob(file)` - validate, save file, create DB record, add to queue
    - `getJobStatus(id)` - return job với progress
    - `getExtractedProducts(id)` - return products với validation status
    - `bulkCreateProducts(jobId, productIds)` - tạo products từ extracted data
    - _Requirements: 1.2, 1.3, 6.1, 6.2_
  - [ ] 5.3 Implement validation logic
    - Validate file: isPDF, size < 50MB
    - Validate extracted product: name required, SKU unique
    - Set validation_status: VALID/WARNING/ERROR
    - _Requirements: 1.2, 1.5, 3.2, 6.3_

- [ ] 6. Backend: Category Mapping
  - [ ] 6.1 Tạo `backend/src/import/category-mapper.service.ts`
    - Method `mapCategory(productName: string): string | null`
    - Keyword matching: "gạch" → find category with slug "gach"
    - Return category_id hoặc null nếu không match
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 7. Checkpoint - Test backend với Postman
  - Upload PDF qua POST /import/upload
  - Check job status qua GET /import/jobs/:id
  - Verify extracted products trong database
  - _Requirements: All backend requirements_

- [ ] 8. Frontend: Upload Page
  - [ ] 8.1 Tạo `cms/src/app/dashboard/import/page.tsx`
    - File dropzone component (drag & drop hoặc click)
    - Validate file client-side (PDF, < 50MB)
    - Upload button → POST /api/v1/import/upload
    - Redirect to job status page sau khi upload
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ] 8.2 Tạo `cms/src/lib/import-service.ts`
    - `uploadCatalogue(file: File): Promise<{ job_id: string }>`
    - `getJob(jobId: string): Promise<ImportJob>`
    - `getExtractedProducts(jobId: string): Promise<ExtractedProduct[]>`
    - `bulkCreate(jobId: string, productIds: string[]): Promise<BulkCreateResult>`
    - _Requirements: 1.3, 6.1_

- [ ] 9. Frontend: Job Status Page
  - [ ] 9.1 Tạo `cms/src/app/dashboard/import/[jobId]/page.tsx`
    - Poll job status mỗi 2 giây (useQuery với refetchInterval)
    - Hiển thị progress bar (0-100%)
    - Hiển thị "X / Y trang đã xử lý"
    - Auto-redirect to preview khi status = COMPLETED
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 10. Frontend: Preview Grid
  - [ ] 10.1 Tạo `cms/src/app/dashboard/import/[jobId]/preview/page.tsx`
    - Fetch extracted products
    - Hiển thị grid 4 cột với ProductCard
    - Checkbox "Select All" và checkbox từng sản phẩm
    - Button "Import X sản phẩm đã chọn"
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  - [ ] 10.2 Tạo `cms/src/components/import/product-card.tsx`
    - Hiển thị thumbnail (nếu có), tên, SKU, giá
    - Border màu theo status: green (valid), yellow (warning), red (error)
    - Hiển thị validation errors nếu có
    - Button "Chỉnh sửa" → mở edit modal
    - _Requirements: 3.2_

- [ ] 11. Frontend: Edit Modal
  - [ ] 11.1 Tạo `cms/src/components/import/edit-product-modal.tsx`
    - Form với các trường: name, sku, description, category, price, specs
    - Real-time validation (name required, SKU unique)
    - Button "Lưu" → update extracted product trong staging table
    - Highlight trường đã edit (khác với AI output)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 12. Frontend: Bulk Import Flow
  - [ ] 12.1 Implement bulk create handler
    - Gọi `POST /import/jobs/:id/bulk-create` với selected product IDs
    - Hiển thị progress modal trong khi tạo
    - Hiển thị summary: X succeeded, Y failed (với lý do)
    - Redirect to /dashboard/products?filter=draft
    - _Requirements: 6.1, 6.4, 6.5, 6.6_
  - [ ] 12.2 Handle errors
    - Nếu có sản phẩm lỗi (SKU trùng), giữ lại trong preview
    - Cho phép user sửa và retry
    - _Requirements: 6.7_

- [ ] 13. Frontend: Job History (Optional - có thể bỏ MVP)
  - Tạo trang danh sách các import jobs đã chạy
  - Hiển thị: file name, status, số sản phẩm, thời gian
  - _Requirements: 7.5_

- [ ] 14. Environment Setup
  - [ ] 14.1 Thêm env variables
    - Backend `.env`: `OPENAI_API_KEY`, `REDIS_URL`
    - CMS `.env.local`: `NEXT_PUBLIC_API_URL`
    - _Requirements: 2.2_
  - [ ] 14.2 Setup Redis (Docker)
    - Thêm Redis service vào `docker-compose.yml`
    - Hoặc hướng dẫn install Redis local
    - _Requirements: 2.1_

- [ ] 15. Final Testing & Polish
  - [ ] 15.1 End-to-end test với real PDF
    - Upload catalogue thật
    - Verify AI extraction quality
    - Test edit flow
    - Test bulk import
    - Verify products xuất hiện trong /dashboard/products
    - _Requirements: All_
  - [ ] 15.2 Error handling polish
    - Toast notifications cho success/error
    - Loading states cho tất cả async operations
    - Graceful degradation khi AI API fail
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 16. Documentation
  - Tạo README.md trong `backend/src/import/` với:
    - Setup instructions (Redis, OpenAI API key)
    - API endpoints documentation
    - Troubleshooting guide
  - Tạo user guide cho CMS staff về cách sử dụng import feature

## Notes

- **MVP Focus**: Bỏ qua property-based tests, chỉ test thủ công
- **AI Cost**: Ước tính $0.01-0.05/trang, monitor usage trong dev
- **Redis**: Cần chạy Redis server (Docker hoặc local)
- **OpenAI API Key**: Cần account OpenAI với credits
- **PDF Quality**: Kết quả tốt nhất với PDF có text layer (không phải scan ảnh)
- **Fallback**: Nếu GPT-4 Vision không khả dụng, có thể dùng Claude 3.5 Sonnet (cần update AIService)
