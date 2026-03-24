import { Test, TestingModule } from '@nestjs/testing';
import { QueryPerformanceService } from '../common/services/query-performance.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QueryPerformanceService', () => {
  let service: QueryPerformanceService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryPerformanceService,
        {
          provide: PrismaService,
          useValue: {
            $queryRawUnsafe: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueryPerformanceService>(QueryPerformanceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extract indexes from query plan', () => {
    const mockPlan = {
      Plan: {
        'Node Type': 'Index Scan',
        'Index Name': 'products_technical_data_gin_idx',
        Plans: [
          {
            'Node Type': 'Bitmap Index Scan',
            'Index Name': 'products_marketing_content_gin_idx',
          },
        ],
      },
    };

    // Access private method for testing
    const extractMethod = (service as any).extractIndexesFromPlan;
    const indexes = extractMethod(mockPlan);

    expect(indexes).toContain('products_technical_data_gin_idx');
    expect(indexes).toContain('products_marketing_content_gin_idx');
  });

  it('should sanitize query strings', () => {
    const query =
      'SELECT * FROM products WHERE technical_data @> $1 AND marketing_content @> $2';

    // Access private method for testing
    const sanitizeMethod = (service as any).sanitizeQuery;
    const sanitized = sanitizeMethod(query);

    expect(sanitized).toContain('?');
    expect(sanitized).not.toContain('$1');
    expect(sanitized).not.toContain('$2');
  });

  it('should calculate query pattern statistics', () => {
    // Add some mock metrics
    const mockMetrics = [
      {
        query: 'SELECT * FROM products WHERE technical_data @> ?',
        executionTimeMs: 50,
        rowsReturned: 10,
        indexesUsed: ['products_technical_data_gin_idx'],
        timestamp: new Date(),
      },
      {
        query: 'SELECT * FROM products WHERE technical_data @> ?',
        executionTimeMs: 75,
        rowsReturned: 15,
        indexesUsed: ['products_technical_data_gin_idx'],
        timestamp: new Date(),
      },
    ];

    // Access private property for testing
    (service as any).performanceMetrics = mockMetrics;

    const stats = service.getQueryPatternStats('technical_data');

    expect(stats.count).toBe(2);
    expect(stats.avgExecutionTime).toBe(62.5);
    expect(stats.indexUsageRate).toBe(100);
  });
});
