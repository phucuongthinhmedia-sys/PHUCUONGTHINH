import { ConfigService } from '@nestjs/config';
export declare class LocalStorageService {
    private configService;
    private uploadDir;
    private publicUrl;
    constructor(configService: ConfigService);
    getPresignedUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
    getPresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    generateS3Key(productId: string, filename: string, mediaType: string): string;
    validateFileType(filename: string, mediaType: string): boolean;
    validateFileSize(fileSize: number, mediaType: string): boolean;
    getPublicUrl(key: string): string;
    saveFile(key: string, buffer: Buffer): Promise<void>;
    deleteFile(key: string): Promise<void>;
}
