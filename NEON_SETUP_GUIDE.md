# Hướng dẫn setup Neon PostgreSQL

## Bước 1: Tạo tài khoản và database

1. Truy cập: https://neon.tech
2. Đăng ký/Đăng nhập (có thể dùng GitHub)
3. Click "Create a project"
4. Chọn:
   - Project name: `phucuongthinh` (hoặc tên bạn muốn)
   - Region: **Singapore** (gần Việt Nam nhất, nhanh nhất)
   - PostgreSQL version: 16 (mặc định)
5. Click "Create project"

## Bước 2: Lấy connection string

Sau khi tạo xong, bạn sẽ thấy connection string dạng:

```
postgresql://username:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

Copy connection string này.

## Bước 3: Cập nhật Railway

Vào Railway → Backend service → Variables:

1. **Thay đổi DATABASE_URL:**

   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

   (paste connection string từ Neon)

2. **Xóa các biến Turso:**
   - Xóa `TURSO_AUTH_TOKEN`
   - Xóa `PRISMA_SCHEMA_URL` (nếu có)

3. **Giữ nguyên Cloudinary:**
   - `CLOUDINARY_CLOUD_NAME=Ada3xfws3n`
   - `CLOUDINARY_API_KEY=267355538997791`
   - `CLOUDINARY_API_SECRET=P-6cIw1sOBrYtrV_HZl7gNmuw-o`

## Bước 4: Railway sẽ tự động deploy

Sau khi lưu biến môi trường:

- Railway sẽ redeploy
- Prisma sẽ tạo bảng trong Neon
- App sẽ chạy với Neon + Cloudinary

## Bước 5: Seed dữ liệu (nếu cần)

Nếu cần tạo dữ liệu mẫu, vào Railway console và chạy:

```bash
npm run db:seed:prod
```

## Kết quả

- ✅ Database nhanh hơn (20-50ms thay vì 50-200ms)
- ✅ Cloudinary giải quyết cache issue
- ✅ Không còn bug adapter
- ✅ Free 0.5GB storage

## Lưu ý

- Neon tự động sleep sau 5 phút không dùng (free tier)
- Request đầu tiên sau khi sleep sẽ mất ~1-2 giây để wake up
- Các request sau đó sẽ nhanh bình thường
