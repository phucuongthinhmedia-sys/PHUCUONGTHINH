import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';
import * as fc from 'fast-check';

// Set environment variable for test database
process.env.DATABASE_URL = 'file:./test.db';

describe('Feature: digital-showroom-cms, Category Management Properties', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [PrismaService, CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    
    await prisma.$connect();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  beforeEach(async () => {
    // Clean up categories in reverse dependency order
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  describe('Property 17: Category hierarchy integrity', () => {
    it('should correctly return products from category and all its subcategories', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            rootCategoryName: fc.string({ minLength: 1, maxLength: 50 }),
            childCategoryNames: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 3 }),
            productNames: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
          }),
          async ({ rootCategoryName, childCategoryNames, productNames }) => {
            // Create root category
            const rootCategory = await service.create({
              name: rootCategoryName,
            });

            // Create child categories
            const childCategories = [];
            for (const childName of childCategoryNames) {
              const childCategory = await service.create({
                name: childName,
                parent_id: rootCategory.id,
              });
              childCategories.push(childCategory);
            }

            // Create products in both root and child categories
            const allCategories = [rootCategory, ...childCategories];
            const createdProducts = [];

            for (let i = 0; i < productNames.length; i++) {
              const categoryIndex = i % allCategories.length;
              const category = allCategories[categoryIndex];
              
              const product = await prisma.product.create({
                data: {
                  name: productNames[i],
                  sku: `sku-${i}-${Date.now()}-${Math.random()}`,
                  category_id: category.id,
                  technical_specs: JSON.stringify({}),
                },
              });
              createdProducts.push(product);
            }

            // Get hierarchy for root category
            const hierarchy = await service.findHierarchy(rootCategory.id);
            const hierarchyCategoryIds = hierarchy.map(cat => cat.id);

            // Query products in the hierarchy
            const productsInHierarchy = await prisma.product.findMany({
              where: {
                category_id: {
                  in: hierarchyCategoryIds,
                },
              },
            });

            // All created products should be found in the hierarchy
            expect(productsInHierarchy).toHaveLength(createdProducts.length);
            
            // Verify each product is in the hierarchy
            const foundProductIds = productsInHierarchy.map(p => p.id);
            for (const product of createdProducts) {
              expect(foundProductIds).toContain(product.id);
            }

            // Verify hierarchy includes root category and all children
            expect(hierarchyCategoryIds).toContain(rootCategory.id);
            for (const childCategory of childCategories) {
              expect(hierarchyCategoryIds).toContain(childCategory.id);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should maintain hierarchy integrity when querying nested categories', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            levels: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 2, maxLength: 4 }),
          }),
          async ({ levels }) => {
            // Create nested category hierarchy
            let parentCategory = null;
            const createdCategories = [];

            for (const levelName of levels) {
              const category = await service.create({
                name: levelName,
                parent_id: parentCategory?.id,
              });
              createdCategories.push(category);
              parentCategory = category;
            }

            // Get hierarchy from root
            const rootCategory = createdCategories[0];
            const hierarchy = await service.findHierarchy(rootCategory.id);

            // Hierarchy should include all created categories
            expect(hierarchy).toHaveLength(createdCategories.length);

            // Verify each category is in the hierarchy
            const hierarchyIds = hierarchy.map(cat => cat.id);
            for (const category of createdCategories) {
              expect(hierarchyIds).toContain(category.id);
            }

            // Verify parent-child relationships are maintained
            for (let i = 1; i < createdCategories.length; i++) {
              const child = createdCategories[i];
              const parent = createdCategories[i - 1];
              expect(child.parent_id).toBe(parent.id);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should prevent circular references in category hierarchy', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            categoryNames: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 2, maxLength: 3 }),
          }),
          async ({ categoryNames }) => {
            // Create categories in a chain
            const categories = [];
            let parentId = null;

            for (const name of categoryNames) {
              const category = await service.create({
                name,
                parent_id: parentId,
              });
              categories.push(category);
              parentId = category.id;
            }

            // Attempt to create circular reference (last -> first)
            const lastCategory = categories[categories.length - 1];
            const firstCategory = categories[0];

            await expect(
              service.update(firstCategory.id, {
                parent_id: lastCategory.id,
              }),
            ).rejects.toThrow(/circular reference/i);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});