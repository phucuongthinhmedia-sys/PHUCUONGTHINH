# Setup Cloudinary - Giải Pháp Triệt Để Cho Media Cache

## Tại Sao Cloudinary?

- ✅ Upload → Thấy ngay lập tức (< 1 giây)
- ✅ Không cần lo cache (Cloudinary handle)
- ✅ Free 25GB storage + 25GB bandwidth/tháng
- ✅ Tự động optimize images (WebP, AVIF, resize)
- ✅ CDN toàn cầu

## Bước 1: Tạo Tài Khoản Cloudinary (5 phút)

1. Truy cập: https://cloudinary.com/users/register_free
2. Đăng ký free account
3. Sau khi đăng nhập, vào Dashboard
4. Copy 3 thông tin:
   - **Cloud Name**: (ví dụ: `dxyz123abc`)
   - **API Key**: (ví dụ: `123456789012345`)
   - **API Secret**: (ví dụ: `abcdefghijklmnopqrstuvwxyz123`)

## Bước 2: Cấu Hình Backend

Thêm vào file `.env` của backend:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Ví dụ:**

```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

## Bước 3: Deploy & Test

### Local Development

```bash
# Backend sẽ tự động detect Cloudinary config
cd packages/backend
pnpm run start:dev
```

Kiểm tra log:

```
✅ Cloudinary configured successfully
```

### Production (Railway/Vercel)

1. Vào Settings → Environment Variables
2. Thêm 3 biến:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Redeploy

## Bước 4: Test Upload

1. Vào `/admin/products/new`
2. Upload 1 ảnh
3. Click Save
4. **Kết quả:** Ảnh được upload lên Cloudinary
5. URL sẽ có dạng: `https://res.cloudinary.com/dxyz123abc/image/upload/...`

## Bước 5: Verify

### Check Cloudinary Dashboard

1. Vào https://cloudinary.com/console/media_library
2. Thấy folder `products/` với ảnh vừa upload
3. Click vào ảnh → Copy URL

### Check Public Page

1. Vào `/products`
2. **Kết quả:** Thấy ảnh ngay lập tức!
3. F5 nhiều lần → Vẫn thấy ngay

## Cách Hoạt Động

### Before (Local Storage + Cloudflare Cache)

```
Admin upload → Local /uploads/ → Cloudflare cache (5-60 phút) → Public thấy chậm
```

### After (Cloudinary)

```
Admin upload → Cloudinary CDN → Public thấy ngay (< 1 giây)
```

## Bonus: Image Optimization

Cloudinary tự động optimize images:

- Convert sang WebP/AVIF (nhẹ hơn 30-50%)
- Resize theo device
- Lazy loading
- Quality optimization

Không cần code gì thêm!

## Troubleshooting

### Lỗi: "Cloudinary is not configured"

→ Check `.env` có đúng 3 biến không

### Lỗi: "Invalid API credentials"

→ Copy lại API Key/Secret từ Cloudinary Dashboard

### Upload thành công nhưng không thấy ảnh

→ Check URL trong database, phải có dạng `https://res.cloudinary.com/...`

### Vẫn thấy ảnh cũ

→ Clear browser cache (Ctrl+Shift+R)

## Migration từ Local Storage

Nếu đã có ảnh trong `/uploads/`, cần migrate:

```bash
# Script sẽ được tạo sau nếu cần
node packages/backend/scripts/migrate-to-cloudinary.js
```

## Chi Phí

### Free Tier (đủ cho startup)

- 25GB storage
- 25GB bandwidth/tháng
- 25,000 transformations/tháng

### Khi nào cần upgrade?

- Khi vượt quá 25GB bandwidth/tháng
- Thường là khi có > 10,000 visitors/tháng

### Giá Plus ($99/tháng)

- 100GB storage
- 100GB bandwidth
- 100,000 transformations

## Kết Luận

Sau khi setup Cloudinary:

- ✅ Admin upload → Public thấy ngay
- ✅ Không còn cache delay
- ✅ Images tự động optimize
- ✅ CDN nhanh toàn cầu
- ✅ Free cho startup

**Vấn đề media cache đã được giải quyết TRIỆT ĐỂ!**
