# Hướng dẫn Deploy Production

## ⚠️ Lỗi thường gặp và cách sửa

### Lỗi: "the URL must start with the protocol `file:`"

**Nguyên nhân:** Schema Prisma đang dùng SQLite nhưng production cần PostgreSQL

**Giải pháp:**

1. **Đảm bảo schema.prisma dùng PostgreSQL:**

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Cấu hình DATABASE_URL trên production:**
   - Railway/Render/Vercel: Thêm biến môi trường
   - Format: `postgresql://user:password@host:port/database?schema=public`

---

## 🚀 Deploy lên Railway

### Bước 1: Chuẩn bị

1. **Đảm bảo schema.prisma dùng PostgreSQL** (đã sửa ở trên)

2. **Tạo file `railway.toml`** (đã có sẵn):

   ```toml
   [build]
   builder = "nixpacks"
   buildCommand = "npm install && npx prisma generate && npm run build"

   [deploy]
   startCommand = "npx prisma migrate deploy && npm run start:prod"
   ```

### Bước 2: Deploy

1. **Push code lên GitHub** (đã xong)

2. **Tạo project trên Railway:**
   - Truy cập: https://railway.app
   - New Project → Deploy from GitHub
   - Chọn repo: `PHUCUONGTHINH`
   - Chọn thư mục: `packages/backend`

3. **Thêm PostgreSQL:**
   - Click "New" → Database → PostgreSQL
   - Railway tự động tạo và kết nối

4. **Cấu hình biến môi trường:**

   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-production-secret-key-change-this
   JWT_EXPIRES_IN=24h
   NODE_ENV=production
   PORT=3001

   # Email
   OWNER_EMAIL=admin@phucuongthinh.vn
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@phucuongthinh.vn

   # OpenAI (nếu dùng import)
   OPENAI_API_KEY=sk-...

   # Redis (nếu dùng)
   REDIS_HOST=redis-host
   REDIS_PORT=6379
   ```

5. **Deploy:**
   - Railway tự động build và deploy
   - Xem logs để kiểm tra

---

## 🚀 Deploy lên Render

### Bước 1: Tạo Web Service

1. Truy cập: https://render.com
2. New → Web Service
3. Connect GitHub repo: `PHUCUONGTHINH`
4. Cấu hình:
   - **Name:** phucuongthinh-backend
   - **Root Directory:** `packages/backend`
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm run start:prod`

### Bước 2: Thêm PostgreSQL

1. New → PostgreSQL
2. Copy DATABASE_URL

### Bước 3: Cấu hình Environment Variables

Giống như Railway ở trên

---

## 🚀 Deploy Frontend (Vercel)

### Bước 1: Deploy

1. Truy cập: https://vercel.com
2. Import Project → GitHub
3. Chọn repo: `PHUCUONGTHINH`
4. Cấu hình:
   - **Framework:** Next.js
   - **Root Directory:** `packages/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Bước 2: Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
BACKEND_URL=https://your-backend-url.railway.app/api/v1
```

---

## 📋 Checklist Deploy

### Backend

- [ ] Schema Prisma dùng PostgreSQL
- [ ] DATABASE_URL đúng format PostgreSQL
- [ ] JWT_SECRET đổi thành secret mạnh
- [ ] SMTP cấu hình đúng (nếu dùng email)
- [ ] Migrations đã chạy (`prisma migrate deploy`)
- [ ] Seed data (nếu cần): `npm run seed:production`

### Frontend

- [ ] NEXT_PUBLIC_API_URL trỏ đúng backend
- [ ] Build thành công
- [ ] Test các tính năng chính

### Database

- [ ] PostgreSQL đã tạo
- [ ] Migrations đã chạy
- [ ] Có backup plan

### Email

- [ ] SMTP đã cấu hình
- [ ] Test gửi email thành công
- [ ] Email không vào spam

---

## 🔧 Troubleshooting

### Lỗi: Prisma Client not generated

```bash
npx prisma generate
```

### Lỗi: Migration failed

```bash
# Xem migrations hiện tại
npx prisma migrate status

# Reset database (CẢNH BÁO: Xóa hết data)
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```

### Lỗi: Cannot connect to database

- Kiểm tra DATABASE_URL format
- Kiểm tra database có chạy không
- Kiểm tra firewall/network

### Lỗi: Email không gửi

- Xem logs backend
- Kiểm tra SMTP credentials
- Kiểm tra OWNER_EMAIL đã cấu hình

---

## 📊 Monitoring

### Logs

- Railway: Dashboard → Logs
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → Logs

### Database

- Railway: Dashboard → PostgreSQL → Metrics
- Render: Dashboard → PostgreSQL → Metrics

### Performance

- Vercel Analytics
- Railway Metrics
- Custom monitoring (optional)

---

## 🔄 Update Production

### Cách 1: Auto Deploy (Khuyến nghị)

1. Push code lên GitHub
2. Railway/Render/Vercel tự động deploy

### Cách 2: Manual Deploy

1. Railway: Dashboard → Deploy → Manual Deploy
2. Render: Dashboard → Manual Deploy
3. Vercel: Dashboard → Redeploy

---

## 📝 Notes

- **SQLite chỉ dùng cho development**
- **Production phải dùng PostgreSQL**
- **Backup database thường xuyên**
- **Monitor logs và errors**
- **Test kỹ trước khi deploy**
