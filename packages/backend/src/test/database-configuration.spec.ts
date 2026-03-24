import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

describe('Database Configuration', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await service.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to database', async () => {
    await expect(service.$connect()).resolves.not.toThrow();
  });

  it('should detect database provider correctly', () => {
    const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
    const isPostgreSQL =
      dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

    if (isPostgreSQL) {
      expect(dbUrl).toMatch(/^postgresql?:\/\//);
    } else {
      expect(dbUrl).toMatch(/^file:/);
    }
  });

  it('should be able to query database', async () => {
    // Simple query to test database connectivity
    await expect(service.$queryRaw`SELECT 1 as test`).resolves.toBeDefined();
  });
});
