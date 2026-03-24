import { PrismaService } from '../prisma/prisma.service';
export declare class CategoryMapperService {
    private readonly prisma;
    private readonly logger;
    private readonly CATEGORY_KEYWORDS;
    constructor(prisma: PrismaService);
    mapCategory(productName: string): Promise<string | null>;
    mapCategories(productNames: string[]): Promise<Map<string, string | null>>;
}
