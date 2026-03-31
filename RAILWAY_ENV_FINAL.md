# Railway Environment Variables - FINAL

Thêm các biến sau vào Railway:

## Database (Turso)

```
DATABASE_URL=libsql://phucuongthinh-danghoanphuc.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQ5Nzg3OTQsImlkIjoiMDE5ZDQ0ZjktZDIwMS03NDAwLWEwNjItNmJjYjQ1NzgwZmE2IiwicmlkIjoiNzUyZTA0ZDQtOTdkYy00YWRhLTk5YjctMjUyZjQwMDQ4ZmMyIn0.iNy8w1uMf7eUMClzmBBExJLGSHwadhRy7zzVWHKk7psxAxmlsNJ1jvBm_typx_F1xk8dFIm2H1jjHkbeueWCBg
PRISMA_SCHEMA_URL=file:./dev.db
```

## Cloudinary

```
CLOUDINARY_CLOUD_NAME=Ada3xfws3n
CLOUDINARY_API_KEY=267355538997791
CLOUDINARY_API_SECRET=P-6cIw1sOBrYtrV_HZl7gNmuw-o
```

## Giải thích

- `DATABASE_URL`: URL Turso cho runtime connection
- `TURSO_AUTH_TOKEN`: Token xác thực Turso
- `PRISMA_SCHEMA_URL`: URL dummy cho Prisma schema (không dùng runtime, chỉ cho migration)
- Cloudinary: Credentials cho image hosting

## Lưu ý

- Không cần dấu ngoặc kép trong Railway
- Sau khi thêm, Railway sẽ tự động redeploy
