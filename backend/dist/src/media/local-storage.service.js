"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let LocalStorageService = class LocalStorageService {
    configService;
    uploadDir;
    publicUrl;
    constructor(configService) {
        this.configService = configService;
        this.uploadDir = path.join(process.cwd(), 'uploads');
        this.publicUrl =
            this.configService.get('BACKEND_URL') || 'http://localhost:3001';
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async getPresignedUploadUrl(key, contentType, expiresIn = 3600) {
        return `${this.publicUrl}/api/v1/media/upload/${encodeURIComponent(key)}`;
    }
    async getPresignedDownloadUrl(key, expiresIn = 3600) {
        return this.getPublicUrl(key);
    }
    generateS3Key(productId, filename, mediaType) {
        const timestamp = Date.now();
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        return `products/${productId}/${mediaType}/${timestamp}_${sanitizedFilename}`;
    }
    validateFileType(filename, mediaType) {
        const fileExtension = filename.toLowerCase().split('.').pop();
        const allowedTypes = {
            lifestyle: ['jpg', 'jpeg', 'png', 'webp'],
            cutout: ['jpg', 'jpeg', 'png', 'webp'],
            video: ['mp4', 'webm', 'mov'],
            '3d_file': ['dwg', 'obj', 'fbx', 'dae', 'blend', 'glb', 'gltf', 'skp'],
            pdf: ['pdf'],
        };
        return allowedTypes[mediaType]?.includes(fileExtension) || false;
    }
    validateFileSize(fileSize, mediaType) {
        const maxSizes = {
            lifestyle: 10 * 1024 * 1024,
            cutout: 10 * 1024 * 1024,
            video: 100 * 1024 * 1024,
            '3d_file': 50 * 1024 * 1024,
            pdf: 20 * 1024 * 1024,
        };
        return fileSize <= (maxSizes[mediaType] || 10 * 1024 * 1024);
    }
    getPublicUrl(key) {
        return `${this.publicUrl}/uploads/${key}`;
    }
    async saveFile(key, buffer) {
        const filePath = path.join(this.uploadDir, key);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, buffer);
    }
    async deleteFile(key) {
        const filePath = path.join(this.uploadDir, key);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map