import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Space Management Properties', () => {
  let service: SpacesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: {
            space: {
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

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Property 19: Tag uniqueness enforcement', () => {
    it('should enforce unique space names and reject duplicates', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          async (spaceName) => {
            // Mock first creation to succeed
            const mockSpace = {
              id: 'space-1',
              name: spaceName,
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

            (prisma.space.create as jest.Mock)
              .mockResolvedValueOnce(mockSpace)
              .mockRejectedValueOnce(prismaError);

            // First creation should succeed
            const firstSpace = await service.create({ name: spaceName });
            expect(firstSpace.name).toBe(spaceName);

            // Second creation with same name should fail
            await expect(service.create({ name: spaceName })).rejects.toThrow(
              ConflictException,
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should allow creation of spaces with different names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), {
            minLength: 2,
            maxLength: 5,
          }),
          async (spaceNames) => {
            // Ensure all names are unique
            const uniqueNames = [...new Set(spaceNames)];
            if (uniqueNames.length < 2) return; // Skip if not enough unique names

            const mockSpaces = uniqueNames.map((name, index) => ({
              id: `space-${index}`,
              name,
              created_at: new Date(),
              updated_at: new Date(),
            }));

            // Mock successful creation for all unique names
            (prisma.space.create as jest.Mock).mockImplementation(
              ({ data }) => {
                const space = mockSpaces.find((s) => s.name === data.name);
                return Promise.resolve(space);
              },
            );

            // All unique names should be created successfully
            for (const name of uniqueNames) {
              const space = await service.create({ name });
              expect(space.name).toBe(name);
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 20: Many-to-many tag relationships', () => {
    it('should support multiple products per space and multiple spaces per product', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            spaceId: fc.string({ minLength: 1 }),
            productIds: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
              maxLength: 5,
            }),
          }),
          async ({ spaceId, productIds }) => {
            const mockSpace = {
              id: spaceId,
              name: 'Test Space',
              created_at: new Date(),
              updated_at: new Date(),
              products: productIds.map((productId) => ({
                product_id: productId,
                space_id: spaceId,
                product: {
                  id: productId,
                  name: `Product ${productId}`,
                  sku: `SKU-${productId}`,
                },
              })),
            };

            (prisma.space.findUnique as jest.Mock).mockResolvedValue(mockSpace);

            const result = await service.findOne(spaceId);

            // Verify the space can be associated with multiple products
            expect(result.products).toHaveLength(productIds.length);
            expect(result.products.map((p) => p.product_id)).toEqual(
              expect.arrayContaining(productIds),
            );

            // Verify each product relationship is properly structured
            result.products.forEach((productRelation) => {
              expect(productRelation.space_id).toBe(spaceId);
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
            spaces: fc.array(
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
          async ({ spaces, products }) => {
            // Mock finding all spaces with their product relationships
            (prisma.space.findMany as jest.Mock).mockResolvedValue(
              spaces.map((space) => ({
                ...space,
                created_at: new Date(),
                updated_at: new Date(),
                products: products.map((product) => ({
                  product_id: product.id,
                  space_id: space.id,
                  product: {
                    id: product.id,
                    name: product.name,
                    sku: `SKU-${product.id}`,
                  },
                })),
              })),
            );

            const allSpaces = await service.findAll();

            // Verify each space maintains proper relationships
            allSpaces.forEach((space) => {
              expect(space.products).toBeDefined();
              space.products.forEach((productRelation) => {
                // Each product relationship should reference valid IDs
                expect(productRelation.space_id).toBe(space.id);
                expect(products.some((p) => p.id === productRelation.product_id))
                  .toBe(true);
                expect(productRelation.product).toBeDefined();
              });
            });

            // Verify total relationship count is consistent
            const totalRelationships = allSpaces.reduce(
              (sum, space) => sum + space.products.length,
              0,
            );
            expect(totalRelationships).toBe(spaces.length * products.length);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});