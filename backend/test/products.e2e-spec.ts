import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  CreateProductDto,
  ProductStatus,
  StockStatus,
} from '../src/products/dto/create-product.dto';

/**
 * Integration tests for Products API endpoints
 * Tests complete flow from API to database
 * Validates Golden Record response structure
 * Requirements: 4.1
 */
describe('Products API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let testBrandId: string;
  let testCategoryId: string;
  let testProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    // Setup test data
    await setupTestData();

    // Get auth token for protected endpoints
    authToken = await getAuthToken();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
    await app.close();
  });

  async function setupTestData() {
    // Create test brand
    const brand = await prisma.brand.create({
      data: {
        name: 'Test Brand E2E',
        slug: 'test-brand-e2e',
      },
    });
    testBrandId = brand.id;

    // Create test category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category E2E',
        slug: 'test-category-e2e',
      },
    });
    testCategoryId = category.id;
  }

  async function cleanupTestData() {
    // Delete in correct order due to foreign key constraints
    if (testProductId) {
      await prisma.product.deleteMany({
        where: { id: testProductId },
      });
    }

    await prisma.brand.deleteMany({
      where: { name: 'Test Brand E2E' },
    });

    await prisma.category.deleteMany({
      where: { name: 'Test Category E2E' },
    });
  }

  async function getAuthToken(): Promise<string> {
    // For now, return empty string as auth is optional for some endpoints
    // In a real implementation, this would authenticate and return a JWT
    return '';
  }

  describe('POST /products', () => {
    it('should create a product with new JSONB schema', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product E2E',
        sku: 'TEST-E2E-001',
        brand_id: testBrandId,
        category_id: testCategoryId,
        status: ProductStatus.DRAFT,
        stock_status: StockStatus.OUT_OF_STOCK,
        base_price_vnd: 1000000,
        technical_data: {
          dimensions: {
            width_mm: 600,
            length_mm: 600,
            thickness_mm: 10,
            weight_kg: 15.5,
          },
          material: 'Ceramic',
          performance_specs: {
            slip_resistance: 'R10',
            water_absorption: 0.5,
            frost_resistance: true,
            fire_rating: 'A1',
            wear_rating: 'PEI 4',
          },
          warranty_years: 10,
        },
        marketing_content: {
          short_description: {
            en: 'Premium ceramic tile for modern spaces',
            vi: 'Gạch ceramic cao cấp cho không gian hiện đại',
          },
          target_spaces: ['bathroom', 'kitchen'],
          design_styles: ['modern', 'minimalist'],
          key_features: {
            en: ['Water resistant', 'Easy to clean', 'Durable'],
            vi: ['Chống nước', 'Dễ vệ sinh', 'Bền bỉ'],
          },
        },
        digital_assets: {
          cover_image: 'https://example.com/cover.jpg',
          lifestyle_images: [
            'https://example.com/lifestyle1.jpg',
            'https://example.com/lifestyle2.jpg',
          ],
        },
        relational_data: {
          matching_grouts: ['GROUT-001', 'GROUT-002'],
          similar_alternatives: ['ALT-001'],
        },
        ai_semantic_layer: {
          semantic_text: {
            en: 'Modern ceramic tile with excellent durability',
          },
          auto_generated_tags: ['ceramic', 'modern', 'durable'],
          content_quality_score: 0.85,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);

      // Validate response structure
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.sku).toBe(createProductDto.sku);
      expect(response.body.brand_id).toBe(createProductDto.brand_id);
      expect(response.body.category_id).toBe(createProductDto.category_id);

      // Validate JSONB fields are stored correctly
      expect(response.body.technical_data).toEqual(
        createProductDto.technical_data,
      );
      expect(response.body.marketing_content).toEqual(
        createProductDto.marketing_content,
      );
      expect(response.body.digital_assets).toEqual(
        createProductDto.digital_assets,
      );
      expect(response.body.relational_data).toEqual(
        createProductDto.relational_data,
      );
      expect(response.body.ai_semantic_layer).toEqual(
        createProductDto.ai_semantic_layer,
      );

      testProductId = response.body.id;
    });

    it('should validate JSONB structure and return proper errors', async () => {
      const invalidProductDto = {
        name: 'Invalid Product',
        sku: 'INVALID-001',
        brand_id: testBrandId,
        category_id: testCategoryId,
        technical_data: {
          dimensions: {
            width_mm: 'invalid', // Should be number
          },
        },
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(invalidProductDto)
        .expect(400);
    });
  });

  describe('GET /products/:id', () => {
    it('should return product with all JSONB fields', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${testProductId}`)
        .expect(200);

      // Validate complete product structure
      expect(response.body).toHaveProperty('id', testProductId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('sku');
      expect(response.body).toHaveProperty('technical_data');
      expect(response.body).toHaveProperty('marketing_content');
      expect(response.body).toHaveProperty('digital_assets');
      expect(response.body).toHaveProperty('relational_data');
      expect(response.body).toHaveProperty('ai_semantic_layer');
    });
  });

  describe('GET /products/:id/golden-record', () => {
    it('should return Golden Record structure', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${testProductId}/golden-record`)
        .expect(200);

      // Validate Golden Record structure
      expect(response.body).toHaveProperty('product_id', testProductId);
      expect(response.body).toHaveProperty('sku');
      expect(response.body).toHaveProperty('identification');
      expect(response.body).toHaveProperty('technical_data');
      expect(response.body).toHaveProperty('marketing_content');
      expect(response.body).toHaveProperty('digital_assets');
      expect(response.body).toHaveProperty('relational_data');
      expect(response.body).toHaveProperty('ai_semantic_layer');
      expect(response.body).toHaveProperty('erp_sync_data');

      // Validate identification structure
      const identification = response.body.identification;
      expect(identification).toHaveProperty('name');
      expect(identification).toHaveProperty('brand_id');
      expect(identification).toHaveProperty('category_id');
      expect(identification).toHaveProperty('status');
      expect(identification).toHaveProperty('stock_status');
      expect(identification).toHaveProperty('created_at');
      expect(identification).toHaveProperty('updated_at');
    });
  });

  describe('GET /products/sku/:sku/golden-record', () => {
    it('should return Golden Record structure by SKU', async () => {
      const response = await request(app.getHttpServer())
        .get('/products/sku/TEST-E2E-001/golden-record')
        .expect(200);

      // Validate Golden Record structure
      expect(response.body).toHaveProperty('product_id', testProductId);
      expect(response.body).toHaveProperty('sku', 'TEST-E2E-001');
      expect(response.body).toHaveProperty('identification');
      expect(response.body).toHaveProperty('technical_data');
      expect(response.body).toHaveProperty('marketing_content');
      expect(response.body).toHaveProperty('digital_assets');
      expect(response.body).toHaveProperty('relational_data');
      expect(response.body).toHaveProperty('ai_semantic_layer');
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update product with new JSONB fields', async () => {
      const updateData = {
        name: 'Updated Test Product E2E',
        technical_data: {
          dimensions: {
            width_mm: 800,
            length_mm: 800,
            thickness_mm: 12,
          },
          material: 'Porcelain',
        },
        marketing_content: {
          short_description: {
            en: 'Updated premium porcelain tile',
            vi: 'Gạch porcelain cao cấp đã cập nhật',
          },
        },
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${testProductId}`)
        .send(updateData)
        .expect(200);

      // Validate updated fields
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.technical_data.material).toBe(
        updateData.technical_data.material,
      );
      expect(response.body.technical_data.dimensions.width_mm).toBe(
        updateData.technical_data.dimensions.width_mm,
      );
      expect(response.body.marketing_content.short_description.en).toBe(
        updateData.marketing_content.short_description.en,
      );
    });
  });

  describe('GET /products', () => {
    it('should return products list with filtering capabilities', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({
          page: 1,
          limit: 10,
          published: 'false', // Include draft products
        })
        .expect(200);

      // Validate response structure
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);

      // Should include our test product
      const testProduct = response.body.data.find(
        (p: any) => p.id === testProductId,
      );
      expect(testProduct).toBeDefined();
    });
  });

  describe('Backward Compatibility', () => {
    it('should handle legacy fields for backward compatibility', async () => {
      const legacyProductDto = {
        name: 'Legacy Product E2E',
        sku: 'LEGACY-E2E-001',
        category_id: testCategoryId,
        description: 'Legacy description field',
        technical_specs: {
          size: '600x600',
          material: 'Ceramic',
        },
        style_ids: [],
        space_ids: [],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(legacyProductDto)
        .expect(201);

      // Should create product successfully with legacy fields
      expect(response.body.name).toBe(legacyProductDto.name);
      expect(response.body.sku).toBe(legacyProductDto.sku);
      expect(response.body.description).toBe(legacyProductDto.description);

      // Cleanup
      await prisma.product.delete({ where: { id: response.body.id } });
    });
  });
});
