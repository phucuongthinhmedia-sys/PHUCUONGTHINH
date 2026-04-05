import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFiltersDto } from './dto/lead-filters.dto';
import type { Lead } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const { product_ids, preferred_date, ...leadData } = createLeadDto;

    if (!leadData.email && !leadData.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    // Parallel validation
    if (product_ids?.length) {
      const existingProducts = await this.prisma.product.findMany({
        where: { id: { in: product_ids } },
        select: { id: true },
      });
      if (existingProducts.length !== product_ids.length) {
        throw new BadRequestException('One or more product IDs are invalid');
      }
    }

    // Create lead with relationships in a single transaction if possible
    // Note: createMany for relations is not supported in SQLite for nested creates
    // so we use a transaction
    const lead = await this.prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          ...leadData,
          preferred_date: preferred_date ? new Date(preferred_date) : null,
          status: 'new',
          products: product_ids?.length
            ? {
                create: product_ids.map((id) => ({ product_id: id })),
              }
            : undefined,
        },
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  category: { select: { name: true } },
                },
              },
            },
          },
        },
      });
      return newLead;
    });

    void this.notificationService.sendLeadNotification(lead);
    return lead;
  }

  async findAll(filters: LeadFiltersDto = {}) {
    const { status, page = '1', limit = '10' } = filters;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(status && { status }),
    };

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: limitNum,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        total_pages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const { product_ids, preferred_date, ...updateData } = updateLeadDto;

    const lead = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Lead not found');

      // Contact validation
      const email =
        updateData.email !== undefined ? updateData.email : existing.email;
      const phone =
        updateData.phone !== undefined ? updateData.phone : existing.phone;
      if (!email && !phone) throw new BadRequestException('Contact required');

      // Product updates (sequential for SQLite)
      if (product_ids !== undefined) {
        await tx.leadProduct.deleteMany({ where: { lead_id: id } });
        if (product_ids.length > 0) {
          await tx.leadProduct.createMany({
            data: product_ids.map((pid) => ({ lead_id: id, product_id: pid })),
          });
        }
      }

      return tx.lead.update({
        where: { id },
        data: {
          ...updateData,
          preferred_date: preferred_date ? new Date(preferred_date) : undefined,
          updated_at: new Date(),
        },
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  category: { select: { name: true } },
                },
              },
            },
          },
        },
      });
    });

    return lead;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.lead.delete({ where: { id } });
  }

  async findByStatus(status: string) {
    return this.prisma.lead.findMany({
      where: { status },
      include: {
        products: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: string, status: string): Promise<Lead> {
    const valid = ['new', 'contacted', 'converted'];
    if (!valid.includes(status))
      throw new BadRequestException('Invalid status');

    return this.prisma.lead.update({
      where: { id },
      data: { status, updated_at: new Date() },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                category: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }
}
