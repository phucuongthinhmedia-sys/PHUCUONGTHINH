import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { Product } from '@prisma/client';
import { CombinedFilterService } from './services/combined-filter.service';
import { ProductsEventService } from './products-events.service';
export declare class ProductsService {
    private prisma;
    private categoriesService;
    private combinedFilterService;
    private eventsService;
    constructor(prisma: PrismaService, categoriesService: CategoriesService, combinedFilterService: CombinedFilterService, eventsService: ProductsEventService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(filters?: ProductFiltersDto): Promise<import("./services/combined-filter.service").FilterResponse>;
    findOne(id: string): Promise<Product>;
    findBySku(sku: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<Product>;
    unpublish(id: string): Promise<Product>;
    getGoldenRecord(id: string): Promise<any>;
    getGoldenRecordBySku(sku: string): Promise<any>;
}
