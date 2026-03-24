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
exports.InspirationFilterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InspirationFilterService = class InspirationFilterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildInspirationWhere(filters) {
        const conditions = [];
        if (filters.styles && filters.styles.length > 0) {
            conditions.push({
                style_tags: {
                    some: {
                        style_id: { in: filters.styles },
                    },
                },
            });
        }
        if (filters.spaces && filters.spaces.length > 0) {
            conditions.push({
                space_tags: {
                    some: {
                        space_id: { in: filters.spaces },
                    },
                },
            });
        }
        if (conditions.length === 0) {
            return {};
        }
        else if (conditions.length === 1) {
            return conditions[0];
        }
        else {
            return { AND: conditions };
        }
    }
    async getAvailableFilters() {
        const [styles, spaces] = await Promise.all([
            this.prisma.style.findMany({
                orderBy: { name: 'asc' },
            }),
            this.prisma.space.findMany({
                orderBy: { name: 'asc' },
            }),
        ]);
        return {
            styles,
            spaces,
        };
    }
    async getFilterCounts(baseWhere = {}) {
        const [styleCounts, spaceCounts] = await Promise.all([
            this.prisma.style.findMany({
                include: {
                    _count: {
                        select: {
                            products: {
                                where: {
                                    product: baseWhere,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.space.findMany({
                include: {
                    _count: {
                        select: {
                            products: {
                                where: {
                                    product: baseWhere,
                                },
                            },
                        },
                    },
                },
            }),
        ]);
        return {
            styles: styleCounts.map((style) => ({
                ...style,
                count: style._count.products,
            })),
            spaces: spaceCounts.map((space) => ({
                ...space,
                count: space._count.products,
            })),
        };
    }
};
exports.InspirationFilterService = InspirationFilterService;
exports.InspirationFilterService = InspirationFilterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InspirationFilterService);
//# sourceMappingURL=inspiration-filter.service.js.map