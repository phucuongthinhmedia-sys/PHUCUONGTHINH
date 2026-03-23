import { Test, TestingModule } from '@nestjs/testing';
import { StylesService } from './styles.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Style Management Properties', () => {
  let service: StylesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StylesService,
        {
          provide: PrismaService,
          useValue: {
            style: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StylesService>(StylesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Property 19: Tag uniqueness enforcement', () => {
    it('should enforce unique style names and reject duplicates', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          async (styleName) => {
            // Mock first creation to succeed
            const mockStyle = {
              id: 'style-1',
              name: styleName,
              created_at: new Date(),
              updated_at: new Date(),
            };

            // Mock the service's error handling for Prisma unique constraint violation
            const prismaError = new Prisma.PrismaClientKnownRequestError(
              'Unique constraint violation',
              {
                code: 'P2002',
                clientVersion: '5.0.0',
                meta: { target: ['name'] },
              },
            );

            (prisma.style.create as jest.Mock)
              .mockResolvedValueOnce(mockStyle)
              .mockRejectedValueOnce(prismaError);

            // First creation should succeed
            const firstStyle = await service.create({ name: styleName });
            expect(firstStyle.name).toBe(styleName);

            // Second creation with same name should fail
            await expect(service.create({ name: styleName })).rejects.toThrow(
              ConflictException,
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should allow creation of styles with different names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), {
            minLength: 2,
            maxLength: 5,
          }),
          async (styleNames) => {
            // Ensure all names are unique
            const uniqueNames = [...new Set(styleNames)];
            if (uniqueNames.length < 2) return; // Skip if not enough unique names

            const mockStyles = uniqueNames.map((name, index) => ({
              id: `style-${index}`,
              name,
              created_at: new Date(),
              updated_at: new Date(),
            }));

            // Mock successful creation for all unique names
            (prisma.style.create as jest.Mock).mockImplementation(
              ({ data }) => {
                const style = mockStyles.find((s) => s.name === data.name);
                return Promise.resolve(style);
              },
            );

            // All unique names should be created successfully
            for (const name of uniqueNames) {
              const style = await service.create({ name });
              expect(style.name).toBe(name);
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 20: Many-to-many tag relationships', () => {
    it('should support multiple products per style and multiple styles per product', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            styleId: fc.string({ minLength: 1 }),
            productIds: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
              maxLength: 5,
            }),
          }),
          async ({ styleId, productIds }) => {
            const mockStyle = {
              id: styleId,
              name: 'Test Style',
              created_at: new Date(),
              updated_at: new Date(),
              products: productIds.map((productId) => ({
                product_id: productId,
                style_id: styleId,
                product: {
                  id: productId,
                  name: `Product ${productId}`,
                  sku: `SKU-${productId}`,
                },
              })),
            };

            (prisma.style.findUnique as jest.Mock).mockResolvedValue(mockStyle);

            const result = await service.findOne(styleId);

            // Verify the style can be associated with multiple products
            expect(result.products).toHaveLength(productIds.length);
            expect(result.products.map((p) => p.product_id)).toEqual(
              expect.arrayContaining(productIds),
            );

            // Verify each product relationship is properly structured
            result.products.forEach((productRelation) => {
              expect(productRelation.style_id).toBe(styleId);
              expect(productIds).toContain(productRelation.product_id);
              expect(productRelation.product).toBeDefined();
              expect(productRelation.product.id).toBe(
                productRelation.product_id,
              );
            });
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should maintain referential integrity in many-to-many relationships', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            styles: fc.array(
              fc.record({
                id: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1, maxLength: 100 }),
              }),
              { minLength: 1, maxLength: 3 },
            ),
            products: fc.array(
              fc.record({
                id: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1, maxLength: 100 }),
              }),
              { minLength: 1, maxLength: 3 },
            ),
          }),
          async ({ styles, products }) => {
            // Mock finding all styles with their product relationships
            (prisma.style.findMany as jest.Mock).mockResolvedValue(
              styles.map((style) => ({
                ...style,
                created_at: new Date(),
                updated_at: new Date(),
                products: products.map((product) => ({
                  product_id: product.id,
                  style_id: style.id,
                  product: {
                    id: product.id,
                    name: product.name,
                    sku: `SKU-${product.id}`,
                  },
                })),
              })),
            );

            const allStyles = await service.findAll();

            // Verify each style maintains proper relationships
            allStyles.forEach((style) => {
              expect(style.products).toBeDefined();
              style.products.forEach((productRelation) => {
                // Each product relationship should reference valid IDs
                expect(productRelation.style_id).toBe(style.id);
                expect(products.some((p) => p.id === productRelation.product_id))
                  .toBe(true);
                expect(productRelation.product).toBeDefined();
              });
            });

            // Verify total relationship count is consistent
            const totalRelationships = allStyles.reduce(
              (sum, style) => sum + style.products.length,
              0,
            );
            expect(totalRelationships).toBe(styles.length * products.length);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});