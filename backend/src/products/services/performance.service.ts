import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface QueryOptimizationOptions {
  enableIndexHints?: boolean;
  batchSize?: number;
  maxQueryTime?: number;
}

export interface PerformanceMetrics {
  queryTime: number;
  resultCount: number;
  cacheHit: boolean;
  indexesUsed: string[];
  optimizationApplied: string[];
}

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Optimize database queries with proper indexing and batching
   */
  async optimizeQuery<T>(
    queryFn: () => Promise<T>,
    options: QueryOptimizationOptions = {},
  ): Promise<{ result: T; metrics: PerformanceMetrics }> {
    const startTime = Date.now();
    const optimizationApplied: string[] = [];

    try {
      const result = await queryFn();
      const queryTime = Date.now() - startTime;

      const metrics: PerformanceMetrics = {
        queryTime,
        resultCount: Array.isArray(result) ? result.length : 1,
        cacheHit: false,
        indexesUsed: [], // Would need database-specific implementation
        optimizationApplied,
      };

      return { result, metrics };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Optimize product filtering queries
   */
  buildOptimizedProductQuery(filters: any): {
    where: any;
    include: any;
    orderBy: any;
    optimizations: string[];
  } {
    const optimizations: string[] = [];

    // Base where clause
    const where: any = {};

    // Optimize published filter (uses index)
    if (filters.published === 'true') {
      where.is_published = true;
      optimizations.push('published_index');
    } else if (filters.published === 'false') {
      where.is_published = false;
      optimizations.push('published_index');
    }

    // Optimize category filter (uses index + hierarchy)
    if (filters.categories && filters.categories.length > 0) {
      where.category_id = { in: filters.categories };
      optimizations.push('category_index');
    }

    // Optimize style/space filters (uses junction table indexes)
    const andConditions: any[] = [];

    if (filters.inspiration?.styles && filters.inspiration.styles.length > 0) {
      andConditions.push({
        style_tags: {
          some: {
            style_id: { in: filters.inspiration.styles },
          },
        },
      });
      optimizations.push('style_junction_index');
    }

    if (filters.inspiration?.spaces && filters.inspiration.spaces.length > 0) {
      andConditions.push({
        space_tags: {
          some: {
            space_id: { in: filters.inspiration.spaces },
          },
        },
      });
      optimizations.push('space_junction_index');
    }

    // Optimize technical specs filter
    if (filters.technical && Object.keys(filters.technical).length > 0) {
      const techConditions = Object.entries(filters.technical).map(
        ([key, value]) => ({
          technical_specs: {
            contains: `"${key}":"${value}"`,
          },
        }),
      );
      andConditions.push({ AND: techConditions });
      optimizations.push('technical_specs_search');
    }

    // Optimize search filter
    if (filters.search) {
      const searchTerms = this.extractSearchTerms(filters.search);
      const searchConditions: any[] = [];

      searchTerms.forEach((term) => {
        searchConditions.push(
          { name: { contains: term, mode: 'insensitive' } },
          { sku: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        );
      });

      andConditions.push({ OR: searchConditions });
      optimizations.push('search_indexes');
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      if (Object.keys(where).length > 0) {
        where.AND = andConditions;
      } else if (andConditions.length === 1) {
        Object.assign(where, andConditions[0]);
      } else {
        where.AND = andConditions;
      }
    }

    // Optimized include strategy
    const include = {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      style_tags: {
        select: {
          style: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      space_tags: {
        select: {
          space: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      media: {
        where: {
          OR: [
            { is_cover: true },
            { sort_order: { lte: 3 } }, // Only first few media items
          ],
        },
        select: {
          id: true,
          file_url: true,
          media_type: true,
          is_cover: true,
          sort_order: true,
        },
        orderBy: {
          sort_order: 'asc',
        },
      },
    };

    // Optimized ordering
    const orderBy = [
      { is_published: 'desc' }, // Published products first (uses index)
      { created_at: 'desc' }, // Recent products first (uses index)
    ];

    optimizations.push('selective_includes', 'optimized_ordering');

    return {
      where,
      include,
      orderBy,
      optimizations,
    };
  }

  /**
   * Batch process large datasets
   */
  async processBatches<T, R>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<R[]>,
  ): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Analyze query performance
   */
  async analyzeQueryPerformance(
    queryName: string,
    queryFn: () => Promise<any>,
  ): Promise<{
    queryName: string;
    executionTime: number;
    resultSize: number;
    recommendations: string[];
  }> {
    const startTime = Date.now();
    const result = await queryFn();
    const executionTime = Date.now() - startTime;

    const recommendations: string[] = [];
    const resultSize = Array.isArray(result) ? result.length : 1;

    // Performance recommendations
    if (executionTime > 1000) {
      recommendations.push('Consider adding database indexes');
      recommendations.push('Consider implementing caching');
    }

    if (resultSize > 1000) {
      recommendations.push('Consider implementing pagination');
      recommendations.push(
        'Consider using cursor-based pagination for large datasets',
      );
    }

    if (executionTime > 500 && resultSize > 100) {
      recommendations.push(
        'Consider optimizing query with selective field loading',
      );
    }

    return {
      queryName,
      executionTime,
      resultSize,
      recommendations,
    };
  }

  /**
   * Get database connection pool statistics
   */
  async getConnectionPoolStats(): Promise<{
    activeConnections: number;
    idleConnections: number;
    totalConnections: number;
    recommendations: string[];
  }> {
    // This would be implemented with actual database monitoring
    // For now, return mock data
    const stats = {
      activeConnections: 5,
      idleConnections: 15,
      totalConnections: 20,
      recommendations: [] as string[],
    };

    if (stats.activeConnections / stats.totalConnections > 0.8) {
      stats.recommendations.push('Consider increasing connection pool size');
    }

    if (stats.idleConnections / stats.totalConnections > 0.9) {
      stats.recommendations.push('Consider reducing connection pool size');
    }

    return stats;
  }

  /**
   * Optimize query result serialization
   */
  optimizeResultSerialization<T>(data: T[]): T[] {
    // Remove circular references and optimize for JSON serialization
    return data.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return this.cleanObjectForSerialization(item);
      }
      return item;
    });
  }

  private extractSearchTerms(query: string): string[] {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter((term) => term.length >= 2);
  }

  private cleanObjectForSerialization(obj: any): any {
    const seen = new WeakSet();

    const clean = (item: any): any => {
      if (item === null || typeof item !== 'object') {
        return item;
      }

      if (seen.has(item)) {
        return '[Circular]';
      }

      seen.add(item);

      if (Array.isArray(item)) {
        return item.map(clean);
      }

      const cleaned: any = {};
      for (const [key, value] of Object.entries(item)) {
        // Skip internal Prisma fields
        if (key.startsWith('_') || key === '$__') {
          continue;
        }
        cleaned[key] = clean(value);
      }

      return cleaned;
    };

    return clean(obj);
  }

  /**
   * Monitor query execution time
   */
  async monitorQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    slowQueryThreshold: number = 1000,
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await queryFn();
      const executionTime = Date.now() - startTime;

      if (executionTime > slowQueryThreshold) {
        console.warn(
          `Slow query detected: ${queryName} took ${executionTime}ms`,
        );
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(
        `Query failed: ${queryName} after ${executionTime}ms`,
        error,
      );
      throw error;
    }
  }
}
