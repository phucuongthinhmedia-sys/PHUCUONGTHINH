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
exports.StylesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StylesService = class StylesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStyleDto) {
        try {
            return await this.prisma.style.create({
                data: createStyleDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Style name must be unique');
                }
            }
            throw error;
        }
    }
    async findAll() {
        return this.prisma.style.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const style = await this.prisma.style.findUnique({
            where: { id },
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
        if (!style) {
            throw new common_1.NotFoundException(`Style with ID ${id} not found`);
        }
        return style;
    }
    async update(id, updateStyleDto) {
        try {
            return await this.prisma.style.update({
                where: { id },
                data: updateStyleDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Style with ID ${id} not found`);
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Style name must be unique');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            return await this.prisma.style.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Style with ID ${id} not found`);
                }
            }
            throw error;
        }
    }
    async findByName(name) {
        return this.prisma.style.findUnique({
            where: { name },
        });
    }
};
exports.StylesService = StylesService;
exports.StylesService = StylesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StylesService);
//# sourceMappingURL=styles.service.js.map