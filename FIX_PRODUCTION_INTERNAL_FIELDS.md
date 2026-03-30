# Sửa lỗi ProductInternal trên Production

## Vấn đề

Khi chỉnh sửa sản phẩm và thêm ảnh trên production, gặp lỗi:

```
PrismaClientKnownRequestError: Invalid prisma.productInternal.findUnique() invocation
```

## Nguyên nhân

Bảng `product_internals` trên production thiếu các trường mới:

- price_retail
- price_wholesale
- wholesale_discount_tiers
- price_dealer
- price_promo
- promo_start_date
- promo_end_date
- promo_note
- warehouse_location
- stock_status
- stock_quantity
- supplier_phone

## Giải pháp

### Bước 1: Backup database (quan trọng!)

```bash
# Trên Railway hoặc server production
pg_dump $DATABASE_URL > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

### Bước 2: Chạy migration

#### Option A: Sử dụng script tự động (Khuyến nghị)

```bash
# SSH vào server production hoặc chạy trên Railway
cd packages/backend
node scripts/migrate-production-internal-fields.js
```

#### Option B: Chạy SQL thủ công

```bash
# Kết nối vào PostgreSQL
psql $DATABASE_URL

# Copy và paste nội dung từ file:
# packages/backend/prisma/migrations/20260331000000_add_product_internal_fields/migration.sql
```

### Bước 3: Kiểm tra

```bash
# Kiểm tra các cột đã được thêm
psql $DATABASE_URL -c "\d product_internals"
```

### Bước 4: Restart ứng dụng

```bash
# Trên Railway: Deploy lại hoặc restart
# Trên server: restart PM2/Docker
pm2 restart backend
# hoặc
docker-compose restart backend
```

## Kiểm tra sau khi fix

1. Đăng nhập vào admin
2. Vào "Chỉnh sửa" một sản phẩm
3. Thử thêm ảnh hoặc chỉnh sửa thông tin nội bộ
4. Kiểm tra không còn lỗi

## Rollback (nếu cần)

```bash
# Restore từ backup
psql $DATABASE_URL < backup_before_migration_YYYYMMDD_HHMMSS.sql
```

## Lưu ý

- Migration này an toàn, chỉ thêm cột mới, không xóa dữ liệu
- Sử dụng `IF NOT EXISTS` để tránh lỗi nếu cột đã tồn tại
- Có thể chạy nhiều lần mà không gây lỗi
- Error handling đã được thêm vào service để tránh crash nếu bảng chưa có

## Code đã sửa

File `packages/backend/src/internal-products/internal-products.service.ts` đã được thêm try-catch để xử lý lỗi gracefully:

```typescript
try {
  const internal = await this.prisma.productInternal.findUnique({...});
  return internal;
} catch (error) {
  console.error('Error fetching internal product data:', error);
  return null; // Trả về null thay vì throw error
}
```

Điều này đảm bảo ứng dụng vẫn hoạt động ngay cả khi migration chưa chạy.
