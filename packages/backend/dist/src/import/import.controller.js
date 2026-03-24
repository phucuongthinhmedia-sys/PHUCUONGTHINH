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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const import_service_1 = require("./import.service");
const bulk_create_dto_1 = require("./dto/bulk-create.dto");
let ImportController = class ImportController {
    importService;
    constructor(importService) {
        this.importService = importService;
    }
    async uploadCatalogue(file, req) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        const userId = req.user.id;
        return this.importService.createJob(file, userId);
    }
    async getJob(id) {
        return this.importService.getJobStatus(id);
    }
    async getExtractedProducts(id) {
        return this.importService.getExtractedProducts(id);
    }
    async bulkCreate(id, dto) {
        return this.importService.bulkCreateProducts(id, dto.product_ids);
    }
    async updateExtractedProduct(id, data) {
        return this.importService.updateExtractedProduct(id, data);
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "uploadCatalogue", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "getJob", null);
__decorate([
    (0, common_1.Get)('jobs/:id/products'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "getExtractedProducts", null);
__decorate([
    (0, common_1.Post)('jobs/:id/bulk-create'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_create_dto_1.BulkCreateDto]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "updateExtractedProduct", null);
exports.ImportController = ImportController = __decorate([
    (0, common_1.Controller)('import'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [import_service_1.ImportService])
], ImportController);
//# sourceMappingURL=import.controller.js.map