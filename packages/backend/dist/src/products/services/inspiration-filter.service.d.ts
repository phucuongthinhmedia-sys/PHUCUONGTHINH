import { PrismaService } from '../../prisma/prisma.service';
export interface InspirationFilters {
    styles?: string[];
    spaces?: string[];
}
export declare class InspirationFilterService {
    private prisma;
    constructor(prisma: PrismaService);
    buildInspirationWhere(filters: InspirationFilters): any;
    getAvailableFilters(): Promise<{
        styles: {
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
        }[];
        spaces: {
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
        }[];
    }>;
    getFilterCounts(baseWhere?: any): Promise<{
        styles: {
            count: number;
            _count: {
                products: number;
            };
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
        }[];
        spaces: {
            count: number;
            _count: {
                products: number;
            };
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
        }[];
    }>;
}
