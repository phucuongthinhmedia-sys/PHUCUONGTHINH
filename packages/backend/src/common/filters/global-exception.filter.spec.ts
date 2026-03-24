import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ApiErrorResponse } from '../dto/api-response.dto';
import { Prisma } from '@prisma/client';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-cms, Property 32: Standardized error responses', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/api/v1/test',
      method: 'GET',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  it('should handle HTTP exceptions with standardized error format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          status: fc.constantFrom(400, 401, 403, 404, 409, 422, 429, 500),
          message: fc.string({ minLength: 1, maxLength: 100 }),
          code: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async ({ status, message, code }) => {
          const exception = new HttpException({ message, error: code }, status);

          filter.catch(exception, mockHost);

          expect(mockResponse.status).toHaveBeenCalledWith(status);
          expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
              success: false,
              error: expect.objectContaining({
                code: expect.any(String),
                message: expect.any(String),
                timestamp: expect.stringMatching(
                  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
                ),
                path: '/api/v1/test',
              }),
            }),
          );

          const response = mockResponse.json.mock
            .calls[0][0] as ApiErrorResponse;
          expect(response.success).toBe(false);
          expect(response.error.code).toBeDefined();
          expect(response.error.message).toBeDefined();
          expect(response.error.timestamp).toBeDefined();
          expect(response.error.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should handle Prisma unique constraint violations with standardized format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          field: fc
            .string({ minLength: 1, maxLength: 20 })
            .filter((s) => s.trim().length > 0),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async ({ field, value }) => {
          const prismaError = new Prisma.PrismaClientKnownRequestError(
            `Unique constraint failed on the fields: (${field})`,
            {
              code: 'P2002',
              clientVersion: '5.0.0',
              meta: { target: [field] },
            },
          );

          filter.catch(prismaError, mockHost);

          expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.BAD_REQUEST,
          );

          const response = mockResponse.json.mock
            .calls[0][0] as ApiErrorResponse;
          expect(response.success).toBe(false);
          expect(response.error.code).toBe('DUPLICATE_VALUE');
          expect(response.error.message).toContain(field);
          expect(response.error.timestamp).toBeDefined();
          expect(response.error.path).toBe('/api/v1/test');
          expect(response.error.details).toEqual({
            field,
            constraint: 'unique',
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should handle Prisma record not found errors with standardized format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .string({ minLength: 1, maxLength: 100 })
          .filter((s) => s.trim().length > 0),
        async (operation) => {
          const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Record to update not found.',
            {
              code: 'P2025',
              clientVersion: '5.0.0',
              meta: { cause: operation },
            },
          );

          filter.catch(prismaError, mockHost);

          expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.BAD_REQUEST,
          );

          const response = mockResponse.json.mock
            .calls[0][0] as ApiErrorResponse;
          expect(response.success).toBe(false);
          expect(response.error.code).toBe('RESOURCE_NOT_FOUND');
          expect(response.error.message).toBe(
            'The requested resource was not found',
          );
          expect(response.error.timestamp).toBeDefined();
          expect(response.error.path).toBe('/api/v1/test');
          expect(response.error.details).toEqual({
            operation,
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should handle generic errors with standardized format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (errorMessage) => {
          const genericError = new Error(errorMessage);

          filter.catch(genericError, mockHost);

          expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

          const response = mockResponse.json.mock
            .calls[0][0] as ApiErrorResponse;
          expect(response.success).toBe(false);
          expect(response.error.code).toBe('INTERNAL_SERVER_ERROR');
          expect(response.error.message).toBe('An unexpected error occurred');
          expect(response.error.timestamp).toBeDefined();
          expect(response.error.path).toBe('/api/v1/test');
        },
      ),
      { numRuns: 100 },
    );
  });
});
