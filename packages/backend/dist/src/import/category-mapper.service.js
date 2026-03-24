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
var CategoryMapperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMapperService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoryMapperService = CategoryMapperService_1 = class CategoryMapperService {
    prisma;
    logger = new common_1.Logger(CategoryMapperService_1.name);
    CATEGORY_KEYWORDS = {
        gach: ['gạch', 'tile', 'ceramic', 'porcelain', 'granite', 'marble'],
        'thiet-bi-ve-sinh': [
            'lavabo',
            'bồn cầu',
            'vòi',
            'sen',
            'bồn tắm',
            'toilet',
            'sink',
            'faucet',
            'shower',
        ],
        'vat-lieu-phu-tro': [
            'keo',
            'xi măng',
            'vữa',
            'chống thấm',
            'adhesive',
            'cement',
        ],
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async mapCategory(productName) {
        if (!productName)
            return null;
        const lowerName = productName.toLowerCase();
        for (const [categorySlug, keywords] of Object.entries(this.CATEGORY_KEYWORDS)) {
            for (const keyword of keywords) {
                if (lowerName.includes(keyword.toLowerCase())) {
                    const category = await this.prisma.category.findFirst({
                        where: {
                            slug: {
                                contains: categorySlug,
                            },
                        },
                    });
                    if (category) {
                        this.logger.log(`Mapped "${productName}" to category "${category.name}" (${category.id})`);
                        return category.id;
                    }
                }
            }
        }
        this.logger.warn(`Could not map category for product: ${productName}`);
        return null;
    }
    async mapCategories(productNames) {
        const result = new Map();
        for (const name of productNames) {
            const categoryId = await this.mapCategory(name);
            result.set(name, categoryId);
        }
        return result;
    }
};
exports.CategoryMapperService = CategoryMapperService;
exports.CategoryMapperService = CategoryMapperService = CategoryMapperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryMapperService);
//# sourceMappingURL=category-mapper.service.js.map