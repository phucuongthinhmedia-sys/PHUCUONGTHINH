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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service {
    configService;
    s3Client;
    bucketName;
    constructor(configService) {
        this.configService = configService;
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const config = {
            region: this.configService.get('AWS_REGION') || 'us-east-1',
        };
        if (accessKeyId && secretAccessKey) {
            config.credentials = {
                accessKeyId,
                secretAccessKey,
            };
        }
        this.s3Client = new client_s3_1.S3Client(config);
        this.bucketName =
            this.configService.get('AWS_S3_BUCKET_NAME') || 'default-bucket';
    }
    async getPresignedUploadUrl(key, contentType, expiresIn = 3600) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    async getPresignedDownloadUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
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
            video: ['mp4', 'webm'],
            '3d_file': ['dwg', 'obj', 'fbx', 'dae', 'blend'],
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
        const cdnDomain = this.configService.get('CDN_DOMAIN');
        if (cdnDomain) {
            return `https://${cdnDomain}/${key}`;
        }
        return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map