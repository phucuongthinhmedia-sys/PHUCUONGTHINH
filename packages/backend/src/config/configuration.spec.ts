import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fc from 'fast-check';
import configuration, { validate, EnvironmentVariables } from './configuration';

describe('Feature: digital-showroom-complete, Configuration Validation Properties', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validate,
          envFilePath: '.env.test',
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  describe('Property 1: Configuration Validation', () => {
    it('Feature: digital-showroom-complete, Property 1: For any valid environment configuration, the system should validate and load all required settings correctly', async () => {
      await fc.assert(
        fc.property(
          fc.record({
            NODE_ENV: fc.constantFrom('development', 'production', 'test'),
            PORT: fc.integer({ min: 1000, max: 65535 }).map(String),
            DATABASE_URL: fc.string({ minLength: 10 }),
            JWT_SECRET: fc.string({ minLength: 32 }),
            JWT_EXPIRES_IN: fc.constantFrom('1h', '24h', '7d', '30d'),
            AWS_REGION: fc.constantFrom('us-east-1', 'us-west-2', 'eu-west-1'),
            FRONTEND_URL: fc.webUrl(),
            CMS_URL: fc.webUrl(),
          }),
          (envConfig) => {
            // Test that valid configuration passes validation
            const validatedConfig = validate(envConfig);

            expect(validatedConfig).toBeInstanceOf(EnvironmentVariables);
            expect(validatedConfig.NODE_ENV).toBe(envConfig.NODE_ENV);
            expect(validatedConfig.PORT).toBe(parseInt(envConfig.PORT, 10));
            expect(validatedConfig.DATABASE_URL).toBe(envConfig.DATABASE_URL);
            expect(validatedConfig.JWT_SECRET).toBe(envConfig.JWT_SECRET);
            expect(validatedConfig.JWT_EXPIRES_IN).toBe(
              envConfig.JWT_EXPIRES_IN,
            );
            expect(validatedConfig.AWS_REGION).toBe(envConfig.AWS_REGION);
            expect(validatedConfig.FRONTEND_URL).toBe(envConfig.FRONTEND_URL);
            expect(validatedConfig.CMS_URL).toBe(envConfig.CMS_URL);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('Feature: digital-showroom-complete, Property 1: For any invalid environment configuration, the system should reject the configuration with appropriate error messages', async () => {
      await fc.assert(
        fc.property(
          fc.record({
            NODE_ENV: fc.option(fc.string()),
            PORT: fc.option(
              fc.oneof(
                fc.string().filter((s) => isNaN(parseInt(s, 10))), // Non-numeric strings
                fc.integer({ min: -1000, max: 0 }).map(String), // Invalid port numbers
              ),
            ),
            DATABASE_URL: fc.option(fc.constantFrom('', '   ', 'invalid')), // Invalid or empty URLs
            JWT_SECRET: fc.option(fc.constantFrom('', 'short')), // Too short or empty secrets
            JWT_EXPIRES_IN: fc.option(
              fc
                .string()
                .filter((s) => !['1h', '24h', '7d', '30d'].includes(s)),
            ),
          }),
          (invalidConfig) => {
            // Remove undefined values to test missing required fields
            const cleanConfig = Object.fromEntries(
              Object.entries(invalidConfig).filter(
                ([_, value]) => value !== undefined,
              ),
            );

            // Test that invalid configuration fails validation
            expect(() => validate(cleanConfig)).toThrow();
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should load configuration correctly through ConfigService', () => {
      // Test that the actual configuration service loads values correctly
      expect(configService.get('app.nodeEnv')).toBeDefined();
      expect(configService.get('app.port')).toBeGreaterThan(0);
      expect(configService.get('app.database.url')).toBeDefined();
      expect(configService.get('app.jwt.secret')).toBeDefined();
      expect(configService.get('app.jwt.expiresIn')).toBeDefined();
      expect(configService.get('app.aws.region')).toBeDefined();
    });

    it('should provide default values for optional configuration', () => {
      // Test that default values are provided for optional settings
      expect(configService.get('app.nodeEnv')).toBe('test'); // From .env.test
      expect(configService.get('app.port')).toBe(3001);
      expect(configService.get('app.aws.region')).toBe('us-east-1');
      expect(configService.get('app.jwt.expiresIn')).toBe('1h'); // From .env.test
    });

    it('should validate required environment variables are present', () => {
      // Test that all required configuration keys are accessible
      const requiredKeys = [
        'app.nodeEnv',
        'app.port',
        'app.database.url',
        'app.jwt.secret',
        'app.jwt.expiresIn',
        'app.aws.region',
      ];

      requiredKeys.forEach((key) => {
        const value = configService.get(key);
        expect(value).toBeDefined();
        expect(value).not.toBe('');
      });
    });
  });
});

/**
 * Validates: Requirements 8.8
 *
 * This property test validates that:
 * 1. Valid environment configurations are accepted and processed correctly
 * 2. Invalid configurations are rejected with appropriate errors
 * 3. Required environment variables are validated
 * 4. Default values are provided for optional settings
 * 5. Configuration service loads and provides access to all settings
 */
