import { ImportService } from './import.service';
import { BulkCreateDto } from './dto/bulk-create.dto';
export declare class ImportController {
    private readonly importService;
    constructor(importService: ImportService);
    uploadCatalogue(file: Express.Multer.File, req: any): Promise<{
        job_id: string;
        status: string;
        total_pages: number;
    }>;
    getJob(id: string): Promise<{
        id: string;
        file_name: string;
        status: string;
        progress: number;
        current_page: number;
        total_pages: number;
        failed_pages: any;
        started_at: Date | null;
        completed_at: Date | null;
        created_at: Date;
    }>;
    getExtractedProducts(id: string): Promise<{
        id: string;
        name: string;
        sku: string | null;
        description: string | null;
        category: string | null;
        category_id: string | null;
        technical_specs: any;
        price_retail: number | null;
        price_dealer: number | null;
        unit: string | null;
        images: any;
        validation_status: string;
        validation_errors: any;
        user_edited: boolean;
        page_number: number;
    }[]>;
    bulkCreate(id: string, dto: BulkCreateDto): Promise<{
        success: string[];
        failed: {
            id: string;
            error: string;
        }[];
    }>;
    updateExtractedProduct(id: string, data: any): Promise<{
        id: string;
        created_at: Date;
        name: string;
        category: string | null;
        sku: string | null;
        description: string | null;
        technical_specs: string;
        category_id: string | null;
        page_number: number;
        price_retail: number | null;
        price_dealer: number | null;
        unit: string | null;
        images: string;
        ai_raw_response: string;
        user_edited: boolean;
        validation_status: string;
        validation_errors: string;
        import_job_id: string;
    }>;
}
