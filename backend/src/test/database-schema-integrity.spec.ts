import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Database Schema Integrity Properties', () => {
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
    // Clean up in reverse order of dependencies
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

  describe('Property 21: Referential integrity validation', () => {
    it('should validate foreign key references for product-category relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.option(fc.string({ maxLength: 500 })),
            technical_specs: fc.string(), // JSON string for SQLite
          }),
          async (productData) => {
            const invalidCategoryId = 'invalid-category-id';

            // Attempt to create product with invalid category_id should fail
            // This tests API-level validation rather than database constraints
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
        { numRuns: 50 }, // Reduced runs for faster testing
      );
    });

    it('should validate foreign key references for media-product relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            file_url: fc.webUrl(),
            file_type: fc.constantFrom('image/jpeg', 'image/png', 'video/mp4'),
            media_type: fc.constantFrom('lifestyle', 'cutout', 'video', '3d_file', 'pdf'),
            sort_order: fc.integer({ min: 0, max: 100 }),
            is_cover: fc.boolean(),
          }),
          async (mediaData) => {
            const invalidProductId = 'invalid-product-id';

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
        { numRuns: 50 },
      );
    });

    it('should validate foreign key references for category hierarchy', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            slug: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (categoryData) => {
            const invalidParentId = 'invalid-parent-id';

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
        { numRuns: 50 },
      );
    });
  });

  describe('Property 23: Unique field validation', () => {
    it('should validate unique constraints on user email', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password_hash: fc.string({ minLength: 8 }),
            role: fc.constantFrom('admin', 'user'),
          }),
          async (userData) => {
            // Create first user
            await prisma.user.create({
              data: userData,
            });

            // Attempt to create second user with same email should fail
            await expect(
              prisma.user.create({
                data: {
                  ...userData,
                  password_hash: 'different_password',
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should validate unique constraints on product SKU', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.option(fc.string({ maxLength: 500 })),
            technical_specs: fc.string(), // JSON string for SQLite
          }),
          async (productData) => {
            // First create a category
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug: `test-category-${Date.now()}-${Math.random()}`,
              },
            });

            // Create first product
            await prisma.product.create({
              data: {
                ...productData,
                category_id: category.id,
              },
            });

            // Attempt to create second product with same SKU should fail
            await expect(
              prisma.product.create({
                data: {
                  ...productData,
                  name: 'Different Name',
                  category_id: category.id,
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should validate unique constraints on category slug', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            slug: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (categoryData) => {
            // Create first category
            await prisma.category.create({
              data: categoryData,
            });

            // Attempt to create second category with same slug should fail
            await expect(
              prisma.category.create({
                data: {
                  ...categoryData,
                  name: 'Different Name',
                },
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should validate unique constraints on style names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (styleData) => {
            // Create first style
            await prisma.style.create({
              data: styleData,
            });

            // Attempt to create second style with same name should fail
            await expect(
              prisma.style.create({
                data: styleData,
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should validate unique constraints on space names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          async (spaceData) => {
            // Create first space
            await prisma.space.create({
              data: spaceData,
            });

            // Attempt to create second space with same name should fail
            await expect(
              prisma.space.create({
                data: spaceData,
              }),
            ).rejects.toThrow();
          },
        ),
        { numRuns: 50 },
      );
    });
  });
});