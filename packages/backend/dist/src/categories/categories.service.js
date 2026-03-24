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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async ensureUniqueSlug(baseSlug, excludeId) {
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.prisma.category.findFirst({
                where: {
                    slug,
                    ...(excludeId && { id: { not: excludeId } }),
                },
            });
            if (!existing) {
                return slug;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    async create(createCategoryDto) {
        const { name, parent_id } = createCategoryDto;
        if (parent_id) {
            const parent = await this.prisma.category.findUnique({
                where: { id: parent_id },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
            }
        }
        const baseSlug = this.generateSlug(name);
        const slug = await this.ensureUniqueSlug(baseSlug);
        return this.prisma.category.create({
            data: {
                name,
                slug,
                parent_id,
            },
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async findAll() {
        return this.prisma.category.findMany({
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async findHierarchy(id) {
        const category = await this.findOne(id);
        const allCategories = await this.findAll();
        const getDescendants = (categoryId) => {
            const children = allCategories.filter(cat => cat.parent_id === categoryId);
            const descendants = [...children];
            for (const child of children) {
                descendants.push(...getDescendants(child.id));
            }
            return descendants;
        };
        return [category, ...getDescendants(id)];
    }
    async update(id, updateCategoryDto) {
        const existingCategory = await this.findOne(id);
        const { name, parent_id } = updateCategoryDto;
        if (parent_id) {
            if (parent_id === id) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
            }
            const parent = await this.prisma.category.findUnique({
                where: { id: parent_id },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
            }
            const hierarchy = await this.findHierarchy(id);
            const descendantIds = hierarchy.map(cat => cat.id);
            if (descendantIds.includes(parent_id)) {
                throw new common_1.BadRequestException('Cannot create circular reference in category hierarchy');
            }
        }
        let slug = existingCategory.slug;
        if (name && name !== existingCategory.name) {
            const baseSlug = this.generateSlug(name);
            slug = await this.ensureUniqueSlug(baseSlug, id);
        }
        return this.prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(name && { slug }),
                ...(parent_id !== undefined && { parent_id }),
            },
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async remove(id) {
        const category = await this.findOne(id);
        const productCount = await this.prisma.product.count({
            where: { category_id: id },
        });
        if (productCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete category with ${productCount} assigned products. Please reassign products first.`);
        }
        const childrenCount = await this.prisma.category.count({
            where: { parent_id: id },
        });
        if (childrenCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category with subcategories. Please delete or reassign subcategories first.');
        }
        await this.prisma.category.delete({
            where: { id },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map