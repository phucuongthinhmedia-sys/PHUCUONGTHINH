import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as fc from 'fast-check';
import * as bcrypt from 'bcrypt';

describe('Feature: digital-showroom-complete, Property 25: Password Security', () => {
  let authService: AuthService;
  let prisma: PrismaService;

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

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await prisma.user.deleteMany();
  });

  it('Property 25: Password Security - For any user password, it should be hashed using bcrypt and never stored or transmitted in plain text', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 20 }), // Shorter passwords for faster testing
          role: fc.constantFrom('admin', 'user'),
        }),
        async (userData) => {
          // Test 1: Password hashing should use bcrypt with appropriate salt rounds
          const hashedPassword = await authService.hashPassword(
            userData.password,
          );

          // Verify password is hashed (not plain text)
          expect(hashedPassword).not.toBe(userData.password);
          expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt hash format
          expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars

          // Test 2: Same password should produce different hashes (salt randomization)
          const hashedPassword2 = await authService.hashPassword(
            userData.password,
          );
          expect(hashedPassword2).not.toBe(hashedPassword);
          expect(hashedPassword2).toMatch(/^\$2[aby]\$\d{2}\$/);

          // Test 3: Both hashes should verify against original password
          const isValid1 = await bcrypt.compare(
            userData.password,
            hashedPassword,
          );
          const isValid2 = await bcrypt.compare(
            userData.password,
            hashedPassword2,
          );
          expect(isValid1).toBe(true);
          expect(isValid2).toBe(true);

          // Test 4: Wrong password should not verify
          const wrongPassword = userData.password + 'x';
          const isWrongValid = await bcrypt.compare(
            wrongPassword,
            hashedPassword,
          );
          expect(isWrongValid).toBe(false);

          // Test 5: Database should never store plain text passwords
          const user = await prisma.user.create({
            data: {
              email: userData.email,
              password_hash: hashedPassword,
              role: userData.role,
            },
          });

          // Verify stored password is hashed, not plain text
          expect(user.password_hash).toBe(hashedPassword);
          expect(user.password_hash).not.toBe(userData.password);
          expect(user.password_hash).toMatch(/^\$2[aby]\$\d{2}\$/);

          // Test 6: validateUser should work with hashed passwords
          const validatedUser = await authService.validateUser(
            userData.email,
            userData.password,
          );
          expect(validatedUser).toBeTruthy();
          expect(validatedUser.id).toBe(user.id);
          expect(validatedUser.email).toBe(user.email);
          expect(validatedUser.password_hash).toBeUndefined(); // Should not return password hash

          // Test 7: validateUser should fail with wrong password
          const invalidUser = await authService.validateUser(
            userData.email,
            wrongPassword,
          );
          expect(invalidUser).toBeNull();
        },
      ),
      { numRuns: 3 },
    );
  }, 20000);

  it('Property 25: Password Security - Salt rounds should be sufficient for security', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 8, maxLength: 20 }),
        async (password) => {
          const hashedPassword = await authService.hashPassword(password);

          // Extract salt rounds from bcrypt hash
          const saltRounds = parseInt(hashedPassword.split('$')[2]);

          // Verify salt rounds are at least 10 (industry standard minimum)
          expect(saltRounds).toBeGreaterThanOrEqual(10);

          // Verify salt rounds are reasonable (not excessive)
          expect(saltRounds).toBeLessThanOrEqual(15);
        },
      ),
      { numRuns: 3 },
    );
  }, 10000);

  it('Property 25: Password Security - Hash should be deterministic for verification but random for generation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 6, maxLength: 20 }),
        async (password) => {
          const hash1 = await authService.hashPassword(password);
          const hash2 = await authService.hashPassword(password);

          // Different hashes for same password (due to random salt)
          expect(hash1).not.toBe(hash2);

          // Both should verify correctly
          expect(await bcrypt.compare(password, hash1)).toBe(true);
          expect(await bcrypt.compare(password, hash2)).toBe(true);

          // Wrong password should not verify against either hash
          const wrongPassword = password + 'x';
          expect(await bcrypt.compare(wrongPassword, hash1)).toBe(false);
          expect(await bcrypt.compare(wrongPassword, hash2)).toBe(false);
        },
      ),
      { numRuns: 3 },
    );
  }, 15000);
});
