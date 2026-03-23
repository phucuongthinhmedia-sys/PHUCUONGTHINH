import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    getPresignedUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
    getPresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    generateS3Key(productId: string, filename: string, mediaType: string): string;
    validateFileType(filename: string, mediaType: string): boolean;
    validateFileSize(fileSize: number, mediaType: string): boolean;
    getPublicUrl(key: string): string;
}
