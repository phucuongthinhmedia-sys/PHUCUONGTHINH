import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchService } from './search.service';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Search Functionality Properties', () => {
  let searchService: SearchService;
  let prismaService: PrismaService;

  // Mock data generators
  const productArbitrary = fc.record({
    id: fc.string({ minLength: 1 }),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    sku: fc.string({ minLength: 1, maxLength: 50 }),
    description: fc.option(fc.string({ maxLength: 500 })),
    technical_specs: fc.string(),
    is_published: fc.boolean(),
    category_id: fc.string({ minLength: 1 }),
  });

  const searchQueryArbitrary = fc
    .string({ minLength: 1, maxLength: 100 })
    .filter((s) => s.trim().length > 0);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Property 25: Multi-field search coverage', () => {
    it('should search across product names, SKUs, and descriptions for any search query', async () => {
      await fc.assert(
        fc.asyncProperty(
          searchQueryArbitrary,
          fc.array(productArbitrary, { minLength: 1, maxLength: 10 }),
          async (searchQuery, products) => {
            // Mock database responses
            jest
              .spyOn(prismaService.product, 'findMany')
              .mockResolvedValue(products as any);
            jest
              .spyOn(prismaService.product, 'count')
              .mockResolvedValue(products.length);

            const result = await searchService.searchProducts(
              searchQuery,
              {},
              20,
              0,
            );

            // Verify that search was performed
            expect(prismaService.product.findMany).toHaveBeenCalled();

            const callArgs = (prismaService.product.findMany as jest.Mock).mock
              .calls[0][0];
            const whereClause = callArgs.where;

            // Verify that the where clause includes OR conditions for multi-field search
            expect(whereClause).toHaveProperty('AND');
            const andConditions = whereClause.AND;

            // Should have at least one OR condition for search fields
            const hasOrCondition = andConditions.some(
              (condition: any) => condition.OR && Array.isArray(condition.OR),
            );
            expect(hasOrCondition).toBe(true);

            // Verify search result structure
            expect(result).toHaveProperty('products');
            expect(result).toHaveProperty('total');
            expect(result).toHaveProperty('query');
            expect(result).toHaveProperty('search_terms');
            expect(result.query).toBe(searchQuery);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should return empty results for empty search queries', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('', '   ', '\t', '\n'),
          async (emptyQuery) => {
            const result = await searchService.searchProducts(
              emptyQuery,
              {},
              20,
              0,
            );

            expect(result.products).toEqual([]);
            expect(result.total).toBe(0);
            expect(result.query).toBe(emptyQuery);
          },
        ),
        { numRuns: 20 },
      );
    });

    it('should normalize search queries consistently', async () => {
      await fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 50 }), (rawQuery) => {
          // Test the private method through reflection or create a test helper
          const normalizedQuery = (searchService as any).normalizeSearchQuery(
            rawQuery,
          );

          // Normalized query should be lowercase and trimmed
          expect(normalizedQuery).toBe(normalizedQuery.toLowerCase());
          expect(normalizedQuery).toBe(normalizedQuery.trim());

          // Should not have multiple consecutive spaces
          expect(normalizedQuery).not.toMatch(/\s{2,}/);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 26: Search and filter combination', () => {
    it('should apply both search criteria and filters to results', async () => {
      await fc.assert(
        fc.asyncProperty(
          searchQueryArbitrary,
          fc.record({
            categories: fc.array(fc.string({ minLength: 1 }), { maxLength: 3 }),
            published: fc.constantFrom('true', 'false', 'all'),
          }),
          fc.record({
            styles: fc.array(fc.string({ minLength: 1 }), { maxLength: 2 }),
            spaces: fc.array(fc.string({ minLength: 1 }), { maxLength: 2 }),
          }),
          fc.dictionary(
            fc.string({ minLength: 1 }),
            fc.string({ minLength: 1 }),
          ),
          async (
            searchQuery,
            baseFilters,
            inspirationFilters,
            technicalFilters,
          ) => {
            // Mock database responses
            jest.spyOn(prismaService.product, 'findMany').mockResolvedValue([]);
            jest.spyOn(prismaService.product, 'count').mockResolvedValue(0);

            const result = await searchService.searchWithFilters(
              searchQuery,
              inspirationFilters,
              technicalFilters,
              baseFilters,
              { page: 1, limit: 20 },
            );

            // Verify that both search and filters were applied
            expect(prismaService.product.findMany).toHaveBeenCalled();

            const callArgs = (prismaService.product.findMany as jest.Mock).mock
              .calls[0][0];
            const whereClause = callArgs.where;

            // Should have AND conditions combining search with filters
            if (
              Object.keys(baseFilters).length > 0 ||
              Object.keys(inspirationFilters).length > 0 ||
              Object.keys(technicalFilters).length > 0
            ) {
              expect(whereClause).toHaveProperty('AND');
              expect(Array.isArray(whereClause.AND)).toBe(true);
              expect(whereClause.AND.length).toBeGreaterThan(0);
            }

            // Verify result structure includes pagination
            expect(result).toHaveProperty('products');
            expect(result).toHaveProperty('total');
            expect(result).toHaveProperty('pagination');
            expect(result.pagination).toHaveProperty('page');
            expect(result.pagination).toHaveProperty('limit');
            expect(result.pagination).toHaveProperty('total');
            expect(result.pagination).toHaveProperty('total_pages');
          },
        ),
        { numRuns: 50 }, // Reduced runs for complex integration test
      );
    });

    it('should handle empty filters gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(searchQueryArbitrary, async (searchQuery) => {
          // Mock database responses
          jest.spyOn(prismaService.product, 'findMany').mockResolvedValue([]);
          jest.spyOn(prismaService.product, 'count').mockResolvedValue(0);

          const result = await searchService.searchWithFilters(
            searchQuery,
            {}, // empty inspiration filters
            {}, // empty technical filters
            {}, // empty base filters
            { page: 1, limit: 20 },
          );

          // Should still perform search even with empty filters
          expect(result).toHaveProperty('products');
          expect(result).toHaveProperty('total');
          expect(result.query).toBe(searchQuery);
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Search Relevance and Ranking', () => {
    it('should calculate relevance scores consistently', async () => {
      await fc.assert(
        fc.property(
          productArbitrary,
          fc.array(fc.string({ minLength: 2, maxLength: 20 }), {
            minLength: 1,
            maxLength: 5,
          }),
          (product, searchTerms) => {
            const relevanceData = (
              searchService as any
            ).calculateRelevanceScore(product, searchTerms);

            // Relevance score should be non-negative
            expect(relevanceData.score).toBeGreaterThanOrEqual(0);

            // Should have match fields array
            expect(Array.isArray(relevanceData.matchFields)).toBe(true);

            // If there are matches, score should be positive
            if (relevanceData.matchFields.length > 0) {
              expect(relevanceData.score).toBeGreaterThan(0);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should rank exact matches higher than partial matches', () => {
      const product = {
        name: 'Ceramic Tile',
        sku: 'CT001',
        description: 'High quality ceramic tile',
        technical_specs: '{"material": "ceramic"}',
      };

      // Exact match should score higher than partial match
      const exactMatch = (searchService as any).calculateRelevanceScore(
        product,
        ['ceramic'],
      );
      const partialMatch = (searchService as any).calculateRelevanceScore(
        product,
        ['ceram'],
      );

      expect(exactMatch.score).toBeGreaterThan(partialMatch.score);
    });

    it('should rank name matches higher than description matches', () => {
      const product = {
        name: 'Tile',
        sku: 'T001',
        description: 'Beautiful marble surface',
        technical_specs: '{}',
      };

      const nameMatch = (searchService as any).calculateRelevanceScore(
        product,
        ['tile'],
      );
      const descriptionMatch = (searchService as any).calculateRelevanceScore(
        product,
        ['marble'],
      );

      expect(nameMatch.score).toBeGreaterThan(descriptionMatch.score);
    });
  });

  describe('Search Suggestions', () => {
    it('should return relevant suggestions for partial queries', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 2, maxLength: 10 }),
          fc.array(productArbitrary, { minLength: 1, maxLength: 10 }),
          async (partialQuery, products) => {
            // Mock products that might match the partial query
            const mockProducts = products.map((p) => ({
              name: p.name,
              sku: p.sku,
            }));

            jest
              .spyOn(prismaService.product, 'findMany')
              .mockResolvedValue(mockProducts as any);

            const suggestions = await searchService.getSearchSuggestions(
              partialQuery,
              5,
            );

            // Should return array of suggestions
            expect(Array.isArray(suggestions)).toBe(true);
            expect(suggestions.length).toBeLessThanOrEqual(5);

            // All suggestions should be strings
            suggestions.forEach((suggestion) => {
              expect(typeof suggestion).toBe('string');
              expect(suggestion.length).toBeGreaterThan(0);
            });
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should return empty array for very short queries', async () => {
      const shortQueries = ['', 'a', ' '];

      for (const query of shortQueries) {
        const suggestions = await searchService.getSearchSuggestions(query, 10);
        expect(suggestions).toEqual([]);
      }
    });
  });

  describe('Search Term Extraction', () => {
    it('should extract meaningful search terms from queries', async () => {
      await fc.assert(
        fc.property(fc.string({ minLength: 3, maxLength: 100 }), (query) => {
          const normalizedQuery = (searchService as any).normalizeSearchQuery(
            query,
          );
          const searchTerms = (searchService as any).extractSearchTerms(
            normalizedQuery,
          );

          // All terms should be at least 2 characters long
          searchTerms.forEach((term: string) => {
            expect(term.length).toBeGreaterThanOrEqual(2);
            expect(typeof term).toBe('string');
          });

          // Should not contain empty strings
          expect(searchTerms).not.toContain('');
        }),
        { numRuns: 100 },
      );
    });
  });
});
