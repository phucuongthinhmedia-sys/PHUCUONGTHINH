# Design Document: Catalogue Bulk Import

## Overview

Hệ thống import hàng loạt sản phẩm từ PDF catalogue sử dụng AI Vision API. Workflow: Upload PDF → Background job xử lý từng trang → AI trích xuất → Preview grid → User edit → Bulk create draft products. Tập trung vào MVP: đơn giản, hiệu quả, dễ maintain.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CMS Frontend                         │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Upload Page    │→ │ Job Status   │→ │ Preview Grid    │ │
│  │ (PDF file)     │  │ (Progress)   │  │ (Edit & Import) │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                        │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Import         │→ │ Bull Queue   │→ │ AI Service      │ │
│  │ Controller     │  │ (Jobs)       │  │ (GPT-4 Vision)  │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│           ↓                  ↓                   ↓           │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Import Job     │  │ Extracted    │  │ Product         │ │
│  │ Table          │  │ Product Table│  │ Table           │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────┐
                    │ OpenAI API       │
                    │ (GPT-4 Vision)   │
                    └──────────────────┘
```

**Tech Stack:**

- Frontend: Next.js 14, React, TailwindCSS
- Backend: NestJS, Bull (Redis queue), Prisma ORM
- AI: OpenAI GPT-4 Vision API (fallback: Claude 3.5 Sonnet)
- PDF Processing: `pdf-lib` + `canvas` (convert PDF → images)
- Storage: S3 (hoặc local filesystem trong dev)

## Components and Interfaces

### Frontend Components

#### 1. UploadPage (`cms/src/app/dashboard/import/page.tsx`)

```typescript
export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    // POST /api/v1/import/upload
    // → returns { job_id, status: "pending" }
    // → redirect to /dashboard/import/[job_id]
  };

  return (
    <div>
      <h1>Import Catalogue</h1>
      <FileDropzone onFileSelect={setFile} />
      <Button onClick={handleUpload}>Bắt đầu xử lý</Button>
    </div>
  );
}
```

#### 2. JobStatusPage (`cms/src/app/dashboard/import/[jobId]/page.tsx`)

```typescript
export default function JobStatusPage({ params }: { params: { jobId: string } }) {
  const { data: job } = useQuery({
    queryKey: ['import-job', params.jobId],
    queryFn: () => importService.getJob(params.jobId),
    refetchInterval: 2000, // poll every 2s
  });

  if (job.status === 'completed') {
    // redirect to preview
    router.push(`/dashboard/import/${params.jobId}/preview`);
  }

  return (
    <div>
      <ProgressBar value={job.progress} />
      <p>{job.current_page} / {job.total_pages} trang</p>
      <p>Ước tính: {job.estimated_time_remaining}s</p>
    </div>
  );
}
```

#### 3. PreviewGrid (`cms/src/app/dashboard/import/[jobId]/preview/page.tsx`)

```typescript
interface ExtractedProduct {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category_id?: string;
  technical_specs: Record<string, any>;
  price_retail?: number;
  images: string[]; // URLs extracted from PDF
  status: 'valid' | 'warning' | 'error';
  validation_errors: string[];
}

