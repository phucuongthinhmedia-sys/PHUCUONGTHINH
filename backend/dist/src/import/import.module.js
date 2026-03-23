"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModule = void 0;
const common_1 = require("@nestjs/common");
const import_controller_1 = require("./import.controller");
const import_service_1 = require("./import.service");
const pdf_service_1 = require("./pdf.service");
const ai_service_1 = require("./ai.service");
const storage_service_1 = require("./storage.service");
const category_mapper_service_1 = require("./category-mapper.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [import_controller_1.ImportController],
        providers: [
            import_service_1.ImportService,
            pdf_service_1.PdfService,
            ai_service_1.AiService,
            storage_service_1.StorageService,
            category_mapper_service_1.CategoryMapperService,
            prisma_service_1.PrismaService,
        ],
        exports: [import_service_1.ImportService],
    })
], ImportModule);
//# sourceMappingURL=import.module.js.map