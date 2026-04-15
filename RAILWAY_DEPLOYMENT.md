# Hướng dẫn Deploy lên Railway

## 1. Chuẩn bị

### Tạo tài khoản Railway

- Vào https://railway.app
- Đăng nhập bằng GitHub account: phucuongthinhmedia-sys

## 2. Deploy Backend

### Bước 1: Tạo Backend Service

1. Vào Railway Dashboard → Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository: `phucuongthinhmedia-sys/PHUCUONGTHINH`
4. Railway sẽ tự động detect và deploy

### Bước 2: Cấu hình Backend

1. Click vào service vừa tạo
2. Vào tab "Settings"
3. Trong "Root Directory", nhập: `packages/backend`
4. Trong "Build Command", nhập: `npm install && npx prisma generate && npm run build`
5. Trong "Start Command", nhập: `npm run start:prod`

### Bước 3: Thêm Database (PostgreSQL)

1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway sẽ tự động tạo database và set biến `DATABASE_URL`

### Bước 4: Thêm Environment Variables

Vào tab "Variables" của Backend service và thêm:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Database (tự động có từ PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Email (nếu dùng)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Cloudinary (nếu dùng)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AWS S3 (nếu dùng)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Redis (nếu cần)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

### Bước 5: Deploy

- Railway sẽ tự động deploy khi có thay đổi
- Hoặc click "Deploy" để deploy thủ công

## 3. Deploy Frontend

### Bước 1: Tạo Frontend Service

1. Trong cùng project, click "New" → "GitHub Repo"
2. Chọn lại repository: `phucuongthinhmedia-sys/PHUCUONGTHINH`

### Bước 2: Cấu hình Frontend

1. Click vào service vừa tạo
2. Vào tab "Settings"
3. Trong "Root Directory", nhập: `packages/frontend`
4. Trong "Build Command", nhập: `npm install && npm run build`
5. Trong "Start Command", nhập: `npm run start`

### Bước 3: Thêm Environment Variables

Vào tab "Variables" của Frontend service và thêm:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}

# Hoặc nếu backend có custom domain:
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

### Bước 4: Deploy

- Railway sẽ tự động deploy

## 4. Cấu hình Domain (Optional)

### Backend Domain

1. Vào Backend service → Settings → Networking
2. Click "Generate Domain" để có domain miễn phí
3. Hoặc "Custom Domain" để dùng domain riêng

### Frontend Domain

1. Vào Frontend service → Settings → Networking
2. Click "Generate Domain" để có domain miễn phí
3. Hoặc "Custom Domain" để dùng domain riêng

## 5. Kiểm tra Deployment

### Backend

- Truy cập: `https://your-backend.railway.app/api`
- Kiểm tra health: `https://your-backend.railway.app/health`

### Frontend

- Truy cập: `https://your-frontend.railway.app`

## 6. Troubleshooting

### Lỗi Build

- Check logs trong tab "Deployments"
- Đảm bảo tất cả dependencies đã được cài đặt

### Lỗi Database

- Kiểm tra `DATABASE_URL` đã được set chưa
- Chạy migrations: Thêm vào Build Command: `npx prisma migrate deploy`

### Lỗi Environment Variables

- Đảm bảo tất cả biến môi trường cần thiết đã được thêm
- Restart service sau khi thêm biến mới

## 7. Auto Deploy

Railway tự động deploy khi:

- Push code mới lên GitHub branch `main`
- Thay đổi environment variables
- Click "Deploy" thủ công

## 8. Monitoring

- Vào tab "Metrics" để xem CPU, Memory usage
- Vào tab "Deployments" để xem logs
- Set up alerts trong Settings

## 9. Chi phí

- Railway có free tier: $5 credit/tháng
- Sau đó tính theo usage:
  - $0.000463/GB-hour (Memory)
  - $0.000231/vCPU-hour (CPU)
- PostgreSQL: Miễn phí 512MB, sau đó $0.02/GB/tháng

## 10. Tips

1. Sử dụng Railway CLI để deploy nhanh hơn:

```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

2. Set up GitHub Actions để tự động test trước khi deploy

3. Sử dụng Railway Templates để deploy nhanh hơn

4. Enable "Auto Deploy" trong Settings để tự động deploy khi push code
