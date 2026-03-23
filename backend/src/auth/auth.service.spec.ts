import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as fc from 'fast-check';
import * as bcrypt from 'bcrypt';

describe('Feature: digital-showroom-cms, Authentication Properties', () => {
  let authService: AuthService;
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
      providers: [
        AuthService,
        PrismaService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
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
    jest.clearAllMocks();
  });

  describe('Property 1: Valid credential authentication', () => {
    it('should generate JWT token with correct user identity for valid credentials', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }),
            role: fc.constantFrom('admin', 'user'),
          }),
          async (userData) => {
            // Create user with hashed password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await prisma.user.create({
              data: {
                email: userData.email,
                password_hash: hashedPassword,
                role: userData.role,
              },
            });

            // Test login with valid credentials
            const result = await authService.login({
              email: userData.email,
              password: userData.password,
            });

            // Verify JWT token was generated
            expect(jwtService.sign).toHaveBeenCalledWith({
              email: user.email,
              sub: user.id,
              role: user.role,
            });

            // Verify response structure
            expect(result).toEqual({
              access_token: 'mock-jwt-token',
              user: {
                id: user.id,
                email: user.email,
                role: user.role,
              },
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 2: Invalid credential rejection', () => {
    it('should reject login attempts with invalid credentials', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            correctPassword: fc.string({ minLength: 6, maxLength: 50 }),
            wrongPassword: fc.string({ minLength: 6, maxLength: 50 }),
            role: fc.constantFrom('admin', 'user'),
          }),
          async (userData) => {
            // Ensure passwords are different
            fc.pre(userData.correctPassword !== userData.wrongPassword);

            // Create user with correct password
            const hashedPassword = await bcrypt.hash(userData.correctPassword, 10);
            await prisma.user.create({
              data: {
                email: userData.email,
                password_hash: hashedPassword,
                role: userData.role,
              },
            });

            // Test login with wrong password should throw UnauthorizedException
            await expect(
              authService.login({
                email: userData.email,
                password: userData.wrongPassword,
              }),
            ).rejects.toThrow('Invalid credentials');

            // Verify JWT token was not generated
            expect(jwtService.sign).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should reject login attempts with non-existent email', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }),
          }),
          async (userData) => {
            // Test login with non-existent email should throw UnauthorizedException
            await expect(
              authService.login({
                email: userData.email,
                password: userData.password,
              }),
            ).rejects.toThrow('Invalid credentials');

            // Verify JWT token was not generated
            expect(jwtService.sign).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 3: JWT authorization enforcement', () => {
    it('should validate user exists for JWT payload', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }),
            role: fc.constantFrom('admin', 'user'),
          }),
          async (userData) => {
            // Create user
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await prisma.user.create({
              data: {
                email: userData.email,
                password_hash: hashedPassword,
                role: userData.role,
              },
            });

            // Test validateUser method (used by JWT strategy)
            const validatedUser = await authService.validateUser(
              userData.email,
              userData.password,
            );

            // Should return user without password_hash
            expect(validatedUser).toEqual({
              id: user.id,
              email: user.email,
              role: user.role,
              created_at: user.created_at,
              updated_at: user.updated_at,
            });
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should return null for invalid user validation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }),
          }),
          async (userData) => {
            // Test validateUser with non-existent user
            const result = await authService.validateUser(
              userData.email,
              userData.password,
            );

            expect(result).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should generate refresh token for authenticated user', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            role: fc.constantFrom('admin', 'user'),
          }),
          async (userPayload) => {
            // Test refresh token generation
            const result = await authService.refreshToken(userPayload);

            // Verify JWT token was generated with correct payload
            expect(jwtService.sign).toHaveBeenCalledWith({
              email: userPayload.email,
              sub: userPayload.id,
              role: userPayload.role,
            });

            expect(result).toEqual({
              access_token: 'mock-jwt-token',
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});