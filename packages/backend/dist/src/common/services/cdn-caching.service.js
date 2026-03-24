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
exports.CdnCachingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let CdnCachingService = class CdnCachingService {
    configService;
    cdnDomain;
    constructor(configService) {
        this.configService = configService;
        this.cdnDomain = this.configService.get('CDN_DOMAIN') || 'cdn.example.com';
    }
    getCacheHeaders(mediaType) {
        const headers = {
            'Cache-Control': '',
            'Content-Type': this.getContentType(mediaType),
        };
        switch (mediaType) {
            case 'lifestyle':
            case 'cutout':
                headers['Cache-Control'] = 'public, max-age=2592000, immutable';
                headers['CDN-Cache-Control'] = 'max-age=2592000';
                break;
            case 'video':
                headers['Cache-Control'] = 'public, max-age=604800';
                headers['CDN-Cache-Control'] = 'max-age=604800';
                break;
            case '3d_file':
                headers['Cache-Control'] = 'public, max-age=2592000, immutable';
                headers['CDN-Cache-Control'] = 'max-age=2592000';
                break;
            case 'pdf':
                headers['Cache-Control'] = 'public, max-age=604800';
                headers['CDN-Cache-Control'] = 'max-age=604800';
                break;
            default:
                headers['Cache-Control'] = 'public, max-age=3600';
                headers['CDN-Cache-Control'] = 'max-age=3600';
        }
        return headers;
    }
    getContentType(mediaType) {
        const contentTypes = {
            lifestyle: 'image/jpeg',
            cutout: 'image/png',
            video: 'video/mp4',
            '3d_file': 'application/octet-stream',
            pdf: 'application/pdf',
        };
        return contentTypes[mediaType] || 'application/octet-stream';
    }
    getCdnUrl(s3Key) {
        return `https://${this.cdnDomain}/${s3Key}`;
    }
    getImageVariants(s3Key) {
        const baseUrl = this.getCdnUrl(s3Key);
        const keyWithoutExtension = s3Key.substring(0, s3Key.lastIndexOf('.'));
        const extension = s3Key.substring(s3Key.lastIndexOf('.'));
        return {
            thumbnail: `${baseUrl}?w=200&h=200&fit=cover`,
            medium: `${baseUrl}?w=600&h=600&fit=cover`,
            large: `${baseUrl}?w=1200&h=1200&fit=cover`,
            original: baseUrl,
        };
    }
    getWebPVariant(s3Key) {
        const keyWithoutExtension = s3Key.substring(0, s3Key.lastIndexOf('.'));
        return this.getCdnUrl(`${keyWithoutExtension}.webp`);
    }
    getPurgeConfiguration() {
        return {
            strategy: 'time-based',
            ttl: 2592000,
            patterns: ['/products/*', '/media/*', '/assets/*'],
        };
    }
    getOptimizationRecommendations() {
        return [
            'Enable gzip compression for text-based assets',
            'Use WebP format for images with fallback to JPEG/PNG',
            'Implement lazy loading for images below the fold',
            'Use srcset for responsive image delivery',
            'Enable HTTP/2 push for critical assets',
            'Configure cache headers based on content type',
            'Use CDN edge locations for global distribution',
            'Implement cache invalidation for updated assets',
            'Monitor CDN performance metrics',
            'Use image optimization (resize, compress) at edge',
        ];
    }
    getApiCacheStrategy() {
        return {
            products: 'public, max-age=300',
            categories: 'public, max-age=3600',
            tags: 'public, max-age=3600',
            media: 'public, max-age=86400',
            leads: 'private, no-cache',
        };
    }
};
exports.CdnCachingService = CdnCachingService;
exports.CdnCachingService = CdnCachingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CdnCachingService);
//# sourceMappingURL=cdn-caching.service.js.map