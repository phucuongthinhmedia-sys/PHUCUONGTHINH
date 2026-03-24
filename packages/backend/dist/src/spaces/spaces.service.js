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
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SpacesService = class SpacesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSpaceDto) {
        try {
            return await this.prisma.space.create({
                data: createSpaceDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Space name must be unique');
                }
            }
            throw error;
        }
    }
    async findAll() {
        return this.prisma.space.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const space = await this.prisma.space.findUnique({
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
        if (!space) {
            throw new common_1.NotFoundException(`Space with ID ${id} not found`);
        }
        return space;
    }
    async update(id, updateSpaceDto) {
        try {
            return await this.prisma.space.update({
                where: { id },
                data: updateSpaceDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Space with ID ${id} not found`);
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Space name must be unique');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            return await this.prisma.space.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Space with ID ${id} not found`);
                }
            }
            throw error;
        }
    }
    async findByName(name) {
        return this.prisma.space.findUnique({
            where: { name },
        });
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map