# Database Setup Guide

This project supports both SQLite (for development) and PostgreSQL (for production and advanced development).

## Quick Start

### SQLite (Default - No Setup Required)

```bash
# The application works with SQLite out of the box
npm run build
npm run start:dev
```

### PostgreSQL (Advanced Development)

```bash
# Start PostgreSQL with Docker
npm run docker:up

# Switch to PostgreSQL
cp .env.postgresql .env

# Generate client and migrate
npm run db:generate
npm run db:migrate
npm run db:seed

# Start application
npm run start:dev
```

## SQLite Setup (Default)

SQLite is used by default for development without requiring additional setup.

### Commands:

```bash
# Generate Prisma client for SQLite
npm run db:generate:sqlite

# Run migrations for SQLite
npm run db:migrate:sqlite

# Seed database
npm run db:seed

# Open Prisma Studio for SQLite
npm run db:studio:sqlite

# Reset database
npm run db:reset:sqlite
```

## PostgreSQL Setup

### Using Docker (Recommended for Development)

1. Start PostgreSQL with Docker:

```bash
npm run docker:up
```

2. Switch to PostgreSQL environment:

```bash
# Copy PostgreSQL environment variables
cp .env.postgresql .env
```

3. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Open Prisma Studio:

```bash
npm run db:studio
```

### Manual PostgreSQL Setup

1. Install PostgreSQL on your system
2. Create a database:

```sql
CREATE DATABASE digital_showroom_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE digital_showroom_db TO postgres;
```

3. Update `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/digital_showroom_db?schema=public"
```

4. Run migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Environment Variables

### SQLite (.env default)

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (.env.postgresql)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/digital_showroom_db?schema=public"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
POSTGRES_DB="digital_showroom_db"
```

## Schema Files

- `prisma/schema.prisma` - PostgreSQL schema (production)
- `prisma/schema.sqlite.prisma` - SQLite schema (development)

## Switching Between Databases

### To SQLite:

```bash
cp .env.example .env  # or manually set DATABASE_URL="file:./dev.db"
npm run db:generate:sqlite
npm run db:migrate:sqlite
```

### To PostgreSQL:

```bash
cp .env.postgresql .env
npm run docker:up  # if using Docker
npm run db:generate
npm run db:migrate
```

## Testing Configuration

Run the database configuration tests:

```bash
npm test -- database-configuration.spec.ts
```

## Production Deployment

For production, use PostgreSQL with proper connection pooling and security:

```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public&connection_limit=10&pool_timeout=20"
```

Make sure to:

1. Use strong passwords
2. Enable SSL connections
3. Configure connection pooling
4. Set up proper backup strategies
5. Monitor database performance

## Troubleshooting

### Common Issues

1. **Prisma Client Generation Fails**

   ```bash
   # Clear generated client and regenerate
   rm -rf node_modules/@prisma/client
   npm run db:generate
   ```

2. **Migration Issues**

   ```bash
   # Reset database and start fresh
   npm run db:reset
   npm run db:migrate
   ```

3. **Docker PostgreSQL Connection Issues**

   ```bash
   # Check if PostgreSQL is running
   docker ps

   # Restart PostgreSQL
   npm run docker:down
   npm run docker:up
   ```

4. **Environment Variable Issues**
   - Make sure `.env` file exists and has correct DATABASE_URL
   - Check that environment variables match your database setup
