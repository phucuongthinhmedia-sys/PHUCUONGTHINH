import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from './logger.service';
export declare class DatabaseOptimizationService {
    private prisma;
    private logger;
    constructor(prisma: PrismaService, logger: LoggerService);
    private initializeOptimizations;
    private enableQueryLogging;
    getConnectionPoolStats(): Promise<{
        status: string;
        timestamp: string;
    }>;
    getProductQueryOptimizations(): {
        recommendations: string[];
        indexes: string[];
    };
    getLeadQueryOptimizations(): {
        recommendations: string[];
        indexes: string[];
    };
    getMediaQueryOptimizations(): {
        recommendations: string[];
        indexes: string[];
    };
    getOptimizationReport(): {
        products: any;
        leads: any;
        media: any;
        general: string[];
    };
}
