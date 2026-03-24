import { ConfigService } from '@nestjs/config';
export declare class CdnCachingService {
    private configService;
    private cdnDomain;
    constructor(configService: ConfigService);
    getCacheHeaders(mediaType: string): {
        'Cache-Control': string;
        'Content-Type': string;
        'CDN-Cache-Control'?: string;
    };
    private getContentType;
    getCdnUrl(s3Key: string): string;
    getImageVariants(s3Key: string): {
        thumbnail: string;
        medium: string;
        large: string;
        original: string;
    };
    getWebPVariant(s3Key: string): string;
    getPurgeConfiguration(): {
        strategy: string;
        ttl: number;
        patterns: string[];
    };
    getOptimizationRecommendations(): string[];
    getApiCacheStrategy(): {
        products: string;
        categories: string;
        tags: string;
        media: string;
        leads: string;
    };
}
