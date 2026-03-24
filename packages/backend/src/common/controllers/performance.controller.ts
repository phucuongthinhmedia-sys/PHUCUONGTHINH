import { Controller, Get, UseGuards } from '@nestjs/common';
import { DatabaseOptimizationService } from '../services/database-optimization.service';
import { CdnCachingService } from '../services/cdn-caching.service';
import { CacheService } from '../services/cache.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('performance')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  constructor(
    private dbOptimization: DatabaseOptimizationService,
    private cdnCaching: CdnCachingService,
    private cache: CacheService,
  ) {}

  @Get('database-optimization')
  getDatabaseOptimization() {
    return this.dbOptimization.getOptimizationReport();
  }

  @Get('cdn-strategy')
  getCdnStrategy() {
    return {
      cacheHeaders: this.cdnCaching.getCacheHeaders('lifestyle'),
      apiCacheStrategy: this.cdnCaching.getApiCacheStrategy(),
      optimizationRecommendations:
        this.cdnCaching.getOptimizationRecommendations(),
      purgeConfiguration: this.cdnCaching.getPurgeConfiguration(),
    };
  }

  @Get('cache-stats')
  getCacheStats() {
    return this.cache.getStats();
  }

  @Get('connection-pool')
  async getConnectionPoolStats() {
    return this.dbOptimization.getConnectionPoolStats();
  }
}
