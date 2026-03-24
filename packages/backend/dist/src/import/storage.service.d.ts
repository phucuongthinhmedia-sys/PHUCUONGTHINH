export declare class StorageService {
    private readonly logger;
    private readonly uploadDir;
    private readonly imageDir;
    constructor();
    savePDF(file: Express.Multer.File): Promise<string>;
    saveImage(buffer: Buffer, filename: string): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
    getFileSize(filePath: string): number;
    fileExists(filePath: string): boolean;
    private sanitizeFilename;
    private ensureDirectoryExists;
    getPublicUrl(filePath: string): string;
}
