import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from './cache.service';

export interface InspirationFilters {
  styles?: string[];
  spaces?: string[];
}

@Injectable()
export class InspirationFilterService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Build where clause for inspiration-based filtering
   * Logic: Products match ANY selected style AND ANY selected space
   */
  buildInspirationWhere(filters: InspirationFilters): any {
    const conditions: any[] = [];

    if (filters.styles?.length) {
      conditions.push({
        style_tags: { some: { style_id: { in: filters.styles } } },
      });
    }

    if (filters.spaces?.length) {
      conditions.push({
        space_tags: { some: { space_id: { in: filters.spaces } } },
      });
    }

    return conditions.length === 0
      ? {}
      : conditions.length === 1
        ? conditions[0]
        : { AND: conditions };
  }

  /**
   * Get available filter options for inspiration tab
   * Optimized with caching
   */
  async getAvailableFilters() {
    return this.cacheService.cached(
      'available_inspiration_filters',
      async () => {
        const [styles, spaces] = await Promise.all([
          this.prisma.style.findMany({ orderBy: { name: 'asc' } }),
          this.prisma.space.findMany({ orderBy: { name: 'asc' } }),
        ]);
        return { styles, spaces };
      },
      { ttl: 3600 }, // 1 hour cache
    );
  }

  /**
   * Get filter counts for inspiration filters
   * Optimized with caching
   */
  async getFilterCounts(baseWhere: any = {}) {
    const cacheKey = `inspiration_filter_counts:${JSON.stringify(baseWhere)}`;

    return this.cacheService.cached(
      cacheKey,
      async () => {
        const [styleCounts, spaceCounts] = await Promise.all([
          this.prisma.style.findMany({
            include: {
              _count: {
                select: {
                  products: { where: { product: baseWhere } },
                },
              },
            },
          }),
          this.prisma.space.findMany({
            include: {
              _count: {
                select: {
                  products: { where: { product: baseWhere } },
                },
              },
            },
          }),
        ]);

        return {
          styles: styleCounts.map((s) => ({ ...s, count: s._count.products })),
          spaces: spaceCounts.map((s) => ({ ...s, count: s._count.products })),
        };
      },
      { ttl: 600 }, // 10 minutes cache
    );
  }
}
