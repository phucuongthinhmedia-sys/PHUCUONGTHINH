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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const categories_service_1 = require("../categories/categories.service");
const combined_filter_service_1 = require("./services/combined-filter.service");
const products_events_service_1 = require("./products-events.service");
let ProductsService = class ProductsService {
    prisma;
    categoriesService;
    combinedFilterService;
    eventsService;
    constructor(prisma, categoriesService, combinedFilterService, eventsService) {
        this.prisma = prisma;
        this.categoriesService = categoriesService;
        this.combinedFilterService = combinedFilterService;
        this.eventsService = eventsService;
    }
    async create(createProductDto) {
        const { name, sku, description, category_id, technical_specs, style_ids, space_ids, } = createProductDto;
        await this.categoriesService.findOne(category_id);
        const existingSku = await this.prisma.product.findUnique({
            where: { sku },
        });
        if (existingSku) {
            throw new common_1.BadRequestException('SKU already exists');
        }
        if (style_ids && style_ids.length > 0) {
            const styles = await this.prisma.style.findMany({
                where: { id: { in: style_ids } },
            });
            if (styles.length !== style_ids.length) {
                throw new common_1.BadRequestException('One or more style IDs are invalid');
            }
        }
        if (space_ids && space_ids.length > 0) {
            const spaces = await this.prisma.space.findMany({
                where: { id: { in: space_ids } },
            });
            if (spaces.length !== space_ids.length) {
                throw new common_1.BadRequestException('One or more space IDs are invalid');
            }
        }
        const product = await this.prisma.product.create({
            data: {
                name,
                sku,
                description,
                category_id,
                technical_specs: JSON.stringify(technical_specs ?? {}),
                style_tags: style_ids && style_ids.length > 0
                    ? {
                        create: style_ids.map((style_id) => ({ style_id })),
                    }
                    : undefined,
                space_tags: space_ids && space_ids.length > 0
                    ? {
                        create: space_ids.map((space_id) => ({ space_id })),
                    }
                    : undefined,
            },
            include: {
                category: true,
                style_tags: {
                    include: {
                        style: true,
                    },
                },
                space_tags: {
                    include: {
                        space: true,
                    },
                },
                media: true,
            },
        });
        this.eventsService.emit({
            type: 'created',
            productId: product.id,
            timestamp: new Date().toISOString(),
        });
        return product;
    }
    async findAll(filters) {
        const { categories, styles, spaces, technical_specs, search, page = 1, limit = 20, published = 'true', } = filters || {};
        const combinedFilters = {
            categories,
            search,
            published,
            page,
            limit,
            inspiration: {
                styles,
                spaces,
            },
            technical: technical_specs,
        };
        return this.combinedFilterService.filterProducts(combinedFilters);
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                style_tags: {
                    include: {
                        style: true,
                    },
                },
                space_tags: {
                    include: {
                        space: true,
                    },
                },
                media: {
                    orderBy: {
                        sort_order: 'asc',
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            ...product,
            technical_specs: JSON.parse(product.technical_specs),
        };
    }
    async findBySku(sku) {
        const product = await this.prisma.product.findUnique({
            where: { sku },
            include: {
                category: true,
                style_tags: {
                    include: {
                        style: true,
                    },
                },
                space_tags: {
                    include: {
                        space: true,
                    },
                },
                media: {
                    orderBy: {
                        sort_order: 'asc',
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            ...product,
            technical_specs: JSON.parse(product.technical_specs),
        };
    }
    async update(id, updateProductDto) {
        const existingProduct = await this.findOne(id);
        const { name, sku, description, category_id, technical_specs, style_ids, space_ids, is_published, } = updateProductDto;
        if (category_id) {
            await this.categoriesService.findOne(category_id);
        }
        if (sku && sku !== existingProduct.sku) {
            const existingSku = await this.prisma.product.findUnique({
                where: { sku },
            });
            if (existingSku) {
                throw new common_1.BadRequestException('SKU already exists');
            }
        }
        if (style_ids && style_ids.length > 0) {
            const styles = await this.prisma.style.findMany({
                where: { id: { in: style_ids } },
            });
            if (styles.length !== style_ids.length) {
                throw new common_1.BadRequestException('One or more style IDs are invalid');
            }
        }
        if (space_ids && space_ids.length > 0) {
            const spaces = await this.prisma.space.findMany({
                where: { id: { in: space_ids } },
            });
            if (spaces.length !== space_ids.length) {
                throw new common_1.BadRequestException('One or more space IDs are invalid');
            }
        }
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(sku && { sku }),
                ...(description !== undefined && { description }),
                ...(category_id && { category_id }),
                ...(technical_specs && {
                    technical_specs: JSON.stringify(technical_specs),
                }),
                ...(is_published !== undefined && { is_published }),
                ...(style_ids !== undefined && {
                    style_tags: {
                        deleteMany: {},
                        create: style_ids.map((style_id) => ({ style_id })),
                    },
                }),
                ...(space_ids !== undefined && {
                    space_tags: {
                        deleteMany: {},
                        create: space_ids.map((space_id) => ({ space_id })),
                    },
                }),
            },
            include: {
                category: true,
                style_tags: {
                    include: {
                        style: true,
                    },
                },
                space_tags: {
                    include: {
                        space: true,
                    },
                },
                media: true,
            },
        });
        this.eventsService.emit({
            type: 'updated',
            productId: id,
            timestamp: new Date().toISOString(),
        });
        return product;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.delete({
            where: { id },
        });
        this.eventsService.emit({
            type: 'deleted',
            productId: id,
            timestamp: new Date().toISOString(),
        });
    }
    async publish(id) {
        const product = await this.findOne(id);
        if (!product.name || !product.category_id) {
            throw new common_1.BadRequestException('Product must have name and category before publishing');
        }
        const mediaCount = await this.prisma.media.count({
            where: { product_id: id },
        });
        if (mediaCount === 0) {
            throw new common_1.BadRequestException('Product must have at least one media asset before publishing');
        }
        return this.update(id, { is_published: true });
    }
    async unpublish(id) {
        return this.update(id, { is_published: false });
    }
    async getGoldenRecord(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                style_tags: {
                    include: {
                        style: true,
                    },
                },
                space_tags: {
                    include: {
                        space: true,
                    },
                },
                media: {
                    orderBy: {
                        sort_order: 'asc',
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            product_id: product.id,
            sku: product.sku,
            identification: {
                name: product.name,
                description: product.description,
                category: product.category?.name,
            },
            technical_data: JSON.parse(product.technical_specs || '{}'),
            marketing_content: {},
            digital_assets: {},
            relational_data: {},
            ai_semantic_layer: {},
            erp_sync_data: {},
        };
    }
    async getGoldenRecordBySku(sku) {
        const product = await this.prisma.product.findUnique({
            where: { sku },
            include: {
                category: true,
                style_tags: {
                    include: {
                        style: true,
                    },
                },
                space_tags: {
                    include: {
                        space: true,
                    },
                },
                media: {
                    orderBy: {
                        sort_order: 'asc',
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            product_id: product.id,
            sku: product.sku,
            identification: {
                name: product.name,
                description: product.description,
                category: product.category?.name,
            },
            technical_data: JSON.parse(product.technical_specs || '{}'),
            marketing_content: {},
            digital_assets: {},
            relational_data: {},
            ai_semantic_layer: {},
            erp_sync_data: {},
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        categories_service_1.CategoriesService,
        combined_filter_service_1.CombinedFilterService,
        products_events_service_1.ProductsEventService])
], ProductsService);
//# sourceMappingURL=products.service.js.map