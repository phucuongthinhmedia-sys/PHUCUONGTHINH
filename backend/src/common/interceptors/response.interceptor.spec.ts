import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
import { ApiSuccessResponse, PaginatedResponse } from '../dto/api-response.dto';
import { of } from 'rxjs';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Property 33: Standardized success responses', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          url: '/api/v1/test',
          method: 'GET',
        }),
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should transform simple data into standardized success response', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          value: fc.integer({ min: 0, max: 1000 }),
        }),
        async (data) => {
          mockCallHandler.handle = jest.fn().mockReturnValue(of(data));

          const result = await interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .toPromise();

          const response = result as ApiSuccessResponse<typeof data>;
          expect(response.success).toBe(true);
          expect(response.data).toEqual(data);
          expect(response.timestamp).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          );
          expect(response.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should transform paginated data into standardized paginated response', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          data: fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 30 }),
            }),
            { minLength: 0, maxLength: 20 },
          ),
          pagination: fc.record({
            page: fc.integer({ min: 1, max: 100 }),
            limit: fc.integer({ min: 1, max: 100 }),
            total: fc.integer({ min: 0, max: 1000 }),
            total_pages: fc.integer({ min: 0, max: 100 }),
          }),
          message: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
        }),
        async ({ data, pagination, message }) => {
          const responseData = { data, pagination, message };
          mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

          const result = await interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .toPromise();

          const response = result as PaginatedResponse<(typeof data)[0]>;
          expect(response.success).toBe(true);
          expect(response.data).toEqual(data);
          expect(response.pagination).toEqual(pagination);
          expect(response.message).toBe(message);
          expect(response.timestamp).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          );
          expect(response.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should handle products array response format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          products: fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 30 }),
              sku: fc.string({ minLength: 1, maxLength: 20 }),
            }),
            { minLength: 0, maxLength: 15 },
          ),
          pagination: fc.record({
            page: fc.integer({ min: 1, max: 50 }),
            limit: fc.integer({ min: 1, max: 50 }),
            total: fc.integer({ min: 0, max: 500 }),
            total_pages: fc.integer({ min: 0, max: 50 }),
          }),
        }),
        async ({ products, pagination }) => {
          const responseData = { products, pagination };
          mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

          const result = await interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .toPromise();

          const response = result as PaginatedResponse<(typeof products)[0]>;
          expect(response.success).toBe(true);
          expect(response.data).toEqual(products);
          expect(response.pagination).toEqual(pagination);
          expect(response.timestamp).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          );
          expect(response.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should handle items array response format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          items: fc.array(
            fc.record({
              id: fc.uuid(),
              title: fc.string({ minLength: 1, maxLength: 40 }),
            }),
            { minLength: 0, maxLength: 10 },
          ),
          pagination: fc.record({
            page: fc.integer({ min: 1, max: 20 }),
            limit: fc.integer({ min: 1, max: 20 }),
            total: fc.integer({ min: 0, max: 200 }),
            total_pages: fc.integer({ min: 0, max: 20 }),
          }),
        }),
        async ({ items, pagination }) => {
          const responseData = { items, pagination };
          mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

          const result = await interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .toPromise();

          const response = result as PaginatedResponse<(typeof items)[0]>;
          expect(response.success).toBe(true);
          expect(response.data).toEqual(items);
          expect(response.pagination).toEqual(pagination);
          expect(response.timestamp).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          );
          expect(response.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should preserve message field in responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 30 }),
          message: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        async (data) => {
          mockCallHandler.handle = jest.fn().mockReturnValue(of(data));

          const result = await interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .toPromise();

          const response = result as ApiSuccessResponse<typeof data>;
          expect(response.success).toBe(true);
          expect(response.data).toEqual(data);
          expect(response.message).toBe(data.message);
          expect(response.timestamp).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          );
          expect(response.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });
});
