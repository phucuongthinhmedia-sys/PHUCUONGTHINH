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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let StorageService = StorageService_1 = class StorageService {
    logger = new common_1.Logger(StorageService_1.name);
    uploadDir = path.join(process.cwd(), 'uploads', 'catalogues');
    imageDir = path.join(process.cwd(), 'uploads', 'catalogue-images');
    constructor() {
        this.ensureDirectoryExists(this.uploadDir);
        this.ensureDirectoryExists(this.imageDir);
    }
    async savePDF(file) {
        const timestamp = Date.now();
        const sanitizedFilename = this.sanitizeFilename(file.originalname);
        const filename = `${timestamp}-${sanitizedFilename}`;
        const filePath = path.join(this.uploadDir, filename);
        try {
            fs.writeFileSync(filePath, file.buffer);
            this.logger.log(`Saved PDF: ${filePath}`);
            return filePath;
        }
        catch (error) {
            this.logger.error(`Failed to save PDF: ${error.message}`);
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }
    async saveImage(buffer, filename) {
        const sanitizedFilename = this.sanitizeFilename(filename);
        const filePath = path.join(this.imageDir, sanitizedFilename);
        try {
            fs.writeFileSync(filePath, buffer);
            this.logger.log(`Saved image: ${filePath}`);
            return filePath;
        }
        catch (error) {
            this.logger.error(`Failed to save image: ${error.message}`);
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    async deleteFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                this.logger.log(`Deleted file: ${filePath}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete file: ${error.message}`);
        }
    }
    getFileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        }
        catch (error) {
            this.logger.error(`Failed to get file size: ${error.message}`);
            return 0;
        }
    }
    fileExists(filePath) {
        return fs.existsSync(filePath);
    }
    sanitizeFilename(filename) {
        const basename = path.basename(filename);
        return basename.replace(/[^a-zA-Z0-9.-_]/g, '_');
    }
    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            this.logger.log(`Created directory: ${dirPath}`);
        }
    }
    getPublicUrl(filePath) {
        const relativePath = path.relative(process.cwd(), filePath);
        return `/${relativePath.replace(/\\/g, '/')}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map