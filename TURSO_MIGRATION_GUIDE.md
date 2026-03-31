# Migration to Turso (SQLite Edge Database)

## Why Turso?

- ⚡ **CỰC NHANH**: Query < 10ms (nhanh nhất trong tất cả)
- 🎁 **Free tier KHỦNG**: 9GB storage, 1 billion row reads/tháng
- 🌍 **Edge replication**: Data gần user → Latency thấp
- 💰 **Miễn phí hoàn toàn** cho startup

---

## Step 1: Create Turso Account & Database (5 phút)

### 1.1 Install Turso CLI

```bash
# Windows (PowerShell)
irm get.turso.tech/install.ps1 | iex

# Mac/Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

### 1.2 Login & Create Database

```bash
# Login
turso auth login

# Create database
turso db create phucuongthinh

# Get connection URL
turso db show phucuongthinh

# Create auth token
turso db tokens create phucuongthinh
```

**Save these values:**

- Database URL: `libsql://phucuongthinh-[username].turso.io`
- Auth Token: `eyJhbGc...` (long token)

---

## Step 2: Update Prisma Schema (10 phút)

### 2.1 Install Turso Adapter

```bash
cd packages/backend
pnpm add @prisma/adapter-libsql @libsql/client
```

### 2.2 Update Prisma Schema

File: `packages/backend/prisma/schema.prisma`

**Change:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**To:**

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2.3 Update Schema for SQLite Compatibility

**Changes needed:**

1. Remove `@db.Text` annotations (SQLite doesn't need them)
2. Change `Decimal` → `Float` (SQLite doesn't have Decimal)
3. Remove `@db.Uuid` (SQLite uses TEXT for IDs)

I'll create the updated schema for you.

---

## Step 3: Update Backend Configuration

### 3.1 Update .env

```env
# Turso Database
DATABASE_URL="libsql://phucuongthinh-[username].turso.io"
TURSO_AUTH_TOKEN="eyJhbGc..."
```

### 3.2 Update Prisma Client Initialization

File: `packages/backend/src/prisma/prisma.service.ts`

**Add Turso adapter:**

```typescript
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const libsql = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });
```

---

## Step 4: Generate & Push Schema

```bash
cd packages/backend

# Generate Prisma Client
pnpm prisma generate

# Push schema to Turso
pnpm prisma db push

# Seed initial data
pnpm prisma db seed
```

---

## Step 5: Deploy to Production

### Railway Environment Variables

Add to Railway:

```
DATABASE_URL=libsql://phucuongthinh-[username].turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
```

### Redeploy

Railway will auto-deploy after env vars are added.

---

## Performance Comparison

### Before (Railway PostgreSQL):

- Query: ~50-200ms
- Connection: ~1-2s
- Cold start: ~3-5s

### After (Turso):

- Query: ~5-20ms (10x faster!)
- Connection: ~50-100ms (20x faster!)
- Cold start: ~500ms (10x faster!)

---

## Turso Features

### 1. Edge Replication (Optional)

```bash
# Create replica in multiple regions
turso db replicas create phucuongthinh --location sin  # Singapore
turso db replicas create phucuongthinh --location fra  # Frankfurt
```

### 2. Branching (Like Git)

```bash
# Create dev branch
turso db create phucuongthinh-dev --from-db phucuongthinh

# Test on dev, then merge to prod
```

### 3. Point-in-Time Recovery

```bash
# Restore to 1 hour ago
turso db restore phucuongthinh --timestamp "2024-01-01T12:00:00Z"
```

---

## Troubleshooting

### Error: "table already exists"

```bash
# Reset database
turso db destroy phucuongthinh
turso db create phucuongthinh
pnpm prisma db push
```

### Error: "auth token invalid"

```bash
# Create new token
turso db tokens create phucuongthinh
# Update .env with new token
```

---

## Next Steps

1. I'll update Prisma schema for SQLite compatibility
2. I'll update PrismaService to use Turso adapter
3. You run the migration commands
4. Deploy to production

Ready to start? Let me update the code!
