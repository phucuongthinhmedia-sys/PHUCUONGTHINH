# Catalogue Bulk Import Feature

Tính năng import hàng loạt sản phẩm từ file PDF catalogue sử dụng AI (GPT-4 Vision).

## Tổng quan

Workflow:

1. Upload PDF catalogue
2. Background job xử lý từng trang PDF
3. AI trích xuất thông tin sản phẩm
4. Preview và chỉnh sửa
5. Bulk create products (draft mode)

## Setup

### 1. Cài đặt Redis

Redis cần thiết cho Bull queue (background jobs).

**Option A: Docker (Khuyên dùng)**

```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

**Option B: Local installation**

- Windows: https://github.com/microsoftarchive/redis/releases
- Mac: `brew install redis && brew services start redis`
- Linux: `sudo apt-get install redis-server`

Kiểm tra Redis đang chạy:

```bash
redis-cli ping
# Should return: PONG
```

### 2. Cấu hình OpenAI API

1. Tạo API key tại: https://platform.openai.com/api-keys
2. Thêm vào `backend/.env`:

```env
OPENAI_API_KEY="sk-..."
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

### 3. Chạy Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend sẽ chạy tại: http://localhost:3001

### 4. Chạy CMS

```bash
cd cms
npm install
npm run dev
```

CMS sẽ chạy tại: http://localhost:3002

## Sử dụng

1. Đăng nhập vào CMS
2. Vào menu "Import" hoặc truy cập: http://localhost:3002/dashboard/import
3. Upload file PDF catalogue (tối đa 50MB)
4. Đợi hệ thống xử lý (progress bar sẽ hiển thị)
5. Review sản phẩm đã trích xuất
6. Chỉnh sửa nếu cần
7. Chọn sản phẩm và click "Import"
8. Sản phẩm được tạo ở trạng thái Draft

## API Endpoints

### POST /api/v1/import/upload

Upload catalogue PDF

**Request:**

- Content-Type: multipart/form-data
- Body: file (PDF)

**Response:**

```json
{
  "job_id": "uuid",
  "status": "pending",
  "total_pages": 10
}
```

### GET /api/v1/import/jobs/:id

Get job status

**Response:**

```json
{
  "id": "uuid",
  "file_name": "catalogue.pdf",
  "status": "processing",
  "progress": 50,
  "current_page": 5,
  "total_pages": 10,
  "failed_pages": [],
  "started_at": "2024-01-01T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/v1/import/jobs/:id/products

Get extracted products

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Gạch Ốp Lát 600x1200",
    "sku": "GCH-001",
    "description": "...",
    "category": "gạch",
    "category_id": "uuid",
    "technical_specs": {...},
    "price_retail": 1500000,
    "price_dealer": 1200000,
    "unit": "M2",
    "validation_status": "valid",
    "validation_errors": []
  }
]
```

### POST /api/v1/import/jobs/:id/bulk-create

Bulk create products

**Request:**

```json
{
  "product_ids": ["uuid1", "uuid2", ...]
}
```

**Response:**

```json
{
  "success": ["product_id1", "product_id2"],
  "failed": [
    {
      "id": "product_id3",
      "error": "SKU already exists"
    }
  ]
}
```

## Troubleshooting

### Redis connection failed

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:** Đảm bảo Redis đang chạy. Chạy `redis-cli ping` để kiểm tra.

### OpenAI API error

```
Error: Invalid API key
```

**Solution:** Kiểm tra OPENAI_API_KEY trong .env file.

### PDF conversion failed

```
Error: PDF conversion failed
```

**Solution:**

- Đảm bảo file là PDF hợp lệ
- Kiểm tra file size < 50MB
- PDF không bị mã hóa/password protected

### AI extraction returns empty

```
Extracted 0 products from page X
```

**Solution:**

- PDF quality có thể kém (scan mờ)
- Trang không chứa sản phẩm
- Thử với PDF chất lượng tốt hơn

## Chi phí

**OpenAI API:**

- Model: GPT-4 Vision Preview
- Chi phí: ~$0.01-0.05 per page
- Ví dụ: Catalogue 20 trang ≈ $0.20-1.00

**Khuyến nghị:**

- Set spending limit trong OpenAI dashboard
- Monitor usage thường xuyên
- Test với catalogue nhỏ trước

## Giới hạn

**MVP version:**

- Chỉ hỗ trợ PDF (không hỗ trợ Word, Excel)
- PDF rendering đơn giản (có thể cần cải thiện cho production)
- Không tự động extract images từ PDF
- Category mapping dựa trên keywords đơn giản

**Production improvements:**

- Sử dụng Puppeteer hoặc ImageMagick cho PDF rendering tốt hơn
- Implement learning từ user corrections
- Advanced category mapping với ML
- Image extraction và upload tự động
- Batch processing nhiều files

## Architecture

```
Upload PDF
    ↓
Storage Service (save to disk)
    ↓
Create ImportJob (database)
    ↓
Add to Bull Queue
    ↓
Import Processor (background)
    ├─ PDF Service (convert to images)
    ├─ AI Service (extract products)
    └─ Save to ExtractedProduct table
    ↓
User reviews in CMS
    ↓
Bulk create Products (draft)
```

## Database Schema

**import_jobs:**

- id, user_id, file_name, file_path
- status, progress, current_page, total_pages
- failed_pages, started_at, completed_at

**extracted_products:**

- id, import_job_id, page_number
- name, sku, description, category, category_id
- technical_specs (JSON)
- price_retail, price_dealer, unit
- validation_status, validation_errors
- user_edited

## Support

Nếu gặp vấn đề, check:

1. Backend logs: `npm run start:dev` output
2. Redis logs: `redis-cli monitor`
3. Browser console (CMS)
4. OpenAI API dashboard (usage & errors)
