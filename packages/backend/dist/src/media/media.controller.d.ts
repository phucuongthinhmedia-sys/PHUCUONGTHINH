import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { GetPresignedUrlDto } from './dto/upload-media.dto';
import { LocalStorageService } from './local-storage.service';
export declare class MediaController {
    private readonly mediaService;
    private readonly localStorageService;
    constructor(mediaService: MediaService, localStorageService: LocalStorageService);
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
    findByProduct(productId: string): Promise<{
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
    updatePut(id: string, updateMediaDto: UpdateMediaDto): Promise<{
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
    uploadFile(key: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        url?: undefined;
    } | {
        success: boolean;
        url: string;
        message?: undefined;
    }>;
}
