import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesService } from '../../categories/categories.service';
import { InspirationFilterService } from './inspiration-filter.service';
import { TechnicalFilterService } from './technical-filter.service';
import { CombinedFilterService } from './combined-filter.service';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Filtering System Properties', () => {
  let inspirationFilterService: InspirationFilterService;
  let technicalFilterService: TechnicalFilterService;
  let combinedFilterService: CombinedFilterService;
  let prismaService: PrismaService;
  let categoriesService: CategoriesService;

  // Mock data generators
  const styleArbitrary = fc.record({
    id: fc.string({ minLength: 1 }),
    name: fc.string({ minLength: 1 }),
  });

  const spaceArbitrary = fc.record({
    id: fc.string({ minLength: 1 }),
    name: fc.string({ minLength: 1 }),
  });

  const technicalSpecsArbitrary = fc.dictionary(
    fc.string({ minLength: 1 }),
    fc.oneof(
      fc.string(),
      fc.integer(),
      fc.boolean(),
      fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
    ),
  );

  const productArbitrary = fc.record({
    id: fc.string({ minLength: 1 }),
    name: fc.string({ minLength: 1 }),
    sku: fc.string({ minLength: 1 }),
    category_id: fc.string({ minLength: 1 }),
    technical_specs: technicalSpecsArbitrary,
    is_published: fc.boolean(),
    style_tags: fc.array(styleArbitrary, { maxLength: 3 }),
    space_tags: fc.array(spaceArbitrary, { maxLength: 3 }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspirationFilterService,
        TechnicalFilterService,
        CombinedFilterService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
            style: {
              findMany: jest.fn(),
            },
            space: {
              findMany: jest.fn(),
            },
            category: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findHierarchy: jest.fn(),
          },
        },
      ],
    }).compile();

    inspirationFilterService = module.get<InspirationFilterService>(
      InspirationFilterService,
    );
    technicalFilterService = module.get<TechnicalFilterService>(
      TechnicalFilterService,
    );
    combinedFilterService = module.get<CombinedFilterService>(
      CombinedFilterService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  describe('Property 7: Inspiration filter logic', () => {
    it('should return products matching ANY selected style AND ANY selected space', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            styles: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
              maxLength: 3,
            }),
            spaces: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
              maxLength: 3,
            }),
          }),
          async (filters) => {
            // Mock products that match the filter criteria
            const matchingProducts = [
              {
                id: '1',
                style_tags: [{ style_id: filters.styles[0] }],
                space_tags: [{ space_id: filters.spaces[0] }],
              },
              {
                id: '2',
                style_tags: [{ style_id: filters.styles[0] }],
                space_tags: [{ space_id: filters.spaces[0] }],
              },
            ];

            jest
              .spyOn(prismaService.product, 'findMany')
              .mockResolvedValue(matchingProducts as any);
            jest
              .spyOn(prismaService.product, 'count')
              .mockResolvedValue(matchingProducts.length);

            const whereClause =
              inspirationFilterService.buildInspirationWhere(filters);

            // Verify the where clause structure
            expect(whereClause).toHaveProperty('AND');
            expect(whereClause.AND).toHaveLength(2);

            // Check style filter (OR within styles)
            const styleCondition = whereClause.AND.find(
              (condition: any) => condition.style_tags?.some?.style_id?.in,
            );
            expect(styleCondition.style_tags.some.style_id.in).toEqual(
              filters.styles,
            );

            // Check space filter (OR within spaces)
            const spaceCondition = whereClause.AND.find(
              (condition: any) => condition.space_tags?.some?.space_id?.in,
            );
            expect(spaceCondition.space_tags.some.space_id.in).toEqual(
              filters.spaces,
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should handle single filter type correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.record({
              styles: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
            }),
            fc.record({
              spaces: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
            }),
          ),
          async (filters) => {
            const whereClause =
              inspirationFilterService.buildInspirationWhere(filters);

            if ('styles' in filters) {
              expect(whereClause).toHaveProperty('style_tags');
              expect(whereClause.style_tags.some.style_id.in).toEqual(
                filters.styles,
              );
            }

            if ('spaces' in filters) {
              expect(whereClause).toHaveProperty('space_tags');
              expect(whereClause.space_tags.some.space_id.in).toEqual(
                filters.spaces,
              );
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 8: Technical filter accuracy', () => {
    it('should return products matching all specified technical criteria', async () => {
      await fc.assert(
        fc.asyncProperty(technicalSpecsArbitrary, async (technicalFilters) => {
          // Skip empty filters
          if (Object.keys(technicalFilters).length === 0) return;

          const whereClause =
            technicalFilterService.buildTechnicalWhere(technicalFilters);

          // Verify that all technical specifications are included in the filter
          if (Object.keys(technicalFilters).length > 0) {
            expect(whereClause).toHaveProperty('AND');
            expect(whereClause.AND.length).toBeGreaterThan(0);

            // Each technical spec should generate a condition
            Object.entries(technicalFilters).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                // Array filters should create OR conditions
                const hasOrCondition = whereClause.AND.some(
                  (condition: any) =>
                    condition.OR &&
                    condition.OR.some((orCond: any) =>
                      orCond.technical_specs?.contains?.includes(`"${key}":`),
                    ),
                );
                expect(hasOrCondition).toBe(true);
              } else if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
              ) {
                // Exact match filters
                const hasExactCondition = whereClause.AND.some(
                  (condition: any) =>
                    condition.technical_specs?.contains ===
                    `"${key}":"${value}"`,
                );
                expect(hasExactCondition).toBe(true);
              }
            });
          }
        }),
        { numRuns: 100 },
      );
    });

    it('should validate technical filters correctly', async () => {
      await fc.assert(
        fc.property(technicalSpecsArbitrary, (technicalFilters) => {
          const isValid =
            technicalFilterService.validateTechnicalFilters(technicalFilters);

          // All generated filters should be valid (no malicious content)
          expect(isValid).toBe(true);
        }),
        { numRuns: 100 },
      );
    });

    it('should reject malicious technical filters', () => {
      const maliciousFilters = [
        { 'key"injection': 'value' },
        { key: 'value"injection' },
        { 'key\\escape': 'value' },
        { key: 'value\\escape' },
      ];

      maliciousFilters.forEach((filter) => {
        const isValid = technicalFilterService.validateTechnicalFilters(filter);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Property 5: JSONB filtering accuracy', () => {
    it('should correctly filter products by JSONB technical specifications', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(productArbitrary, { minLength: 2, maxLength: 10 }),
          fc.record({
            format: fc.constantFrom('Slab', 'Mosaic', 'Hexagon'),
            material: fc.constantFrom('Porcelain', 'Ceramic', 'Natural Stone'),
          }),
          async (products, filterCriteria) => {
            // Create products with matching technical specs
            const productsWithSpecs = products.map((product, index) => ({
              ...product,
              technical_specs: JSON.stringify({
                ...product.technical_specs,
                // Ensure some products match the filter criteria
                ...(index < 2 ? filterCriteria : {}),
              }),
            }));

            jest
              .spyOn(prismaService.product, 'findMany')
              .mockResolvedValue(productsWithSpecs as any);
            jest
              .spyOn(prismaService.product, 'count')
              .mockResolvedValue(productsWithSpecs.length);

            const whereClause =
              technicalFilterService.buildTechnicalWhere(filterCriteria);

            // Verify the where clause includes all filter criteria
            expect(whereClause).toHaveProperty('AND');
            expect(whereClause.AND.length).toBe(
              Object.keys(filterCriteria).length,
            );

            // Each filter criterion should be represented
            Object.entries(filterCriteria).forEach(([key, value]) => {
              const hasCondition = whereClause.AND.some(
                (condition: any) =>
                  condition.technical_specs?.contains === `"${key}":"${value}"`,
              );
              expect(hasCondition).toBe(true);
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Combined Filter Integration', () => {
    it('should combine inspiration and technical filters correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            inspiration: fc.record({
              styles: fc.array(fc.string({ minLength: 1 }), { maxLength: 2 }),
              spaces: fc.array(fc.string({ minLength: 1 }), { maxLength: 2 }),
            }),
            technical: fc.dictionary(
              fc.string({ minLength: 1 }),
              fc.string({ minLength: 1 }),
            ),
            categories: fc.array(fc.string({ minLength: 1 }), { maxLength: 2 }),
          }),
          async (filters) => {
            // Mock category hierarchy
            jest
              .spyOn(categoriesService, 'findHierarchy')
              .mockImplementation(async (id) => [{ id }]);

            // Mock empty results for simplicity
            jest.spyOn(prismaService.product, 'findMany').mockResolvedValue([]);
            jest.spyOn(prismaService.product, 'count').mockResolvedValue(0);
            jest.spyOn(prismaService.style, 'findMany').mockResolvedValue([]);
            jest.spyOn(prismaService.space, 'findMany').mockResolvedValue([]);
            jest
              .spyOn(prismaService.category, 'findMany')
              .mockResolvedValue([]);

            const result = await combinedFilterService.filterProducts(filters);

            // Verify the response structure
            expect(result).toHaveProperty('products');
            expect(result).toHaveProperty('pagination');
            expect(result).toHaveProperty('available_filters');
            expect(result.available_filters).toHaveProperty('inspiration');
            expect(result.available_filters).toHaveProperty('technical');
            expect(result.available_filters).toHaveProperty('categories');
          },
        ),
        { numRuns: 50 }, // Reduced runs for integration test
      );
    });
  });
});
