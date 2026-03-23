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
exports.TechnicalFilterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TechnicalFilterService = class TechnicalFilterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildTechnicalWhere(filters) {
        const conditions = [];
        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null)
                return;
            if (Array.isArray(value) && value.length > 0) {
                const orConditions = value.map((val) => ({
                    technical_specs: {
                        contains: `"${key}":"${val}"`,
                    },
                }));
                conditions.push({ OR: orConditions });
            }
            else if ((typeof value === 'object' && value.min !== undefined) ||
                value.max !== undefined) {
                if (value.min !== undefined) {
                    conditions.push({
                        technical_specs: {
                            contains: `"${key}":`,
                        },
                    });
                }
                if (value.max !== undefined) {
                    conditions.push({
                        technical_specs: {
                            contains: `"${key}":`,
                        },
                    });
                }
            }
            else if (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean') {
                conditions.push({
                    technical_specs: {
                        contains: `"${key}":"${value}"`,
                    },
                });
            }
        });
        return conditions.length > 0 ? { AND: conditions } : {};
    }
    async getAvailableTechnicalFilters(baseWhere = {}) {
        const products = await this.prisma.product.findMany({
            where: baseWhere,
            select: {
                technical_specs: true,
            },
        });
        const technicalOptions = {};
        products.forEach((product) => {
            try {
                const specs = JSON.parse(product.technical_specs);
                Object.entries(specs).forEach(([key, value]) => {
                    if (!technicalOptions[key]) {
                        technicalOptions[key] = new Set();
                    }
                    if (Array.isArray(value)) {
                        value.forEach((v) => technicalOptions[key].add(v));
                    }
                    else {
                        technicalOptions[key].add(value);
                    }
                });
            }
            catch (error) {
            }
        });
        const result = {};
        Object.entries(technicalOptions).forEach(([key, valueSet]) => {
            result[key] = Array.from(valueSet).sort();
        });
        return result;
    }
    getCommonTechnicalFields() {
        return {
            format: ['Slab', 'Mosaic', 'Hexagon', 'Subway', 'Penny Round'],
            material: ['Porcelain', 'Ceramic', 'Natural Stone', 'Glass', 'Metal'],
            finish: ['Matte', 'Glossy', 'Textured', 'Polished', 'Honed'],
            slip_rating: ['R9', 'R10', 'R11', 'R12', 'R13'],
            color_palette: [
                'White',
                'Black',
                'Grey',
                'Beige',
                'Brown',
                'Blue',
                'Green',
            ],
        };
    }
    validateTechnicalFilters(filters) {
        try {
            Object.entries(filters).forEach(([key, value]) => {
                if (typeof key !== 'string' ||
                    key.includes('"') ||
                    key.includes('\\')) {
                    throw new Error('Invalid filter key');
                }
                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        if (typeof v === 'string' &&
                            (v.includes('"') || v.includes('\\'))) {
                            throw new Error('Invalid filter value');
                        }
                    });
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.TechnicalFilterService = TechnicalFilterService;
exports.TechnicalFilterService = TechnicalFilterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechnicalFilterService);
//# sourceMappingURL=technical-filter.service.js.map