import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

    // Check if using PostgreSQL or SQLite
    const isPostgreSQL =
      dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

    if (isPostgreSQL) {
      // Use PostgreSQL directly without adapter
      super({
        log:
          process.env.NODE_ENV === 'test'
            ? ['error']
            : ['query', 'info', 'warn', 'error'],
      });
    } else {
      // Use SQLite with adapter
      const adapter = new PrismaBetterSQLite3({ url: dbUrl });
      super({
        adapter,
        log:
          process.env.NODE_ENV === 'test'
            ? ['error']
            : ['query', 'info', 'warn', 'error'],
      } as any);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
