# Giải Pháp Sử Dụng Dịch Vụ Bên Ngoài Cho Media

## Vấn Đề Hiện Tại

- Self-hosted storage (local uploads/) → Không có CDN
- Cloudflare cache gây delay khi update
- Phải dùng timestamp hack để bypass cache

---

## Giải Pháp 1: Cloudflare R2 + Cache Purge API ⭐ RECOMMENDED

### Ưu điểm

- ✅ Tương thích S3 API (dễ migrate)
- ✅ Không tính phí egress bandwidth (miễn phí traffic)
- ✅ Tích hợp sẵn với Cloudflare CDN
- ✅ Cache Purge API để xóa cache ngay lập tức
- ✅ Giá rẻ: $0.015/GB storage, 10GB free/tháng

### Cách hoạt động

1. Upload ảnh → Cloudflare R2
2. R2 tự động distribute qua Cloudflare CDN
3. Khi admin update → Gọi Purge API
4. Public page thấy ngay (< 1 giây)

### Setup

```typescript
// Backend: Purge cache sau khi upload/delete
import axios from 'axios';

async function purgeCloudflareCache(imageUrls: string[]) {
  await axios.post(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
    { files: imageUrls },
    {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

// Sau khi upload media
await createMediaRecord(...);
await purgeCloudflareCache([publicUrl]);
```

### Chi phí ước tính

- Storage: 100GB × $0.015 = $1.5/tháng
- Operations: 1M requests × $0.36/M = $0.36/tháng
- Egress: **$0** (miễn phí!)
- **Tổng: ~$2/tháng**

---

## Giải Pháp 2: AWS S3 + CloudFront ⭐⭐

### Ưu điểm

- ✅ Mature, reliable, battle-tested
- ✅ CloudFront CDN toàn cầu
- ✅ Invalidation API để clear cache
- ✅ Tích hợp tốt với AWS ecosystem

### Nhược điểm

- ❌ Tính phí egress bandwidth (đắt!)
- ❌ Phức tạp hơn để setup
- ❌ Invalidation có giới hạn (1000 paths/tháng free)

### Setup

```typescript
// Backend: Invalidate CloudFront cache
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({ region: "us-east-1" });

async function invalidateCloudFront(paths: string[]) {
  await client.send(
    new CreateInvalidationCommand({
      DistributionId: DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    }),
  );
}
```

### Chi phí ước tính

- S3 Storage: 100GB × $0.023 = $2.3/tháng
- S3 Requests: 1M × $0.005/1000 = $5/tháng
- CloudFront Transfer: 100GB × $0.085 = $8.5/tháng
- **Tổng: ~$16/tháng**

---

## Giải Pháp 3: Cloudinary ⭐⭐⭐ EASIEST

### Ưu điểm

- ✅ Cực kỳ dễ setup (5 phút)
- ✅ Tự động optimize images (resize, format, quality)
- ✅ Không cần lo cache (họ handle)
- ✅ Transformation API (crop, resize on-the-fly)
- ✅ Free tier: 25GB storage, 25GB bandwidth/tháng

### Nhược điểm

- ❌ Đắt khi scale (sau free tier)
- ❌ Vendor lock-in

### Setup

```bash
npm install cloudinary
```

```typescript
// Backend: Upload to Cloudinary
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: Buffer, filename: string) {
  const result = await cloudinary.uploader.upload_stream(
    { public_id: filename, folder: "products" },
    (error, result) => result,
  );

  return result.secure_url; // https://res.cloudinary.com/...
}

// Xóa ảnh
await cloudinary.uploader.destroy(publicId);
```

### Chi phí

- Free: 25GB storage, 25GB bandwidth
- Plus: $99/tháng (100GB storage, 100GB bandwidth)
- **Tốt cho startup, đắt khi scale**

---

## Giải Pháp 4: Vercel Blob Storage ⭐⭐

### Ưu điểm

- ✅ Tích hợp tốt với Next.js/Vercel
- ✅ Tự động CDN
- ✅ Dễ setup
- ✅ Free tier: 1GB storage

### Nhược điểm

- ❌ Chỉ 1GB free (ít quá)
- ❌ Đắt: $0.15/GB storage, $0.30/GB bandwidth
- ❌ Vendor lock-in Vercel

