import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import * as fc from 'fast-check';

describe('Feature: optimized-pim-schema, Referential Integrity Properties', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up in reverse order of dependencies for current schema
    await prisma.leadProduct.deleteMany();
    await prisma.productSpaceTag.deleteMany();
    await prisma.productStyleTag.deleteMany();
    await prisma.media.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.product.deleteMany();
    await prisma.space.deleteMany();
    await prisma.style.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Property 5: Referential Integrity Enforcement', () => {
    it('should enforce foreign key constraints for product-category relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.option(fc.string({ maxLength: 500 })),
            technical_specs: fc.string(), // JSON string for SQLite
            is_published: fc.boolean(),
          }),
          async (productData) => {
            const invalidCategoryId = 'invalid-category-id-' + Math.random();

            // Attempt to create product with invalid category_id should fail
            await expect(
              prisma.product.create({
                data: {
                  ...productData,
                  category_id: invalidCategoryId,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce foreign key constraints for media-product relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            file_url: fc.webUrl(),
            file_type: fc.constantFrom('image/jpeg', 'image/png', 'video/mp4'),
            media_type: fc.constantFrom(
              'lifestyle',
              'cutout',
              'video',
              '3d_file',
              'pdf',
            ),
            sort_order: fc.integer({ min: 0, max: 100 }),
            is_cover: fc.boolean(),
            file_size: fc.option(fc.integer({ min: 1, max: 10000000 })),
          }),
          async (mediaData) => {
            const invalidProductId = 'invalid-product-id-' + Math.random();

            // Attempt to create media with invalid product_id should fail
            await expect(
              prisma.media.create({
                data: {
                  ...mediaData,
                  product_id: invalidProductId,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce foreign key constraints for category hierarchy (parent-child)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            slug: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (categoryData) => {
            const invalidParentId = 'invalid-parent-id-' + Math.random();

            // Attempt to create category with invalid parent_id should fail
            await expect(
              prisma.category.create({
                data: {
                  ...categoryData,
                  parent_id: invalidParentId,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce foreign key constraints for product-style tag relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc
              .string({ minLength: 1, maxLength: 20 })
              .map((s) => s + '-' + Date.now() + '-' + Math.random()),
            description: fc.option(fc.string({ maxLength: 500 })),
            technical_specs: fc.string(),
            is_published: fc.boolean(),
          }),
          async (productData) => {
            const invalidStyleId = 'invalid-style-id-' + Math.random();

            // Create a valid category first
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug: `test-category-${Date.now()}-${Math.random()}`,
              },
            });

            // Create a valid product
            const product = await prisma.product.create({
              data: {
                ...productData,
                category_id: category.id,
              },
            });

            // Attempt to create product-style tag with invalid style_id should fail
            await expect(
              prisma.productStyleTag.create({
                data: {
                  product_id: product.id,
                  style_id: invalidStyleId,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce foreign key constraints for product-space tag relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc
              .string({ minLength: 1, maxLength: 20 })
              .map((s) => s + '-' + Date.now() + '-' + Math.random()),
            description: fc.option(fc.string({ maxLength: 500 })),
            technical_specs: fc.string(),
            is_published: fc.boolean(),
          }),
          async (productData) => {
            const invalidSpaceId = 'invalid-space-id-' + Math.random();

            // Create a valid category first
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug: `test-category-${Date.now()}-${Math.random()}`,
              },
            });

            // Create a valid product
            const product = await prisma.product.create({
              data: {
                ...productData,
                category_id: category.id,
              },
            });

            // Attempt to create product-space tag with invalid space_id should fail
            await expect(
              prisma.productSpaceTag.create({
                data: {
                  product_id: product.id,
                  space_id: invalidSpaceId,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce foreign key constraints for lead-product relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            email: fc.option(fc.emailAddress()),
            phone: fc.option(fc.string({ minLength: 10, maxLength: 15 })),
            inquiry_type: fc.constantFrom('quote', 'appointment', 'general'),
            project_details: fc.option(fc.string({ maxLength: 500 })),
            status: fc.constantFrom('new', 'contacted', 'qualified', 'closed'),
          }),
          async (leadData) => {
            const invalidProductId = 'invalid-product-id-' + Math.random();

            // Create a valid lead first
            const lead = await prisma.lead.create({
              data: leadData,
            });

            // Attempt to create lead-product relationship with invalid product_id should fail
            await expect(
              prisma.leadProduct.create({
                data: {
                  lead_id: lead.id,
                  product_id: invalidProductId,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should maintain referential integrity when deleting referenced entities', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            categoryName: fc.string({ minLength: 1, maxLength: 100 }),
            productSku: fc.string({ minLength: 1, maxLength: 50 }),
            productName: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (testData) => {
            // Create category
            const category = await prisma.category.create({
              data: {
                name: testData.categoryName + '-' + Date.now(),
                slug: `category-${Date.now()}-${Math.random()}`,
              },
            });

            // Create product that references the category
            await prisma.product.create({
              data: {
                sku: testData.productSku + '-' + Date.now(),
                name: testData.productName,
                category_id: category.id,
                technical_specs: '{}',
                is_published: false,
              },
            });

            // Attempting to delete category should fail due to foreign key constraint
            await expect(
              prisma.category.delete({
                where: { id: category.id },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce cascade delete for media when product is deleted', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.string({ minLength: 1, maxLength: 100 }),
            productSku: fc.string({ minLength: 1, maxLength: 50 }),
            mediaUrl: fc.webUrl(),
            mediaType: fc.constantFrom(
              'lifestyle',
              'cutout',
              'video',
              '3d_file',
              'pdf',
            ),
          }),
          async (testData) => {
            // Create category
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug: `category-${Date.now()}-${Math.random()}`,
              },
            });

            // Create product
            const product = await prisma.product.create({
              data: {
                sku: testData.productSku + '-' + Date.now(),
                name: testData.productName,
                category_id: category.id,
                technical_specs: '{}',
                is_published: false,
              },
            });

            // Create media for the product
            const media = await prisma.media.create({
              data: {
                product_id: product.id,
                file_url: testData.mediaUrl,
                file_type: 'image/jpeg',
                media_type: testData.mediaType,
                sort_order: 0,
                is_cover: false,
              },
            });

            // Delete the product (should cascade delete media)
            await prisma.product.delete({
              where: { id: product.id },
            });

            // Verify media was cascade deleted
            const deletedMedia = await prisma.media.findUnique({
              where: { id: media.id },
            });

            expect(deletedMedia).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should enforce cascade delete for product tags when product is deleted', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            productName: fc.string({ minLength: 1, maxLength: 100 }),
            productSku: fc.string({ minLength: 1, maxLength: 50 }),
            styleName: fc.string({ minLength: 1, maxLength: 100 }),
            spaceName: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (testData) => {
            // Create category, style, and space
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug: `category-${Date.now()}-${Math.random()}`,
              },
            });

            const style = await prisma.style.create({
              data: {
                name: testData.styleName + '-' + Date.now(),
              },
            });

            const space = await prisma.space.create({
              data: {
                name: testData.spaceName + '-' + Date.now(),
              },
            });

            // Create product
            const product = await prisma.product.create({
              data: {
                sku: testData.productSku + '-' + Date.now(),
                name: testData.productName,
                category_id: category.id,
                technical_specs: '{}',
                is_published: false,
              },
            });

            // Create product tags
            await prisma.productStyleTag.create({
              data: {
                product_id: product.id,
                style_id: style.id,
              },
            });

            await prisma.productSpaceTag.create({
              data: {
                product_id: product.id,
                space_id: space.id,
              },
            });

            // Delete the product (should cascade delete tags)
            await prisma.product.delete({
              where: { id: product.id },
            });

            // Verify tags were cascade deleted
            const styleTag = await prisma.productStyleTag.findUnique({
              where: {
                product_id_style_id: {
                  product_id: product.id,
                  style_id: style.id,
                },
              },
            });

            const spaceTag = await prisma.productSpaceTag.findUnique({
              where: {
                product_id_space_id: {
                  product_id: product.id,
                  space_id: space.id,
                },
              },
            });

            expect(styleTag).toBeNull();
            expect(spaceTag).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
