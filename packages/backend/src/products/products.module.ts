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
import { RedisCacheService } from '../common/services/redis-cache.service';

// Provide RedisCacheService as CacheService for backward compatibility
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
    {
      provide: CacheService,
      useFactory: (redisCache: RedisCacheService) => {
        // Adapter to make RedisCacheService compatible with CacheService interface
        return {
          get: (key: string) => redisCache.get(key),
          set: (key: string, data: any, options?: any) => {
            const ttl = options?.ttl || 300;
            return redisCache.set(key, data, ttl);
          },
          delete: (key: string) => redisCache.delete(key),
          clear: () => redisCache.clear(),
          has: (key: string) => redisCache.has(key),
          // Additional methods for compatibility
          cached: async (
            key: string,
            factory: () => Promise<any>,
            ttl = 300,
          ) => {
            return redisCache.getOrSet(key, factory, ttl);
          },
          generateFilterCacheKey: (filters: any) => {
            return `filters:${JSON.stringify(filters)}`;
          },
          invalidateProductCache: (productId?: string) => {
            if (productId) {
              return redisCache.invalidatePattern(`product:${productId}*`);
            }
            return redisCache.invalidatePattern('product:*');
          },
          getStats: () => {
            return { message: 'Using Redis cache' };
          },
        };
      },
      inject: [RedisCacheService],
    },
    PerformanceService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
