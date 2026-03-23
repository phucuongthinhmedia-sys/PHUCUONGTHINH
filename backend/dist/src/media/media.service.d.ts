import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { GetPresignedUrlDto } from './dto/upload-media.dto';
interface StorageService {
    getPresignedUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
    getPresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    generateS3Key(productId: string, filename: string, mediaType: string): string;
    validateFileType(filename: string, mediaType: string): boolean;
    getPublicUrl(key: string): string;
}
export declare class MediaService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    create(createMediaDto: CreateMediaDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    }>;
    findAll(): Promise<({
        product: {
            id: string;
            name: string;
            sku: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    })[]>;
    findByProductId(productId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    }[]>;
    findOne(id: string): Promise<{
        product: {
            id: string;
            name: string;
            sku: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    }>;
    update(id: string, updateMediaDto: UpdateMediaDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    }>;
    getPresignedUploadUrl(productId: string, getPresignedUrlDto: GetPresignedUrlDto): Promise<{
        upload_url: string;
        s3_key: string;
        public_url: string;
    }>;
    getDownloadUrl(id: string): Promise<{
        download_url: string;
        expires_at: string;
    }>;
    private extractS3KeyFromUrl;
    updateSortOrder(productId: string, mediaOrders: {
        id: string;
        sort_order: number;
    }[]): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        file_url: string;
        file_type: string;
        media_type: string;
        sort_order: number;
        is_cover: boolean;
        file_size: number | null;
        alt_text: string | null;
        product_id: string;
    }[]>;
}
export {};
