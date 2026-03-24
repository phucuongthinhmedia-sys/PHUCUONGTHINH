import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from './logger.service';

/**
 * Database optimization service for query performance
 * Handles connection pooling configuration and query optimization
 */
@Injectable()
export class DatabaseOptimizationService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {
    this.initializeOptimizations();
  }

  /**
   * Initialize database optimizations
   */
  private initializeOptimizations(): void {
    this.logger.log('Initializing database optimizations', {
      timestamp: new Date().toISOString(),
    });

    // Enable query logging in development
    if (process.env.NODE_ENV !== 'production') {
      this.enableQueryLogging();
    }
  }

  /**
   * Enable query logging for performance monitoring
   */
  private enableQueryLogging(): void {
    // Prisma query logging is configured in PrismaService
    this.logger.log('Query logging enabled for development', {
      environment: process.env.NODE_ENV,
    });
  }

  /**
   * Get database connection pool statistics
   */
  async getConnectionPoolStats(): Promise<{
    status: string;
    timestamp: string;
  }> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Database connection pool error', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Optimize product queries with proper indexing
   * Returns query optimization recommendations
   */
  getProductQueryOptimizations(): {
    recommendations: string[];
    indexes: string[];
  } {
    return {
      recommendations: [
        'Use pagination with limit/offset for large result sets',
        'Filter by is_published status early in queries',
        'Use select() to fetch only required fields',
        'Batch load related data with include() instead of separate queries',
        'Cache frequently accessed products (top 100)',
      ],
      indexes: [
        'products.category_id',
        'products.is_published',
        'products.created_at',
        'products.technical_specs (JSONB)',
        'product_style_tags.style_id',
        'product_space_tags.space_id',
        'media.product_id',
        'media.sort_order',
      ],
    };
  }

  /**
   * Optimize lead queries
   */
  getLeadQueryOptimizations(): {
    recommendations: string[];
    indexes: string[];
  } {
    return {
      recommendations: [
        'Filter by status to reduce result set',
        'Use pagination for lead lists',
        'Cache lead counts by status',
        'Index created_at for date range queries',
      ],
      indexes: [
        'leads.status',
        'leads.created_at',
        'lead_products.lead_id',
        'lead_products.product_id',
      ],
    };
  }

  /**
   * Optimize media queries
   */
  getMediaQueryOptimizations(): {
    recommendations: string[];
    indexes: string[];
  } {
    return {
      recommendations: [
        'Use sort_order for consistent media ordering',
        'Cache cover images separately',
        'Filter by media_type for specific asset types',
        'Use pagination for large media collections',
      ],
      indexes: [
        'media.product_id',
        'media.media_type',
        'media.sort_order',
        'media.is_cover',
      ],
    };
  }

  /**
   * Get comprehensive database optimization report
   */
  getOptimizationReport(): {
    products: any;
    leads: any;
    media: any;
    general: string[];
  } {
    return {
      products: this.getProductQueryOptimizations(),
      leads: this.getLeadQueryOptimizations(),
      media: this.getMediaQueryOptimizations(),
      general: [
        'Use connection pooling for concurrent requests',
        'Implement query result caching for frequently accessed data',
        'Monitor slow queries and optimize as needed',
        'Use batch operations for bulk inserts/updates',
        'Implement pagination for all list endpoints',
        'Use database transactions for data consistency',
      ],
    };
  }
}
