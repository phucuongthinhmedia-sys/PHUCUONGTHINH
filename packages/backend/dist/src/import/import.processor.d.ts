import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { AiService } from './ai.service';
interface ImportJobData {
    import_job_id: string;
}
export declare class ImportProcessor extends WorkerHost {
    private readonly prisma;
    private readonly pdfService;
    private readonly aiService;
    private readonly logger;
    constructor(prisma: PrismaService, pdfService: PdfService, aiService: AiService);
    process(job: Job<ImportJobData>): Promise<void>;
    private validateProduct;
    private getValidationErrors;
}
export {};
