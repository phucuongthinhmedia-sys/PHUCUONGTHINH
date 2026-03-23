"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDatabaseService = void 0;
const client_1 = require("@prisma/client");
class TestDatabaseService {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async connect() {
        await this.prisma.$connect();
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
    async cleanup() {
        try {
            await this.prisma.leadProduct.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.productSpaceTag.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.productStyleTag.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.media.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.lead.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.product.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.space.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.style.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.category.deleteMany();
        }
        catch (error) {
        }
        try {
            await this.prisma.user.deleteMany();
        }
        catch (error) {
        }
    }
    getPrismaClient() {
        return this.prisma;
    }
}
exports.TestDatabaseService = TestDatabaseService;
//# sourceMappingURL=test-setup.js.map