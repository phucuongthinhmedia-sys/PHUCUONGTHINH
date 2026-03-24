"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const media_controller_1 = require("./media.controller");
const media_service_1 = require("./media.service");
const s3_service_1 = require("./s3.service");
const local_storage_service_1 = require("./local-storage.service");
const prisma_module_1 = require("../prisma/prisma.module");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [media_controller_1.MediaController],
        providers: [
            media_service_1.MediaService,
            s3_service_1.S3Service,
            local_storage_service_1.LocalStorageService,
            {
                provide: 'STORAGE_SERVICE',
                useFactory: (configService, s3Service, localStorageService) => {
                    const useS3 = configService.get('AWS_ACCESS_KEY_ID') &&
                        configService.get('AWS_SECRET_ACCESS_KEY');
                    return useS3 ? s3Service : localStorageService;
                },
                inject: [config_1.ConfigService, s3_service_1.S3Service, local_storage_service_1.LocalStorageService],
            },
        ],
        exports: [media_service_1.MediaService, 'STORAGE_SERVICE'],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map