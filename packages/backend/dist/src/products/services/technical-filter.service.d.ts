import { PrismaService } from '../../prisma/prisma.service';
export interface TechnicalFilters {
    format?: string[];
    color_palette?: string[];
    material?: string[];
    slip_rating?: string[];
    thickness?: {
        min?: number;
        max?: number;
    };
    dimensions?: {
        length?: {
            min?: number;
            max?: number;
        };
        width?: {
            min?: number;
            max?: number;
        };
    };
    [key: string]: any;
}
export declare class TechnicalFilterService {
    private prisma;
    constructor(prisma: PrismaService);
    buildTechnicalWhere(filters: TechnicalFilters): any;
    getAvailableTechnicalFilters(baseWhere?: any): Promise<Record<string, any[]>>;
    getCommonTechnicalFields(): {
        format: string[];
        material: string[];
        finish: string[];
        slip_rating: string[];
        color_palette: string[];
    };
    validateTechnicalFilters(filters: TechnicalFilters): boolean;
}