### Chi phí ước tính

- Storage: 100GB × $0.15 = $15/tháng
- Bandwidth: 100GB × $0.30 = $30/tháng
- **Tổng: ~$45/tháng (ĐẮT!)**

---

## Giải Pháp 5: DigitalOcean Spaces ⭐⭐

### Ưu điểm

- ✅ Tương thích S3 API
- ✅ Tích hợp CDN miễn phí
- ✅ Giá cố định: $5/tháng (250GB storage + 1TB bandwidth)
- ✅ Dễ setup

### Nhược điểm

- ❌ Không có cache purge API
- ❌ CDN không mạnh bằng Cloudflare

### Chi phí

- **$5/tháng flat** (rất tốt cho small-medium projects)

---

## So Sánh Tổng Quan

| Dịch vụ                   | Chi phí/tháng | Dễ setup   | Cache Control   | Recommend  |
| ------------------------- | ------------- | ---------- | --------------- | ---------- |
| **Cloudflare R2**         | ~$2           | ⭐⭐⭐     | ✅ Purge API    | ⭐⭐⭐⭐⭐ |
| **AWS S3 + CloudFront**   | ~$16          | ⭐⭐       | ✅ Invalidation | ⭐⭐⭐⭐   |
| **Cloudinary**            | $0-99         | ⭐⭐⭐⭐⭐ | ✅ Auto         | ⭐⭐⭐⭐   |
| **Vercel Blob**           | ~$45          | ⭐⭐⭐⭐   | ✅ Auto         | ⭐⭐       |
| **DO Spaces**             | $5            | ⭐⭐⭐⭐   | ❌              | ⭐⭐⭐     |
| **Current (self-hosted)** | ~$0           | N/A        | ❌ Hack         | ⭐         |

---

## Recommendation: Cloudflare R2 + Purge API

### Tại sao?

1. **Rẻ nhất**: ~$2/tháng, egress miễn phí
2. **Nhanh nhất**: Cloudflare CDN toàn cầu
3. **Cache control tốt**: Purge API instant
4. **Dễ migrate**: S3-compatible API
5. **Scale tốt**: Không lo bandwidth cost

### Migration Plan

#### Phase 1: Setup R2 (30 phút)

1. Tạo Cloudflare R2 bucket
2. Get API credentials
3. Update backend config

#### Phase 2: Update Code (1 giờ)

1. Thay S3 endpoint → R2 endpoint
2. Thêm Purge API call sau upload/delete
3. Test upload/delete

#### Phase 3: Migrate Existing Images (2 giờ)

1. Script để copy từ local → R2
2. Update database URLs
3. Verify

#### Phase 4: Cleanup (30 phút)

1. Xóa local uploads/
2. Remove timestamp hack
3. Monitor

### Code Example

```typescript
// packages/backend/src/media/media.service.ts

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import axios from "axios";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(file: Buffer, key: string) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: "image/jpeg",
    }),
  );

  const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;

  // Purge Cloudflare cache
  await purgeCache([publicUrl]);

  return publicUrl;
}

async function deleteFromR2(key: string) {
  const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
  );

  // Purge cache
  await purgeCache([publicUrl]);
}

async function purgeCache(urls: string[]) {
  try {
    await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
      { files: urls },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("✅ Cache purged:", urls);
  } catch (err) {
    console.error("❌ Failed to purge cache:", err);
  }
}
```

### Environment Variables

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_DOMAIN=your-domain.r2.dev

# Cloudflare API (for cache purge)
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_API_TOKEN=your_api_token
```

---

## Kết Luận

### Nếu budget ưu tiên:

→ **Cloudflare R2** (~$2/tháng)

### Nếu muốn dễ nhất:

→ **Cloudinary** (free tier hoặc $99/tháng)

### Nếu đã dùng AWS:

→ **S3 + CloudFront** (~$16/tháng)

### Nếu muốn giá cố định:

→ **DigitalOcean Spaces** ($5/tháng)

---

## Next Steps

Bạn muốn tôi implement giải pháp nào?

1. **Cloudflare R2** (recommended, rẻ + nhanh)
2. **Cloudinary** (easiest, free tier)
3. **Keep current + improve** (free nhưng hack)

Cho tôi biết và tôi sẽ implement ngay!
