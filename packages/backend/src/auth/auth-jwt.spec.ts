import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as fc from 'fast-check';
import * as bcrypt from 'bcrypt';

describe('Feature: digital-showroom-complete, Property 2: JWT Authentication Consistency', () => {
  let authService: AuthService;
  let authController: AuthController;
  let jwtStrategy: JwtStrategy;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtStrategy,
        {
          provide: JwtService,
          useFactory: (configService: ConfigService) => {
            return new JwtService({
              secret:
                configService.get<string>('JWT_SECRET') || 'test-secret-key',
              signOptions: { expiresIn: '24h' },
            });
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await prisma.user.deleteMany();
  });

  it('Property 2: JWT Authentication Consistency - For any protected API endpoint, when provided with a valid JWT token, the request should succeed, and when provided with an invalid or expired token, the request should fail with a 401 status code', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          role: fc.constantFrom('admin', 'user'),
        }),
        async (userData) => {
          // Create user with hashed password
          const hashedPassword = await authService.hashPassword(
            userData.password,
          );
          const user = await prisma.user.create({
            data: {
              email: userData.email,
              password_hash: hashedPassword,
              role: userData.role,
            },
          });

          // Test 1: Valid JWT token should succeed
          const loginResult = await authService.login({
            email: userData.email,
            password: userData.password,
          });

          // Verify JWT token structure and content
          expect(loginResult.accessToken).toBeDefined();
          expect(loginResult.refreshToken).toBeDefined();
          expect(loginResult.expiresIn).toBe(24 * 60 * 60);
          expect(loginResult.user).toEqual({
            id: user.id,
            email: user.email,
            role: user.role,
          });

          // Test 2: Valid token should validate correctly
          const decodedPayload = jwtService.verify(loginResult.accessToken);
          expect(decodedPayload.email).toBe(user.email);
          expect(decodedPayload.sub).toBe(user.id);
          expect(decodedPayload.role).toBe(user.role);

          // Test 3: JWT Strategy should validate user correctly
          const validatedUser = await jwtStrategy.validate(decodedPayload);
          expect(validatedUser).toEqual({
            id: user.id,
            email: user.email,
            role: user.role,
          });

          // Test 4: Token validation service should work
          const tokenValidation = await authService.validateToken(
            loginResult.accessToken,
          );
          expect(tokenValidation).toEqual({
            id: user.id,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
          });

          // Test 5: Refresh token should generate new valid tokens
          const refreshResult = await authService.refreshToken(validatedUser);
          expect(refreshResult.accessToken).toBeDefined();
          expect(refreshResult.refreshToken).toBeDefined();
          expect(refreshResult.expiresIn).toBe(24 * 60 * 60);

          // Verify new token is valid
          const newDecodedPayload = jwtService.verify(
            refreshResult.accessToken,
          );
          expect(newDecodedPayload.email).toBe(user.email);
          expect(newDecodedPayload.sub).toBe(user.id);
          expect(newDecodedPayload.role).toBe(user.role);
        },
      ),
      { numRuns: 5 },
    );
  });

  it('Property 2: JWT Authentication Consistency - Invalid tokens should fail validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          role: fc.constantFrom('admin', 'user'),
        }),
        async (userData) => {
          // Create user
          const hashedPassword = await authService.hashPassword(
            userData.password,
          );
          const user = await prisma.user.create({
            data: {
              email: userData.email,
              password_hash: hashedPassword,
              role: userData.role,
            },
          });

          // Test 1: Invalid token should fail validation
          const invalidToken = 'invalid.jwt.token';
          await expect(authService.validateToken(invalidToken)).rejects.toThrow(
            'Invalid token',
          );

          // Test 2: JWT Strategy should return null for non-existent user
          const fakePayload = {
            sub: 'non-existent-id',
            email: 'fake@example.com',
            role: 'user',
          };
          const validatedUser = await jwtStrategy.validate(fakePayload);
          expect(validatedUser).toBeNull();

          // Test 3: Malformed token should fail
          const malformedToken = 'not-a-jwt-token';
          await expect(
            authService.validateToken(malformedToken),
          ).rejects.toThrow('Invalid token');

          // Test 4: Empty token should fail
          await expect(authService.validateToken('')).rejects.toThrow(
            'Invalid token',
          );
        },
      ),
      { numRuns: 5 },
    );
  });
});
