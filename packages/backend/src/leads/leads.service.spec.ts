import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as fc from 'fast-check';
import { PrismaService } from '../prisma/prisma.service';
import { LeadsService } from './leads.service';

// Set environment variable for test database
process.env.DATABASE_URL = 'file:./test.db';

describe('Feature: digital-showroom-cms, Lead Management Properties', () => {
  let leadsService: LeadsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [PrismaService, LeadsService],
    }).compile();

    leadsService = module.get<LeadsService>(LeadsService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  beforeEach(async () => {
    // Clean up data before each test in reverse dependency order
    await prisma.leadProduct.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  describe('Property 13: Complete lead data capture', () => {
    it('should accurately store all provided form fields for appointment bookings', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 1, maxLength: 20 }),
            inquiry_type: fc.constant('appointment'),
            project_details: fc.option(fc.string({ maxLength: 1000 })),
            preferred_date: fc.option(fc.date({ min: new Date() })),
          }),
          async (leadData) => {
            const createData = {
              ...leadData,
              preferred_date: leadData.preferred_date?.toISOString(),
            };

            const createdLead = await leadsService.create(createData);

            // Verify all provided fields are stored correctly
            expect(createdLead.name).toBe(leadData.name);
            expect(createdLead.email).toBe(leadData.email);
            expect(createdLead.phone).toBe(leadData.phone);
            expect(createdLead.inquiry_type).toBe(leadData.inquiry_type);
            expect(createdLead.project_details).toBe(
              leadData.project_details || null,
            );

            if (leadData.preferred_date) {
              expect(new Date(createdLead.preferred_date)).toEqual(
                leadData.preferred_date,
              );
            } else {
              expect(createdLead.preferred_date).toBeNull();
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should accurately store all provided form fields for quote requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 1, maxLength: 20 }),
            inquiry_type: fc.constant('quote'),
            project_details: fc.option(fc.string({ maxLength: 1000 })),
          }),
          async (leadData) => {
            const createdLead = await leadsService.create(leadData);

            // Verify all provided fields are stored correctly
            expect(createdLead.name).toBe(leadData.name);
            expect(createdLead.email).toBe(leadData.email);
            expect(createdLead.phone).toBe(leadData.phone);
            expect(createdLead.inquiry_type).toBe(leadData.inquiry_type);
            expect(createdLead.project_details).toBe(
              leadData.project_details || null,
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 14: Default lead status assignment', () => {
    it('should assign initial status of "new" to all newly created leads', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            inquiry_type: fc.constantFrom('appointment', 'quote'),
            project_details: fc.option(fc.string({ maxLength: 1000 })),
          }),
          async (leadData) => {
            const createdLead = await leadsService.create(leadData);

            // Verify default status is "new"
            expect(createdLead.status).toBe('new');
          },
        ),
        { numRuns: 100 },
      );
    });
  });
  describe('Property 16: Lead contact validation', () => {
    it('should require at least one contact method (email or phone)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            inquiry_type: fc.constantFrom('appointment', 'quote'),
            project_details: fc.option(fc.string({ maxLength: 1000 })),
          }),
          async (leadData) => {
            // Test with no contact methods
            await expect(
              leadsService.create({
                ...leadData,
                // No email or phone provided
              }),
            ).rejects.toThrow(BadRequestException);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should accept leads with only email provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            inquiry_type: fc.constantFrom('appointment', 'quote'),
          }),
          async (leadData) => {
            const createdLead = await leadsService.create(leadData);

            expect(createdLead.email).toBe(leadData.email);
            expect(createdLead.phone).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should accept leads with only phone provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            phone: fc.string({ minLength: 1, maxLength: 20 }),
            inquiry_type: fc.constantFrom('appointment', 'quote'),
          }),
          async (leadData) => {
            const createdLead = await leadsService.create(leadData);

            expect(createdLead.phone).toBe(leadData.phone);
            expect(createdLead.email).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should accept leads with both email and phone provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 1, maxLength: 20 }),
            inquiry_type: fc.constantFrom('appointment', 'quote'),
          }),
          async (leadData) => {
            const createdLead = await leadsService.create(leadData);

            expect(createdLead.email).toBe(leadData.email);
            expect(createdLead.phone).toBe(leadData.phone);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
describe('Property 15: Lead status filtering', () => {
  it('should return only leads matching the specified status filter', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            inquiry_type: fc.constantFrom('appointment', 'quote'),
            status: fc.constantFrom('new', 'contacted', 'converted'),
          }),
          { minLength: 3, maxLength: 10 },
        ),
        fc.constantFrom('new', 'contacted', 'converted'),
        async (leadsData, filterStatus) => {
          // Create leads with different statuses
          const createdLeads = [];
          for (const leadData of leadsData) {
            const lead = await leadsService.create({
              name: leadData.name,
              email: leadData.email,
              inquiry_type: leadData.inquiry_type,
            });

            // Update status if different from default 'new'
            if (leadData.status !== 'new') {
              await leadsService.updateStatus(lead.id, leadData.status);
            }

            createdLeads.push({ ...lead, status: leadData.status });
          }

          // Filter leads by status
          const filteredLeads = await leadsService.findByStatus(filterStatus);

          // Verify all returned leads have the correct status
          expect(
            filteredLeads.every((lead) => lead.status === filterStatus),
          ).toBe(true);

          // Verify count matches expected
          const expectedCount = leadsData.filter(
            (lead) => lead.status === filterStatus,
          ).length;
          expect(filteredLeads).toHaveLength(expectedCount);
        },
      ),
      { numRuns: 50 }, // Reduced runs due to multiple database operations
    );
  });

  it('should support pagination when filtering leads by status', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 5, max: 15 }),
        fc.constantFrom('new', 'contacted', 'converted'),
        async (leadCount, status) => {
          // Create multiple leads with the same status
          for (let i = 0; i < leadCount; i++) {
            const lead = await leadsService.create({
              name: `Test Lead ${i}`,
              email: `test${i}@example.com`,
              inquiry_type: 'appointment',
            });

            if (status !== 'new') {
              await leadsService.updateStatus(lead.id, status);
            }
          }

          // Test pagination
          const page1 = await leadsService.findAll({
            status,
            page: '1',
            limit: '5',
          });
          const page2 = await leadsService.findAll({
            status,
            page: '2',
            limit: '5',
          });

          // Verify pagination metadata
          expect(page1.pagination.total).toBe(leadCount);
          expect(page1.pagination.page).toBe(1);
          expect(page1.pagination.limit).toBe(5);

          // Verify all leads have correct status
          expect(page1.leads.every((lead) => lead.status === status)).toBe(
            true,
          );
          expect(page2.leads.every((lead) => lead.status === status)).toBe(
            true,
          );

          // Verify no duplicate leads across pages
          const page1Ids = page1.leads.map((lead) => lead.id);
          const page2Ids = page2.leads.map((lead) => lead.id);
          const intersection = page1Ids.filter((id) => page2Ids.includes(id));
          expect(intersection).toHaveLength(0);
        },
      ),
      { numRuns: 30 },
    );
  });
});
