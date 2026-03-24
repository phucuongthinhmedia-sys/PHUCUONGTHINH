"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadsService = class LeadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLeadDto) {
        const { product_ids, preferred_date, ...leadData } = createLeadDto;
        if (!leadData.email && !leadData.phone) {
            throw new common_1.BadRequestException('Either email or phone must be provided');
        }
        if (product_ids && product_ids.length > 0) {
            const existingProducts = await this.prisma.product.findMany({
                where: { id: { in: product_ids } },
                select: { id: true },
            });
            if (existingProducts.length !== product_ids.length) {
                throw new common_1.BadRequestException('One or more product IDs are invalid');
            }
        }
        const lead = await this.prisma.lead.create({
            data: {
                ...leadData,
                preferred_date: preferred_date ? new Date(preferred_date) : null,
                status: 'new',
            },
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
        });
        if (product_ids && product_ids.length > 0) {
            await this.prisma.leadProduct.createMany({
                data: product_ids.map((product_id) => ({
                    lead_id: lead.id,
                    product_id,
                })),
            });
            return this.findOne(lead.id);
        }
        return lead;
    }
    async findAll(filters = {}) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Lead not found');
        }
        return lead;
    }
    async update(id, updateLeadDto) {
        const existingLead = await this.findOne(id);
        const { product_ids, preferred_date, ...updateData } = updateLeadDto;
        const newEmail = updateData.email !== undefined ? updateData.email : existingLead.email;
        const newPhone = updateData.phone !== undefined ? updateData.phone : existingLead.phone;
        if (!newEmail && !newPhone) {
            throw new common_1.BadRequestException('Either email or phone must be provided');
        }
        if (product_ids && product_ids.length > 0) {
            const existingProducts = await this.prisma.product.findMany({
                where: { id: { in: product_ids } },
                select: { id: true },
            });
            if (existingProducts.length !== product_ids.length) {
                throw new common_1.BadRequestException('One or more product IDs are invalid');
            }
        }
        const updatedLead = await this.prisma.lead.update({
            where: { id },
            data: {
                ...updateData,
                preferred_date: preferred_date ? new Date(preferred_date) : undefined,
                updated_at: new Date(),
            },
        });
        if (product_ids !== undefined) {
            await this.prisma.leadProduct.deleteMany({
                where: { lead_id: id },
            });
            if (product_ids.length > 0) {
                await this.prisma.leadProduct.createMany({
                    data: product_ids.map((product_id) => ({
                        lead_id: id,
                        product_id,
                    })),
                });
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        const lead = await this.findOne(id);
        await this.prisma.lead.delete({
            where: { id },
        });
    }
    async findByStatus(status) {
        return this.prisma.lead.findMany({
            where: { status },
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
        });
    }
    async updateStatus(id, status) {
        const validStatuses = ['new', 'contacted', 'converted'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }
        const existingLead = await this.findOne(id);
        return this.prisma.lead.update({
            where: { id },
            data: {
                status,
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
                            },
                        },
                    },
                },
            },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map