import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ConfigModule } from '@nestjs/config';
import * as fc from 'fast-check';
import {
  TechnicalData,
  MarketingContent,
  DigitalAssets,
  RelationalData,
  AISemanticLayer,
} from '../types';

describe('Feature: optimized-pim-schema, JSONB Flexibility Properties', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Set DATABASE_URL for SQLite testing
    process.env.DATABASE_URL = 'file:./test.db';

    // Create a direct Prisma client for SQLite testing with adapter
    const adapter = new PrismaBetterSqlite3({ url: 'file:./test.db' });
    prisma = new PrismaClient({
      adapter,
      log: ['error'],
    } as any);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up in reverse order of dependencies for SQLite schema
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

  // Property-based test generators for JSONB structures
  const technicalDataArb = fc.record(
    {
      dimensions: fc.option(
        fc.record({
          width_mm: fc.option(fc.integer({ min: 1, max: 5000 })),
          length_mm: fc.option(fc.integer({ min: 1, max: 5000 })),
          thickness_mm: fc.option(fc.integer({ min: 1, max: 100 })),
          weight_kg: fc.option(
            fc
              .float({ min: Math.fround(0.1), max: Math.fround(1000) })
              .filter((n) => !Number.isNaN(n)),
          ),
        }),
      ),
      material: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
      performance_specs: fc.option(
        fc.record({
          slip_resistance: fc.option(
            fc.string({ minLength: 1, maxLength: 50 }),
          ),
          water_absorption: fc.option(
            fc
              .float({ min: Math.fround(0), max: Math.fround(100) })
              .filter((n) => !Number.isNaN(n)),
          ),
          frost_resistance: fc.option(fc.boolean()),
          fire_rating: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
          wear_rating: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
        }),
      ),
      installation: fc.option(
        fc.record({
          method: fc.option(
            fc.array(fc.string({ minLength: 1, maxLength: 50 })),
          ),
          tools_required: fc.option(
            fc.array(fc.string({ minLength: 1, maxLength: 50 })),
          ),
          difficulty_level: fc.option(
            fc.constantFrom('easy', 'medium', 'hard'),
          ),
        }),
      ),
      certifications: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 100 })),
      ),
      warranty_years: fc.option(fc.integer({ min: 0, max: 50 })),
    },
    { requiredKeys: [] },
  );

  const marketingContentArb = fc.record(
    {
      short_description: fc.option(
        fc.dictionary(
          fc.constantFrom('en', 'vi', 'fr', 'de'),
          fc.string({ minLength: 1, maxLength: 200 }),
        ),
      ),
      long_description: fc.option(
        fc.dictionary(
          fc.constantFrom('en', 'vi', 'fr', 'de'),
          fc.string({ minLength: 1, maxLength: 1000 }),
        ),
      ),
      target_spaces: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      design_styles: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      key_features: fc.option(
        fc.dictionary(
          fc.constantFrom('en', 'vi', 'fr', 'de'),
          fc.array(fc.string({ minLength: 1, maxLength: 100 })),
        ),
      ),
      care_instructions: fc.option(
        fc.dictionary(
          fc.constantFrom('en', 'vi', 'fr', 'de'),
          fc.string({ minLength: 1, maxLength: 500 }),
        ),
      ),
      seo_keywords: fc.option(
        fc.dictionary(
          fc.constantFrom('en', 'vi', 'fr', 'de'),
          fc.array(fc.string({ minLength: 1, maxLength: 50 })),
        ),
      ),
    },
    { requiredKeys: [] },
  );

  const digitalAssetsArb = fc.record(
    {
      cover_image: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
      lifestyle_images: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 200 })),
      ),
      technical_drawings: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 200 })),
      ),
      architect_files: fc.option(
        fc.record({
          seamless_texture_map: fc.option(
            fc.string({ minLength: 1, maxLength: 200 }),
          ),
          normal_map: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
          displacement_map: fc.option(
            fc.string({ minLength: 1, maxLength: 200 }),
          ),
          cad_files: fc.option(
            fc.array(fc.string({ minLength: 1, maxLength: 200 })),
          ),
        }),
      ),
      videos: fc.option(
        fc.record({
          installation_guide: fc.option(
            fc.string({ minLength: 1, maxLength: 200 }),
          ),
          product_showcase: fc.option(
            fc.string({ minLength: 1, maxLength: 200 }),
          ),
        }),
      ),
      documents: fc.option(
        fc.record({
          technical_sheet: fc.option(
            fc.string({ minLength: 1, maxLength: 200 }),
          ),
          installation_guide: fc.option(
            fc.string({ minLength: 1, maxLength: 200 }),
          ),
          care_guide: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
        }),
      ),
    },
    { requiredKeys: [] },
  );

  const relationalDataArb = fc.record(
    {
      matching_grouts: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      similar_alternatives: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      complementary_products: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      required_accessories: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      color_variants: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      size_variants: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
    },
    { requiredKeys: [] },
  );

  const aiSemanticLayerArb = fc.record(
    {
      semantic_text: fc.option(
        fc.dictionary(
          fc.constantFrom('en', 'vi', 'fr', 'de'),
          fc.string({ minLength: 1, maxLength: 500 }),
        ),
      ),
      embedding_vector_id: fc.option(
        fc.string({ minLength: 1, maxLength: 100 }),
      ),
      auto_generated_tags: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      ),
      similarity_score: fc.option(
        fc
          .float({ min: Math.fround(0), max: Math.fround(1) })
          .filter((n) => !Number.isNaN(n)),
      ),
      content_quality_score: fc.option(
        fc
          .float({ min: Math.fround(0), max: Math.fround(1) })
          .filter((n) => !Number.isNaN(n)),
      ),
      last_ai_update: fc.option(fc.date().map((d) => d.toISOString())),
    },
    { requiredKeys: [] },
  );

  describe('Property 2: JSONB Flexibility and Multi-language Support', () => {
    it('should store and retrieve technical data JSON structures correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.option(fc.string({ maxLength: 500 })),
            is_published: fc.boolean(),
          }),
          technicalDataArb,
          async (productData, technicalData) => {
            // Create a category first (required for product)
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug:
                  'test-category-' + Math.random().toString(36).substring(7),
              },
            });

            // Create product with JSON technical data stored as string
            const product = await prisma.product.create({
              data: {
                ...productData,
                sku:
                  productData.sku +
                  '-' +
                  Math.random().toString(36).substring(7),
                category_id: category.id,
                technical_specs: JSON.stringify(technicalData),
              },
            });

            // Retrieve and verify the data
            const retrievedProduct = await prisma.product.findUnique({
              where: { id: product.id },
            });

            expect(retrievedProduct).toBeDefined();
            expect(retrievedProduct.technical_specs).toBeDefined();

            // Parse the JSON and verify structure matches
            const parsedTechnicalData = JSON.parse(
              retrievedProduct.technical_specs,
            );
            expect(parsedTechnicalData).toEqual(technicalData);

            // Verify specific properties if they exist
            if (technicalData.dimensions) {
              expect(parsedTechnicalData.dimensions).toEqual(
                technicalData.dimensions,
              );
            }
            if (technicalData.material) {
              expect(parsedTechnicalData.material).toBe(technicalData.material);
            }
            if (technicalData.performance_specs) {
              expect(parsedTechnicalData.performance_specs).toEqual(
                technicalData.performance_specs,
              );
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should support multi-language marketing content structures', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            technical_specs: fc.string(),
            is_published: fc.boolean(),
          }),
          marketingContentArb,
          async (productData, marketingContent) => {
            // Create a category first (required for product)
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug:
                  'test-category-' + Math.random().toString(36).substring(7),
              },
            });

            // Store marketing content in description field as JSON string
            const product = await prisma.product.create({
              data: {
                ...productData,
                sku:
                  productData.sku +
                  '-' +
                  Math.random().toString(36).substring(7),
                category_id: category.id,
                description: JSON.stringify(marketingContent),
              },
            });

            // Retrieve and verify the data
            const retrievedProduct = await prisma.product.findUnique({
              where: { id: product.id },
            });

            expect(retrievedProduct).toBeDefined();
            expect(retrievedProduct.description).toBeDefined();

            // Parse the JSON and verify structure matches
            const parsedMarketingContent = JSON.parse(
              retrievedProduct.description,
            );
            expect(parsedMarketingContent).toEqual(marketingContent);

            // Verify multi-language support
            if (marketingContent.short_description) {
              expect(parsedMarketingContent.short_description).toEqual(
                marketingContent.short_description,
              );

              // Verify each language is preserved
              Object.keys(marketingContent.short_description).forEach(
                (lang) => {
                  expect(parsedMarketingContent.short_description[lang]).toBe(
                    marketingContent.short_description[lang],
                  );
                },
              );
            }

            if (marketingContent.key_features) {
              expect(parsedMarketingContent.key_features).toEqual(
                marketingContent.key_features,
              );

              // Verify multi-language arrays are preserved
              Object.keys(marketingContent.key_features).forEach((lang) => {
                expect(parsedMarketingContent.key_features[lang]).toEqual(
                  marketingContent.key_features[lang],
                );
              });
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should store and retrieve all flexible data structures correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            is_published: fc.boolean(),
          }),
          technicalDataArb,
          marketingContentArb,
          digitalAssetsArb,
          relationalDataArb,
          aiSemanticLayerArb,
          async (
            productData,
            technicalData,
            marketingContent,
            digitalAssets,
            relationalData,
            aiSemanticLayer,
          ) => {
            // Create a category first (required for product)
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug:
                  'test-category-' + Math.random().toString(36).substring(7),
              },
            });

            // Combine all flexible data structures into a single JSON
            const combinedFlexibleData = {
              technical_data: technicalData,
              marketing_content: marketingContent,
              digital_assets: digitalAssets,
              relational_data: relationalData,
              ai_semantic_layer: aiSemanticLayer,
            };

            // Create product with all flexible data types stored as JSON string
            const product = await prisma.product.create({
              data: {
                ...productData,
                sku:
                  productData.sku +
                  '-' +
                  Math.random().toString(36).substring(7),
                category_id: category.id,
                technical_specs: JSON.stringify(combinedFlexibleData),
              },
            });

            // Retrieve and verify all flexible data
            const retrievedProduct = await prisma.product.findUnique({
              where: { id: product.id },
            });

            expect(retrievedProduct).toBeDefined();
            expect(retrievedProduct.technical_specs).toBeDefined();

            const parsedFlexibleData = JSON.parse(
              retrievedProduct.technical_specs,
            );
            expect(parsedFlexibleData).toEqual(combinedFlexibleData);
            expect(parsedFlexibleData.technical_data).toEqual(technicalData);
            expect(parsedFlexibleData.marketing_content).toEqual(
              marketingContent,
            );
            expect(parsedFlexibleData.digital_assets).toEqual(digitalAssets);
            expect(parsedFlexibleData.relational_data).toEqual(relationalData);
            expect(parsedFlexibleData.ai_semantic_layer).toEqual(
              aiSemanticLayer,
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should handle empty and partial JSON structures gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            is_published: fc.boolean(),
          }),
          fc.oneof(
            fc.constant({}), // Empty object
            fc.constant(null), // Null value
            fc.record({ material: fc.string({ minLength: 1, maxLength: 50 }) }), // Partial technical data
            fc.record({
              short_description: fc.dictionary(
                fc.constantFrom('en', 'vi'),
                fc.string({ minLength: 1, maxLength: 100 }),
              ),
            }), // Partial marketing content
          ),
          async (productData, flexibleData) => {
            // Create a category first (required for product)
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug:
                  'test-category-' + Math.random().toString(36).substring(7),
              },
            });

            // Create product with various flexible data states
            const product = await prisma.product.create({
              data: {
                ...productData,
                sku:
                  productData.sku +
                  '-' +
                  Math.random().toString(36).substring(7),
                category_id: category.id,
                technical_specs: flexibleData
                  ? JSON.stringify(flexibleData)
                  : '{}',
                description: flexibleData ? JSON.stringify(flexibleData) : null,
              },
            });

            // Retrieve and verify the data
            const retrievedProduct = await prisma.product.findUnique({
              where: { id: product.id },
            });

            expect(retrievedProduct).toBeDefined();

            if (flexibleData === null) {
              expect(retrievedProduct.description).toBeNull();
              expect(JSON.parse(retrievedProduct.technical_specs)).toEqual({});
            } else {
              const parsedTechnicalSpecs = JSON.parse(
                retrievedProduct.technical_specs,
              );
              expect(parsedTechnicalSpecs).toEqual(flexibleData);

              if (retrievedProduct.description) {
                const parsedDescription = JSON.parse(
                  retrievedProduct.description,
                );
                expect(parsedDescription).toEqual(flexibleData);
              }
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should preserve complex nested structures in JSON', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            sku: fc.string({ minLength: 1, maxLength: 50 }),
            is_published: fc.boolean(),
          }),
          fc.record({
            architect_files: fc.record({
              seamless_texture_map: fc.string({ minLength: 1, maxLength: 200 }),
              cad_files: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
            }),
            videos: fc.record({
              installation_guide: fc.string({ minLength: 1, maxLength: 200 }),
              product_showcase: fc.string({ minLength: 1, maxLength: 200 }),
            }),
            multi_language_content: fc.dictionary(
              fc.constantFrom('en', 'vi', 'fr', 'de'),
              fc.record({
                title: fc.string({ minLength: 1, maxLength: 100 }),
                features: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
              }),
            ),
          }),
          async (productData, complexStructure) => {
            // Create a category first (required for product)
            const category = await prisma.category.create({
              data: {
                name: 'Test Category',
                slug:
                  'test-category-' + Math.random().toString(36).substring(7),
              },
            });

            // Create product with complex nested JSON structure
            const product = await prisma.product.create({
              data: {
                ...productData,
                sku:
                  productData.sku +
                  '-' +
                  Math.random().toString(36).substring(7),
                category_id: category.id,
                technical_specs: JSON.stringify(complexStructure),
              },
            });

            // Retrieve and verify complex nested structure
            const retrievedProduct = await prisma.product.findUnique({
              where: { id: product.id },
            });

            expect(retrievedProduct).toBeDefined();
            expect(retrievedProduct.technical_specs).toBeDefined();

            const parsedStructure = JSON.parse(
              retrievedProduct.technical_specs,
            );
            expect(parsedStructure).toEqual(complexStructure);

            // Verify nested structure integrity
            expect(parsedStructure.architect_files.seamless_texture_map).toBe(
              complexStructure.architect_files.seamless_texture_map,
            );
            expect(parsedStructure.architect_files.cad_files).toEqual(
              complexStructure.architect_files.cad_files,
            );
            expect(parsedStructure.videos.installation_guide).toBe(
              complexStructure.videos.installation_guide,
            );
            expect(parsedStructure.videos.product_showcase).toBe(
              complexStructure.videos.product_showcase,
            );

            // Verify multi-language content preservation
            Object.keys(complexStructure.multi_language_content).forEach(
              (lang) => {
                expect(parsedStructure.multi_language_content[lang]).toEqual(
                  complexStructure.multi_language_content[lang],
                );
                expect(parsedStructure.multi_language_content[lang].title).toBe(
                  complexStructure.multi_language_content[lang].title,
                );
                expect(
                  parsedStructure.multi_language_content[lang].features,
                ).toEqual(
                  complexStructure.multi_language_content[lang].features,
                );
              },
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
