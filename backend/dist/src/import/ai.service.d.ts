import { ConfigService } from '@nestjs/config';
export interface ExtractedProduct {
    name: string;
    sku?: string;
    description?: string;
    category?: string;
    specs: Record<string, any>;
    price_retail?: number;
    price_dealer?: number;
    unit?: string;
}
export declare class AiService {
    private configService;
    private readonly logger;
    private readonly openai;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAYS;
    constructor(configService: ConfigService);
    private callWithRetry;
    private isRetryableError;
    private sleep;
    extractProducts(imageBuffer: Buffer, pageNumber: number): Promise<ExtractedProduct[]>;
    healthCheck(): Promise<boolean>;
}