export default function PreviewPage({ params }: { params: { jobId: string } }) {
  const [products, setProducts] = useState<ExtractedProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<ExtractedProduct | null>(null);

  const handleBulkImport = async () => {
    const selected = products.filter(p => selectedIds.has(p.id));
    await importService.bulkCreate(params.jobId, selected);
    // → redirect to /dashboard/products?filter=draft
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1>Preview: {products.length} sản phẩm</h1>
        <Button onClick={handleBulkImport}>
          Import {selectedIds.size} sản phẩm
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedIds.has(product.id)}
            onSelect={() => toggleSelect(product.id)}
            onEdit={() => setEditingProduct(product)}
          />
        ))}
      </div>

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onSave={(updated) => updateProduct(updated)}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
```

#### 4. ProductCard Component

```typescript
function ProductCard({ product, selected, onSelect, onEdit }: ProductCardProps) {
  const statusColor = {
    valid: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
  }[product.status];

  return (
    <div className={`border-2 ${statusColor} rounded-lg p-4`}>
      <input type="checkbox" checked={selected} onChange={onSelect} />
      <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover" />
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.sku}</p>
      <p className="text-sm">{formatVND(product.price_retail)}</p>
      {product.validation_errors.length > 0 && (
        <ul className="text-xs text-red-600">
          {product.validation_errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}
      <Button size="sm" onClick={onEdit}>Chỉnh sửa</Button>
    </div>
  );
}
```

### Backend Services

#### 1. ImportController (`backend/src/import/import.controller.ts`)

```typescript
@Controller("import")
@UseGuards(JwtAuthGuard)
export class ImportController {
  @Post("upload")
  async uploadCatalogue(@UploadedFile() file: Express.Multer.File) {
    // 1. Validate file (PDF, < 50MB)
    // 2. Save to storage
    // 3. Create ImportJob record
    // 4. Add job to Bull queue
    const job = await this.importService.createJob(file);
    return { job_id: job.id, status: "pending" };
  }

  @Get("jobs/:id")
  async getJob(@Param("id") id: string) {
    return this.importService.getJobStatus(id);
  }

  @Get("jobs/:id/products")
  async getExtractedProducts(@Param("id") id: string) {
    return this.importService.getExtractedProducts(id);
  }

  @Post("jobs/:id/bulk-create")
  async bulkCreate(@Param("id") id: string, @Body() dto: BulkCreateDto) {
    return this.importService.bulkCreateProducts(id, dto.product_ids);
  }
}
```

#### 2. ImportProcessor (`backend/src/import/import.processor.ts`)

```typescript
@Processor("import-queue")
export class ImportProcessor {
  @Process("extract-catalogue")
  async handleExtraction(job: Job<{ import_job_id: string }>) {
    const importJob = await this.prisma.importJob.findUnique({
      where: { id: job.data.import_job_id },
    });

    // 1. Convert PDF to images
    const images = await this.pdfService.convertToImages(importJob.file_path);

    // 2. Process each page
    for (let i = 0; i < images.length; i++) {
      await job.progress((i / images.length) * 100);

      try {
        // 3. Call AI API
        const products = await this.aiService.extractProducts(images[i], i + 1);

        // 4. Save to extracted_products table
        await this.prisma.extractedProduct.createMany({
          data: products.map((p) => ({
            ...p,
            import_job_id: importJob.id,
            page_number: i + 1,
          })),
        });
      } catch (error) {
        // Log error, continue with next page
        await this.prisma.importJob.update({
          where: { id: importJob.id },
          data: { failed_pages: { push: i + 1 } },
        });
      }
    }

    // 5. Mark job as completed
    await this.prisma.importJob.update({
      where: { id: importJob.id },
      data: { status: "completed", completed_at: new Date() },
    });
  }
}
```

#### 3. AIService (`backend/src/import/ai.service.ts`)

```typescript
export class AIService {
  async extractProducts(
    imageBuffer: Buffer,
    pageNumber: number,
  ): Promise<ExtractedProduct[]> {
    const base64Image = imageBuffer.toString("base64");

    const prompt = `
Bạn là chuyên gia phân tích catalogue sản phẩm vật liệu xây dựng.
Hãy trích xuất TOÀN BỘ sản phẩm từ trang catalogue này.

Với mỗi sản phẩm, trích xuất:
- name: Tên sản phẩm (tiếng Việt)
- sku: Mã sản phẩm (nếu có)
- description: Mô tả ngắn
- category: Loại sản phẩm (gạch/thiết bị vệ sinh/vật liệu phụ trợ)
- specs: Thông số kỹ thuật (kích thước, chất liệu, xuất xứ, v.v.)
- price_retail: Giá bán lẻ (số, đơn vị VNĐ)
- price_dealer: Giá đại lý (nếu có)
- unit: Đơn vị tính (m2/viên/bộ/cái)

Trả về JSON array theo format:
{
  "products": [
    {
      "name": "...",
      "sku": "...",
      "description": "...",
      "category": "...",
      "specs": { "kich_thuoc": "...", "chat_lieu": "..." },
      "price_retail": 1500000,
      "price_dealer": 1200000,
      "unit": "M2"
    }
  ]
}
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4096,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.products;
  }
}
```

#### 4. PDFService (`backend/src/import/pdf.service.ts`)

```typescript
export class PDFService {
  async convertToImages(pdfPath: string): Promise<Buffer[]> {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
    const pageCount = pdfDoc.getPageCount();
    const images: Buffer[] = [];

    for (let i = 0; i < pageCount; i++) {
      // Extract page as image using pdf-lib + canvas
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      // Render to canvas, convert to PNG buffer
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      // ... render logic ...

      images.push(canvas.toBuffer("image/png"));
    }

    return images;
  }
}
```

## Data Models

### ImportJob (Prisma schema)

```prisma
model ImportJob {
  id                String   @id @default(uuid())
  user_id           String
  file_name         String
  file_path         String
  file_size         Int
  total_pages       Int
  current_page      Int      @default(0)
  status            ImportJobStatus @default(PENDING)
  progress          Int      @default(0)
  failed_pages      Int[]
  started_at        DateTime?
  completed_at      DateTime?
  created_at        DateTime @default(now())

  extracted_products ExtractedProduct[]
  user              User     @relation(fields: [user_id], references: [id])
}

enum ImportJobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

### ExtractedProduct (Staging table)

```prisma
model ExtractedProduct {
  id                String   @id @default(uuid())
  import_job_id     String
  page_number       Int
  name              String
  sku               String?
  description       String?
  category          String?
  category_id       String?  // mapped category
  technical_specs   Json
  price_retail      Float?
  price_dealer      Float?
  unit              String?
  images            String[] // URLs extracted from PDF
  ai_raw_response   Json     // for debugging
  user_edited       Boolean  @default(false)
  validation_status ValidationStatus @default(VALID)
  validation_errors String[]
  created_at        DateTime @default(now())

  import_job        ImportJob @relation(fields: [import_job_id], references: [id])
}

enum ValidationStatus {
  VALID
  WARNING
  ERROR
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: File validation rejects invalid inputs

_For any_ file upload, if the file is not a PDF or exceeds 50MB, the system SHALL reject it with a clear error message.

**Validates: Requirements 1.2, 1.5**

### Property 2: Job progress monotonicity

_For any_ import job, the progress value SHALL only increase (never decrease) from 0 to 100.

**Validates: Requirements 7.2**

### Property 3: Extracted product completeness

_For any_ extracted product, if `validation_status === 'VALID'`, then `name` and `sku` SHALL be non-empty strings.

**Validates: Requirements 3.2**

### Property 4: SKU uniqueness check

_For any_ bulk create operation, if a product's SKU already exists in the database, that product SHALL be marked as error and not created.

**Validates: Requirements 6.3, 6.7**

### Property 5: Draft product creation

_For any_ product created via bulk import, `is_published` SHALL be `false` initially.

**Validates: Requirements 6.2**

### Property 6: Category mapping consistency

_For any_ product name containing keyword "gạch", the suggested `category_id` SHALL map to a category with slug containing "gach".

**Validates: Requirements 5.1, 5.2**

### Property 7: AI retry exponential backoff

_For any_ AI API call that fails, the retry delays SHALL follow exponential backoff: 1s, 2s, 4s.

**Validates: Requirements 8.1**

### Property 8: Job state transitions

_For any_ import job, valid state transitions are: PENDING → PROCESSING → COMPLETED/FAILED. No other transitions are allowed.

**Validates: Requirements 7.1**

## Error Handling

**AI API Errors:**

- Timeout (>30s): Retry với exponential backoff
- Rate limit (429): Wait và retry
- Invalid response: Log raw response, mark page as failed
- Network error: Retry, sau 3 lần fail → mark job as failed

**Validation Errors:**

- Missing required fields: Mark as WARNING, cho phép user edit
- Duplicate SKU: Mark as ERROR, không cho import
- Invalid price: Mark as WARNING, set price = null

**User Experience:**

- Job đang chạy: Hiển thị progress bar + estimated time
- Job failed: Hiển thị lỗi + nút "Retry"
- Partial success: Hiển thị summary (X succeeded, Y failed)

## Testing Strategy

**Unit Tests (Jest):**

- `validateFile()` - test PDF validation, size limit
- `convertToImages()` - test PDF → image conversion
- `mapCategory()` - test keyword matching
- `validateExtractedProduct()` - test validation rules

**Integration Tests:**

- Upload flow: POST /import/upload → job created
- Job processing: Mock AI response → verify extracted products
- Bulk create: POST /import/jobs/:id/bulk-create → verify products created as draft

**Manual Testing:**

- Upload real catalogue PDF
- Verify AI extraction quality
- Test edit flow
- Test bulk import

**Property-Based Tests (Optional - bỏ trong MVP):**

- Có thể thêm sau khi MVP stable

## MVP Scope

**Included:**

- ✅ Upload PDF (max 50MB)
- ✅ Background job với Bull queue
- ✅ AI extraction (GPT-4 Vision)
- ✅ Preview grid với edit modal
- ✅ Bulk create draft products
- ✅ Basic validation
- ✅ Progress tracking

**Excluded (Phase 2):**

- ❌ Learning from user corrections
- ❌ Advanced category mapping
- ❌ Image extraction từ PDF (chỉ dùng AI để "nhìn" ảnh)
- ❌ Multi-language support
- ❌ Batch processing nhiều files cùng lúc
