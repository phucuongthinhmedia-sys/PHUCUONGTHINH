import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriesModule } from '../categories/categories.module';
import { InspirationFilterService } from './services/inspiration-filter.service';
import { TechnicalFilterService } from './services/technical-filter.service';
import { CombinedFilterService } from './services/combined-filter.service';
import { SearchService } from './services/search.service';
import { PaginationService } from './services/pagination.service';
import { CacheService } from './services/cache.service';
import { PerformanceService } from './services/performance.service';
import { ProductsEventService } from './products-events.service';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsEventService,
    InspirationFilterService,
    TechnicalFilterService,
    CombinedFilterService,
    SearchService,
    PaginationService,
    CacheService,
    PerformanceService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
