import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface QueryPerformanceMetrics {
  query: string;
  executionTimeMs: number;
  planningTimeMs?: number;
  executionTimeMs_actual?: number;
  totalTimeMs: number;
  rowsReturned: number;
  indexesUsed: string[];
  queryPlan?: any;
  timestamp: Date;
}

export interface QueryPlanNode {
  'Node Type': string;
  'Relation Name'?: string;
  'Index Name'?: string;
  'Startup Cost': number;
  'Total Cost': number;
  'Plan Rows': number;
  'Plan Width': number;
  'Actual Startup Time'?: number;
  'Actual Total Time'?: number;
  'Actual Rows'?: number;
  Plans?: QueryPlanNode[];
}

@Injectable()
export class QueryPerformanceService {
  private readonly logger = new Logger(QueryPerformanceService.name);
  private performanceMetrics: QueryPerformanceMetrics[] = [];
  private readonly maxMetricsHistory = 1000;

  constructor(private prisma: PrismaService) {}

  /**
   * Execute a query with performance monitoring
   */
  async executeWithMonitoring<T>(
    query: string,
    params: any[] = [],
    options: {
      enableAnalyze?: boolean;
      enableBuffers?: boolean;
      logSlowQueries?: boolean;
      slowQueryThresholdMs?: number;
    } = {},
  ): Promise<{ result: T[]; metrics: QueryPerformanceMetrics }> {
    const {
      enableAnalyze = true,
      enableBuffers = false,
      logSlowQueries = true,
      slowQueryThresholdMs = 100,
    } = options;

    const startTime = Date.now();
    let result: T[] = [];
    let queryPlan: any = null;
    let planningTime = 0;
    let executionTime = 0;

    try {
      // Get query execution plan if enabled
      if (enableAnalyze) {
        const explainQuery = `EXPLAIN (ANALYZE true, BUFFERS ${enableBuffers}, FORMAT JSON) ${query}`;
        const planResult = (await this.prisma.$queryRawUnsafe(
          explainQuery,
          ...params,
        )) as any[];
        queryPlan = planResult[0]?.['QUERY PLAN']?.[0];

        if (queryPlan) {
          planningTime = queryPlan['Planning Time'] || 0;
          executionTime = queryPlan['Execution Time'] || 0;
        }
      }

      // Execute the actual query
      result = await this.prisma.$queryRawUnsafe(query, ...params);

      const totalTime = Date.now() - startTime;
      const indexesUsed = this.extractIndexesFromPlan(queryPlan);

      const metrics: QueryPerformanceMetrics = {
        query: this.sanitizeQuery(query),
        executionTimeMs: executionTime || totalTime,
        planningTimeMs: planningTime,
        executionTimeMs_actual: executionTime,
        totalTimeMs: totalTime,
        rowsReturned: Array.isArray(result) ? result.length : 0,
        indexesUsed,
        queryPlan: enableAnalyze ? queryPlan : undefined,
        timestamp: new Date(),
      };

      // Log slow queries
      if (logSlowQueries && totalTime > slowQueryThresholdMs) {
        this.logger.warn(
          `Slow query detected (${totalTime}ms): ${this.sanitizeQuery(query)}`,
        );
        this.logger.debug('Query plan:', JSON.stringify(queryPlan, null, 2));
      }

      // Store metrics
      this.storeMetrics(metrics);

      return { result, metrics };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      this.logger.error(
        `Query execution failed (${totalTime}ms): ${this.sanitizeQuery(query)}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Analyze query performance for JSONB operations
   */
  async analyzeJsonbQueryPerformance(
    tableName: string,
    jsonbColumn: string,
    jsonbPath: string,
    filterValue: any,
  ): Promise<QueryPerformanceMetrics> {
    const query = `
      SELECT * FROM "${tableName}" 
      WHERE "${jsonbColumn}"->>'${jsonbPath}' = $1
    `;

    const { metrics } = await this.executeWithMonitoring(query, [filterValue], {
      enableAnalyze: true,
      enableBuffers: true,
    });

    return metrics;
  }

  /**
   * Check if GIN indexes are being used for JSONB queries
   */
  async validateJsonbIndexUsage(
    tableName: string,
    jsonbColumn: string,
    operation: 'containment' | 'path' | 'existence',
    testValue: any,
  ): Promise<{
    indexUsed: boolean;
    indexName?: string;
    metrics: QueryPerformanceMetrics;
  }> {
    let query: string;
    let params: any[];

    switch (operation) {
      case 'containment':
        query = `SELECT * FROM "${tableName}" WHERE "${jsonbColumn}" @> $1`;
        params = [JSON.stringify(testValue)];
        break;
      case 'path':
        query = `SELECT * FROM "${tableName}" WHERE "${jsonbColumn}"->>'${Object.keys(testValue)[0]}' = $1`;
        params = [Object.values(testValue)[0]];
        break;
      case 'existence':
        query = `SELECT * FROM "${tableName}" WHERE "${jsonbColumn}" ? $1`;
        params = [Object.keys(testValue)[0]];
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    const { metrics } = await this.executeWithMonitoring(query, params, {
      enableAnalyze: true,
    });

    const indexUsed = metrics.indexesUsed.length > 0;
    const indexName =
      metrics.indexesUsed.find((idx) => idx.includes('gin')) ||
      metrics.indexesUsed[0];

    return {
      indexUsed,
      indexName,
      metrics,
    };
  }

  /**
   * Get performance statistics for a specific query pattern
   */
  getQueryPatternStats(queryPattern: string): {
    count: number;
    avgExecutionTime: number;
    minExecutionTime: number;
    maxExecutionTime: number;
    avgRowsReturned: number;
    indexUsageRate: number;
  } {
    const matchingMetrics = this.performanceMetrics.filter((m) =>
      m.query.includes(queryPattern),
    );

    if (matchingMetrics.length === 0) {
      return {
        count: 0,
        avgExecutionTime: 0,
        minExecutionTime: 0,
        maxExecutionTime: 0,
        avgRowsReturned: 0,
        indexUsageRate: 0,
      };
    }

    const executionTimes = matchingMetrics.map((m) => m.executionTimeMs);
    const rowCounts = matchingMetrics.map((m) => m.rowsReturned);
    const indexUsageCount = matchingMetrics.filter(
      (m) => m.indexesUsed.length > 0,
    ).length;

    return {
      count: matchingMetrics.length,
      avgExecutionTime:
        executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length,
      minExecutionTime: Math.min(...executionTimes),
      maxExecutionTime: Math.max(...executionTimes),
      avgRowsReturned: rowCounts.reduce((a, b) => a + b, 0) / rowCounts.length,
      indexUsageRate: (indexUsageCount / matchingMetrics.length) * 100,
    };
  }

  /**
   * Get recent performance metrics
   */
  getRecentMetrics(limit: number = 50): QueryPerformanceMetrics[] {
    return this.performanceMetrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get slow queries above threshold
   */
  getSlowQueries(thresholdMs: number = 100): QueryPerformanceMetrics[] {
    return this.performanceMetrics
      .filter((m) => m.executionTimeMs > thresholdMs)
      .sort((a, b) => b.executionTimeMs - a.executionTimeMs);
  }

  /**
   * Clear performance metrics history
   */
  clearMetrics(): void {
    this.performanceMetrics = [];
  }

  private extractIndexesFromPlan(queryPlan: any): string[] {
    if (!queryPlan) return [];

    const indexes: string[] = [];

    const extractFromNode = (node: QueryPlanNode) => {
      if (node['Index Name']) {
        indexes.push(node['Index Name']);
      }
      if (node.Plans) {
        node.Plans.forEach(extractFromNode);
      }
    };

    if (queryPlan.Plan) {
      extractFromNode(queryPlan.Plan);
    }

    return Array.from(new Set(indexes)); // Remove duplicates
  }

  private sanitizeQuery(query: string): string {
    // Remove sensitive data and normalize whitespace
    return query
      .replace(/\$\d+/g, '?') // Replace parameter placeholders
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 200); // Limit length
  }

  private storeMetrics(metrics: QueryPerformanceMetrics): void {
    this.performanceMetrics.push(metrics);

    // Keep only recent metrics to prevent memory issues
    if (this.performanceMetrics.length > this.maxMetricsHistory) {
      this.performanceMetrics = this.performanceMetrics.slice(
        -this.maxMetricsHistory,
      );
    }
  }
}
