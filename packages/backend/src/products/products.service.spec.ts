import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { CombinedFilterService } from './services/combined-filter.service';
import { InspirationFilterService } from './services/inspiration-filter.service';
import { TechnicalFilterService } from './services/technical-filter.service';
import { SearchService } from './services/search.service';
import { PaginationService } from './services/pagination.service';
import { CacheService } from './services/cache.service';
import { PerformanceService } from './services/performance.service';
import * as fc from 'fast-check';

// Set environment variable for test database
process.env.DATABASE_URL = 'file:./test.db';

describe('Feature: digital-showroom-cms, Product Management Properties', () => {
  let service: ProductsService;
  let categoriesService: CategoriesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        PrismaService,
        ProductsService,
        CategoriesService,
        // Mock the CombinedFilterService to avoid complex dependencies
        {
          provide: CombinedFilterService,
          useValue: {
            filterProducts: jest.fn().mockResolvedValue({
              products: [],
              pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
              available_filters: {
                inspiration: {},
                technical: {},
                categories: [],
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  beforeEach(async () => {
    // Clean up in reverse dependency order
    await prisma.productSpaceTag.deleteMany();
    await prisma.productStyleTag.deleteMany();
    await prisma.media.deleteMany();
    await prisma.product.deleteMany();
    await prisma.space.deleteMany();
    await prisma.style.deleteMany();
    await prisma.category.deleteMany();
  });

  describe('Property 4: JSONB technical specifications storage', () => {
    it('should store and retrieve product-specific attributes correctly in JSONB field', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.string({ minLength: 1, maxLength: 50 }),
            sku: fc.string({ minLength: 1, maxLength: 20 }),
            categoryName: fc.string({ minLength: 1, maxLength: 30 }),
            technicalSpecs: fc.record({
              thickness: fc.option(fc.float({ min: 0.1, max: 50 })),
              material: fc.option(
                fc.constantFrom(
                  'Porcelain',
                  'Ceramic',
                  'Natural Stone',
                  'Composite',
                ),
              ),
              dimensions: fc.option(
                fc.record({
                  length: fc.float({ min: 1, max: 5000 }),
                  width: fc.float({ min: 1, max: 5000 }),
                  height: fc.option(fc.float({ min: 1, max: 1000 })),
                }),
              ),
              color: fc.option(
                fc.constantFrom('White', 'Black', 'Grey', 'Beige', 'Brown'),
              ),
              finish: fc.option(
                fc.constantFrom('Matte', 'Glossy', 'Textured', 'Polished'),
              ),
              waterResistance: fc.option(fc.boolean()),
              customProperty: fc.option(fc.string({ maxLength: 100 })),
            }),
          }),
          async ({ productName, sku, categoryName, technicalSpecs }) => {
            // Create category first
            const category = await categoriesService.create({
              name: categoryName,
            });

            // Create product with technical specs
            const product = await service.create({
              name: productName,
              sku: `${sku}-${Date.now()}-${Math.random()}`, // Ensure uniqueness
              category_id: category.id,
              technical_specs: technicalSpecs,
            });

            // Retrieve product and verify technical specs
            const retrievedProduct = await service.findOne(product.id);

            // Technical specs should be stored and retrieved correctly
            expect(retrievedProduct.technical_specs).toEqual(technicalSpecs);

            // Verify specific properties if they exist
            if (technicalSpecs.thickness !== undefined) {
              expect(retrievedProduct.technical_specs.thickness).toBe(
                technicalSpecs.thickness,
              );
            }
            if (technicalSpecs.material !== undefined) {
              expect(retrievedProduct.technical_specs.material).toBe(
                technicalSpecs.material,
              );
            }
            if (technicalSpecs.dimensions !== undefined) {
              expect(retrievedProduct.technical_specs.dimensions).toEqual(
                technicalSpecs.dimensions,
              );
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 6: Required field validation', () => {
    it('should reject product creation when required fields are missing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            sku: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            category_id: fc.option(fc.string()),
            technical_specs: fc.record({}),
          }),
          async ({ name, sku, category_id, technical_specs }) => {
            // At least one required field should be missing
            const missingRequiredField = !name || !sku || !category_id;

            if (missingRequiredField) {
              // Should reject creation when required fields are missing
              await expect(
                service.create({
                  name: name || '',
                  sku: sku || '',
                  category_id: category_id || '',
                  technical_specs,
                }),
              ).rejects.toThrow();
            } else {
              // If all required fields are present, create a category first
              const category = await categoriesService.create({
                name: `test-category-${Date.now()}-${Math.random()}`,
              });

              // Should succeed when all required fields are present
              const product = await service.create({
                name,
                sku: `${sku}-${Date.now()}-${Math.random()}`,
                category_id: category.id,
                technical_specs,
              });

              expect(product).toBeDefined();
              expect(product.name).toBe(name);
              expect(product.category_id).toBe(category.id);
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 18: Category assignment constraint', () => {
    it('should enforce exactly one primary category assignment per product', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.string({ minLength: 1, maxLength: 50 }),
            sku: fc.string({ minLength: 1, maxLength: 20 }),
            categoryNames: fc.array(
              fc.string({ minLength: 1, maxLength: 30 }),
              { minLength: 1, maxLength: 3 },
            ),
          }),
          async ({ productName, sku, categoryNames }) => {
            // Create multiple categories
            const categories = [];
            for (const categoryName of categoryNames) {
              const category = await categoriesService.create({
                name: categoryName,
              });
              categories.push(category);
            }

            // Create product with first category
            const product = await service.create({
              name: productName,
              sku: `${sku}-${Date.now()}-${Math.random()}`,
              category_id: categories[0].id,
              technical_specs: {},
            });

            // Verify product has exactly one category
            const retrievedProduct = await service.findOne(product.id);
            expect(retrievedProduct.category_id).toBe(categories[0].id);
            expect(retrievedProduct.category).toBeDefined();
            expect(retrievedProduct.category.id).toBe(categories[0].id);

            // Update product to different category if multiple categories exist
            if (categories.length > 1) {
              const updatedProduct = await service.update(product.id, {
                category_id: categories[1].id,
              });

              // Should have exactly one category (the new one)
              expect(updatedProduct.category_id).toBe(categories[1].id);
              expect(updatedProduct.category.id).toBe(categories[1].id);

              // Verify in database
              const finalProduct = await service.findOne(product.id);
              expect(finalProduct.category_id).toBe(categories[1].id);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should reject product creation with invalid category reference', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.string({ minLength: 1, maxLength: 50 }),
            sku: fc.string({ minLength: 1, maxLength: 20 }),
            invalidCategoryId: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          async ({ productName, sku, invalidCategoryId }) => {
            // Attempt to create product with non-existent category
            await expect(
              service.create({
                name: productName,
                sku: `${sku}-${Date.now()}-${Math.random()}`,
                category_id: invalidCategoryId,
                technical_specs: {},
              }),
            ).rejects.toThrow(/not found/i);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 30: Publication status filtering', () => {
    it('should filter products by publication status correctly in public queries', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            publishedProducts: fc.array(
              fc.record({
                name: fc.string({ minLength: 1, maxLength: 50 }),
                sku: fc.string({ minLength: 1, maxLength: 20 }),
              }),
              { minLength: 1, maxLength: 5 },
            ),
            unpublishedProducts: fc.array(
              fc.record({
                name: fc.string({ minLength: 1, maxLength: 50 }),
                sku: fc.string({ minLength: 1, maxLength: 20 }),
              }),
              { minLength: 1, maxLength: 5 },
            ),
            categoryName: fc.string({ minLength: 1, maxLength: 30 }),
          }),
          async ({ publishedProducts, unpublishedProducts, categoryName }) => {
            // Create category
            const category = await categoriesService.create({
              name: categoryName,
            });

            // Create published products
            const createdPublishedProducts = [];
            for (const productData of publishedProducts) {
              const product = await service.create({
                name: productData.name,
                sku: `${productData.sku}-pub-${Date.now()}-${Math.random()}`,
                category_id: category.id,
                technical_specs: {},
              });

              // Add media asset (required for publishing)
              await prisma.media.create({
                data: {
                  product_id: product.id,
                  file_url: 'https://example.com/image.jpg',
                  file_type: 'image/jpeg',
                  media_type: 'lifestyle',
                  is_cover: true,
                },
              });

              // Publish the product
              const publishedProduct = await service.publish(product.id);
              createdPublishedProducts.push(publishedProduct);
            }

            // Create unpublished products
            const createdUnpublishedProducts = [];
            for (const productData of unpublishedProducts) {
              const product = await service.create({
                name: productData.name,
                sku: `${productData.sku}-unpub-${Date.now()}-${Math.random()}`,
                category_id: category.id,
                technical_specs: {},
              });
              createdUnpublishedProducts.push(product);
            }

            // Test filtering for published products only (default behavior)
            const publishedResults = await service.findAll({
              published: 'true',
            });
            const publishedIds = publishedResults.products.map((p) => p.id);

            // All returned products should be published
            for (const product of publishedResults.products) {
              expect(product.is_published).toBe(true);
            }

            // Should include all created published products
            for (const publishedProduct of createdPublishedProducts) {
              expect(publishedIds).toContain(publishedProduct.id);
            }

            // Should not include any unpublished products
            for (const unpublishedProduct of createdUnpublishedProducts) {
              expect(publishedIds).not.toContain(unpublishedProduct.id);
            }

            // Test filtering for unpublished products only
            const unpublishedResults = await service.findAll({
              published: 'false',
            });
            const unpublishedIds = unpublishedResults.products.map((p) => p.id);

            // All returned products should be unpublished
            for (const product of unpublishedResults.products) {
              expect(product.is_published).toBe(false);
            }

            // Should include all created unpublished products
            for (const unpublishedProduct of createdUnpublishedProducts) {
              expect(unpublishedIds).toContain(unpublishedProduct.id);
            }

            // Should not include any published products
            for (const publishedProduct of createdPublishedProducts) {
              expect(unpublishedIds).not.toContain(publishedProduct.id);
            }

            // Test filtering for all products
            const allResults = await service.findAll({ published: 'all' });
            const allIds = allResults.products.map((p) => p.id);

            // Should include both published and unpublished products
            for (const publishedProduct of createdPublishedProducts) {
              expect(allIds).toContain(publishedProduct.id);
            }
            for (const unpublishedProduct of createdUnpublishedProducts) {
              expect(allIds).toContain(unpublishedProduct.id);
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 31: Publication validation', () => {
    it('should validate required fields and media before allowing publication', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            sku: fc.string({ minLength: 1, maxLength: 20 }),
            categoryName: fc.string({ minLength: 1, maxLength: 30 }),
            hasMedia: fc.boolean(),
            technicalSpecs: fc.record({}),
          }),
          async ({
            productName,
            sku,
            categoryName,
            hasMedia,
            technicalSpecs,
          }) => {
            // Create category
            const category = await categoriesService.create({
              name: categoryName,
            });

            // Create product (may have missing required fields)
            const product = await service.create({
              name: productName || 'Test Product',
              sku: `${sku}-${Date.now()}-${Math.random()}`,
              category_id: category.id,
              technical_specs: technicalSpecs,
            });

            // Add media if specified
            if (hasMedia) {
              await prisma.media.create({
                data: {
                  product_id: product.id,
                  file_url: 'https://example.com/image.jpg',
                  file_type: 'image/jpeg',
                  media_type: 'lifestyle',
                  is_cover: true,
                },
              });
            }

            // Determine if publication should succeed
            const hasRequiredFields = productName && productName.length > 0;
            const shouldSucceed = hasRequiredFields && hasMedia;

            if (shouldSucceed) {
              // Publication should succeed
              const publishedProduct = await service.publish(product.id);
              expect(publishedProduct.is_published).toBe(true);

              // Verify product is now published
              const retrievedProduct = await service.findOne(product.id);
              expect(retrievedProduct.is_published).toBe(true);
            } else {
              // Publication should fail with validation error
              await expect(service.publish(product.id)).rejects.toThrow();

              // Product should remain unpublished
              const retrievedProduct = await service.findOne(product.id);
              expect(retrievedProduct.is_published).toBe(false);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should allow unpublishing any product regardless of validation state', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.string({ minLength: 1, maxLength: 50 }),
            sku: fc.string({ minLength: 1, maxLength: 20 }),
            categoryName: fc.string({ minLength: 1, maxLength: 30 }),
          }),
          async ({ productName, sku, categoryName }) => {
            // Create category
            const category = await categoriesService.create({
              name: categoryName,
            });

            // Create and publish product
            const product = await service.create({
              name: productName,
              sku: `${sku}-${Date.now()}-${Math.random()}`,
              category_id: category.id,
              technical_specs: {},
            });

            // Add media and publish
            await prisma.media.create({
              data: {
                product_id: product.id,
                file_url: 'https://example.com/image.jpg',
                file_type: 'image/jpeg',
                media_type: 'lifestyle',
                is_cover: true,
              },
            });

            const publishedProduct = await service.publish(product.id);
            expect(publishedProduct.is_published).toBe(true);

            // Unpublish should always succeed
            const unpublishedProduct = await service.unpublish(product.id);
            expect(unpublishedProduct.is_published).toBe(false);

            // Verify product is now unpublished
            const retrievedProduct = await service.findOne(product.id);
            expect(retrievedProduct.is_published).toBe(false);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
