import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import {
  RateLimiterService,
  RateLimitConfig,
} from '../common/services/rate-limiter.service';
import * as fc from 'fast-check';

describe('Feature: digital-showroom-complete, Property 28: Rate Limiting Enforcement', () => {
  let rateLimiterService: RateLimiterService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [RateLimiterService],
    }).compile();

    rateLimiterService = module.get<RateLimiterService>(RateLimiterService);
  });

  beforeEach(() => {
    // Reset rate limiter state before each test
    rateLimiterService.reset('test-key');
  });

  it('Property 28: Rate Limiting Enforcement - For any authentication endpoint, excessive requests from the same source should be rate-limited with appropriate error responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          clientKey: fc.string({ minLength: 1, maxLength: 50 }),
          maxRequests: fc.integer({ min: 1, max: 10 }),
          windowMs: fc.integer({ min: 1000, max: 10000 }),
        }),
        async (testData) => {
          const config: RateLimitConfig = {
            maxRequests: testData.maxRequests,
            windowMs: testData.windowMs,
          };

          // Test 1: Requests within limit should be allowed
          for (let i = 0; i < testData.maxRequests; i++) {
            const isAllowed = rateLimiterService.isAllowed(
              testData.clientKey,
              config,
            );
            expect(isAllowed).toBe(true);

            // Verify remaining count decreases
            const remaining = rateLimiterService.getRemaining(
              testData.clientKey,
              config,
            );
            expect(remaining).toBe(testData.maxRequests - i - 1);
          }

          // Test 2: Request exceeding limit should be denied
          const isExceeded = rateLimiterService.isAllowed(
            testData.clientKey,
            config,
          );
          expect(isExceeded).toBe(false);

          // Test 3: Remaining should be 0 when limit exceeded
          const remainingAfterLimit = rateLimiterService.getRemaining(
            testData.clientKey,
            config,
          );
          expect(remainingAfterLimit).toBe(0);

          // Test 4: Reset time should be set when limit is reached
          const resetTime = rateLimiterService.getResetTime(testData.clientKey);
          expect(resetTime).toBeTruthy();
          expect(resetTime).toBeGreaterThan(Date.now());
          expect(resetTime).toBeLessThanOrEqual(Date.now() + testData.windowMs);
        },
      ),
      { numRuns: 3 },
    );
  });

  it('Property 28: Rate Limiting Enforcement - Rate limits should reset after time window expires', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          clientKey: fc.string({ minLength: 1, maxLength: 50 }),
          maxRequests: fc.integer({ min: 2, max: 5 }),
        }),
        async (testData) => {
          const config: RateLimitConfig = {
            maxRequests: testData.maxRequests,
            windowMs: 100, // Very short window for testing
          };

          // Exhaust the rate limit
          for (let i = 0; i < testData.maxRequests; i++) {
            rateLimiterService.isAllowed(testData.clientKey, config);
          }

          // Verify limit is exceeded
          expect(rateLimiterService.isAllowed(testData.clientKey, config)).toBe(
            false,
          );

          // Wait for window to expire
          await new Promise((resolve) => setTimeout(resolve, 150));

          // Test: After window expires, requests should be allowed again
          const isAllowedAfterReset = rateLimiterService.isAllowed(
            testData.clientKey,
            config,
          );
          expect(isAllowedAfterReset).toBe(true);

          // Verify remaining count is reset
          const remainingAfterReset = rateLimiterService.getRemaining(
            testData.clientKey,
            config,
          );
          expect(remainingAfterReset).toBe(testData.maxRequests - 1);
        },
      ),
      { numRuns: 2 },
    );
  }, 10000);

  it('Property 28: Rate Limiting Enforcement - Different client keys should have independent rate limits', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          clientKey1: fc.string({ minLength: 1, maxLength: 50 }),
          clientKey2: fc.string({ minLength: 1, maxLength: 50 }),
          maxRequests: fc.integer({ min: 2, max: 5 }),
          windowMs: fc.integer({ min: 1000, max: 5000 }),
        }),
        async (testData) => {
          // Ensure keys are different
          fc.pre(testData.clientKey1 !== testData.clientKey2);

          const config: RateLimitConfig = {
            maxRequests: testData.maxRequests,
            windowMs: testData.windowMs,
          };

          // Exhaust rate limit for first client
          for (let i = 0; i < testData.maxRequests; i++) {
            rateLimiterService.isAllowed(testData.clientKey1, config);
          }

          // Verify first client is rate limited
          expect(
            rateLimiterService.isAllowed(testData.clientKey1, config),
          ).toBe(false);

          // Test: Second client should still be allowed (independent limits)
          expect(
            rateLimiterService.isAllowed(testData.clientKey2, config),
          ).toBe(true);

          // Verify second client has full remaining count
          const remainingClient2 = rateLimiterService.getRemaining(
            testData.clientKey2,
            config,
          );
          expect(remainingClient2).toBe(testData.maxRequests - 1);

          // Verify first client still has 0 remaining
          const remainingClient1 = rateLimiterService.getRemaining(
            testData.clientKey1,
            config,
          );
          expect(remainingClient1).toBe(0);
        },
      ),
      { numRuns: 3 },
    );
  });

  it('Property 28: Rate Limiting Enforcement - Rate limiter statistics should be accurate', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
          minLength: 1,
          maxLength: 5,
        }),
        fc.integer({ min: 1, max: 3 }),
        async (clientKeys, maxRequests) => {
          const config: RateLimitConfig = {
            maxRequests,
            windowMs: 5000,
          };

          // Make requests for each client
          const uniqueKeys = [...new Set(clientKeys)]; // Remove duplicates
          for (const key of uniqueKeys) {
            rateLimiterService.isAllowed(key, config);
          }

          // Test: Statistics should reflect active keys
          const stats = rateLimiterService.getStats();
          expect(stats.totalKeys).toBeGreaterThanOrEqual(uniqueKeys.length);
          expect(stats.keys.length).toBeGreaterThanOrEqual(uniqueKeys.length);

          // Verify each tracked key has expected structure
          for (const keyStats of stats.keys) {
            expect(keyStats).toHaveProperty('key');
            expect(keyStats).toHaveProperty('count');
            expect(keyStats).toHaveProperty('resetTime');
            expect(typeof keyStats.key).toBe('string');
            expect(typeof keyStats.count).toBe('number');
            expect(typeof keyStats.resetTime).toBe('number');
            expect(keyStats.count).toBeGreaterThanOrEqual(0);
            expect(keyStats.count).toBeLessThanOrEqual(maxRequests);
          }
        },
      ),
      { numRuns: 3 },
    );
  });

  it('Property 28: Rate Limiting Enforcement - Manual reset should restore full capacity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          clientKey: fc.string({ minLength: 1, maxLength: 50 }),
          maxRequests: fc.integer({ min: 2, max: 5 }),
          windowMs: fc.integer({ min: 1000, max: 5000 }),
        }),
        async (testData) => {
          const config: RateLimitConfig = {
            maxRequests: testData.maxRequests,
            windowMs: testData.windowMs,
          };

          // Partially exhaust the rate limit
          const requestsToMake = Math.floor(testData.maxRequests / 2);
          for (let i = 0; i < requestsToMake; i++) {
            rateLimiterService.isAllowed(testData.clientKey, config);
          }

          // Verify some capacity is used
          const remainingBefore = rateLimiterService.getRemaining(
            testData.clientKey,
            config,
          );
          expect(remainingBefore).toBe(testData.maxRequests - requestsToMake);

          // Test: Manual reset should restore full capacity
          rateLimiterService.reset(testData.clientKey);

          const remainingAfterReset = rateLimiterService.getRemaining(
            testData.clientKey,
            config,
          );
          expect(remainingAfterReset).toBe(testData.maxRequests);

          // Verify reset time is cleared
          const resetTime = rateLimiterService.getResetTime(testData.clientKey);
          expect(resetTime).toBeNull();
        },
      ),
      { numRuns: 3 },
    );
  });
});
