import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import {
  QueryPerformanceService,
  QueryPerformanceMetrics,
} from '../services/query-performance.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

export interface JsonbPerformanceTestRequest {
  tableName: string;
  jsonbColumn: string;
  operation: 'containment' | 'path' | 'existence';
  testValue: any;
}

export interface QueryPatternStatsResponse {
  pattern: string;
  count: number;
  avgExecutionTime: number;
  minExecutionTime: number;
  maxExecutionTime: number;
  avgRowsReturned: number;
  indexUsageRate: number;
}

@Controller('api/performance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class QueryPerformanceController {
  constructor(private readonly performanceService: QueryPerformanceService) {}

  /**
   * Get recent query performance metrics
   */
  @Get('metrics')
  async getRecentMetrics(
    @Query('limit') limit?: string,
  ): Promise<QueryPerformanceMetrics[]> {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.performanceService.getRecentMetrics(limitNum);
  }

  /**
   * Get slow queries above threshold
   */
  @Get('slow-queries')
  async getSlowQueries(
    @Query('threshold') threshold?: string,
  ): Promise<QueryPerformanceMetrics[]> {
    const thresholdMs = threshold ? parseInt(threshold, 10) : 100;
    return this.performanceService.getSlowQueries(thresholdMs);
  }

  /**
   * Get performance statistics for a query pattern
   */
  @Get('pattern-stats')
  async getQueryPatternStats(
    @Query('pattern') pattern: string,
  ): Promise<QueryPatternStatsResponse> {
    if (!pattern) {
      throw new Error('Query pattern is required');
    }

    const stats = this.performanceService.getQueryPatternStats(pattern);
    return {
      pattern,
      ...stats,
    };
  }

  /**
   * Test JSONB query performance and index usage
   */
  @Post('test-jsonb')
  async testJsonbPerformance(
    @Body() request: JsonbPerformanceTestRequest,
  ): Promise<{
    indexUsed: boolean;
    indexName?: string;
    metrics: QueryPerformanceMetrics;
    recommendations?: string[];
  }> {
    const { tableName, jsonbColumn, operation, testValue } = request;

    const result = await this.performanceService.validateJsonbIndexUsage(
      tableName,
      jsonbColumn,
      operation,
      testValue,
    );

    const recommendations: string[] = [];

    // Provide recommendations based on performance
    if (!result.indexUsed) {
      recommendations.push(
        `Consider adding a GIN index on ${tableName}.${jsonbColumn}`,
      );
    }

    if (result.metrics.executionTimeMs > 100) {
      recommendations.push(
        'Query execution time is high, consider optimizing the query or adding more specific indexes',
      );
    }

    if (
      result.metrics.rowsReturned > 1000 &&
      result.metrics.executionTimeMs > 50
    ) {
      recommendations.push(
        'Large result set with slow execution, consider adding LIMIT or more selective WHERE conditions',
      );
    }

    return {
      ...result,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  /**
   * Analyze performance of common JSONB query patterns
   */
  @Post('analyze-jsonb-patterns')
  async analyzeJsonbPatterns(): Promise<{
    patterns: Array<{
      pattern: string;
      description: string;
      metrics: QueryPerformanceMetrics;
      indexUsed: boolean;
    }>;
    summary: {
      totalPatterns: number;
      avgExecutionTime: number;
      indexUsageRate: number;
    };
  }> {
    const patterns = [
      {
        pattern: 'technical_data_material',
        description: 'Filter by technical_data.material',
        testValue: { material: 'ceramic' },
      },
      {
        pattern: 'marketing_content_target_spaces',
        description: 'Filter by marketing_content.target_spaces',
        testValue: { target_spaces: ['bathroom'] },
      },
      {
        pattern: 'relational_data_color_variants',
        description: 'Filter by relational_data.color_variants',
        testValue: { color_variants: ['white', 'black'] },
      },
      {
        pattern: 'ai_semantic_layer_tags',
        description: 'Filter by ai_semantic_layer.auto_generated_tags',
        testValue: { auto_generated_tags: ['modern', 'luxury'] },
      },
    ];

    const results: Array<{
      pattern: string;
      description: string;
      metrics: QueryPerformanceMetrics;
      indexUsed: boolean;
    }> = [];
    let totalExecutionTime = 0;
    let indexUsageCount = 0;

    for (const pattern of patterns) {
      try {
        const result = await this.performanceService.validateJsonbIndexUsage(
          'products',
          pattern.pattern.split('_')[0] + '_' + pattern.pattern.split('_')[1], // e.g., technical_data
          'containment',
          pattern.testValue,
        );

        results.push({
          pattern: pattern.pattern,
          description: pattern.description,
          metrics: result.metrics,
          indexUsed: result.indexUsed,
        });

        totalExecutionTime += result.metrics.executionTimeMs;
        if (result.indexUsed) indexUsageCount++;
      } catch (error) {
        // Skip patterns that fail (e.g., if table doesn't exist yet)
        continue;
      }
    }

    return {
      patterns: results,
      summary: {
        totalPatterns: results.length,
        avgExecutionTime:
          results.length > 0 ? totalExecutionTime / results.length : 0,
        indexUsageRate:
          results.length > 0 ? (indexUsageCount / results.length) * 100 : 0,
      },
    };
  }

  /**
   * Clear performance metrics history
   */
  @Post('clear-metrics')
  async clearMetrics(): Promise<{ message: string }> {
    this.performanceService.clearMetrics();
    return { message: 'Performance metrics cleared successfully' };
  }

  /**
   * Get database index information
   */
  @Get('indexes')
  async getDatabaseIndexes(@Query('table') tableName?: string): Promise<
    Array<{
      tableName: string;
      indexName: string;
      indexType: string;
      columns: string[];
      isUnique: boolean;
      size?: string;
    }>
  > {
    const query = tableName
      ? `
        SELECT 
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1
        ORDER BY tablename, indexname
      `
      : `
        SELECT 
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE schemaname = 'public'
        ORDER BY tablename, indexname
      `;

    const params = tableName ? [tableName] : [];
    const { result } = await this.performanceService.executeWithMonitoring(
      query,
      params,
      { enableAnalyze: false },
    );

    return result.map((row: any) => ({
      tableName: row.tablename,
      indexName: row.indexname,
      indexType: this.extractIndexType(row.indexdef),
      columns: this.extractIndexColumns(row.indexdef),
      isUnique: row.indexdef.includes('UNIQUE'),
      size: undefined, // Could be enhanced to include index size
    }));
  }

  private extractIndexType(indexDef: string): string {
    if (indexDef.includes('USING gin')) return 'GIN';
    if (indexDef.includes('USING btree')) return 'BTREE';
    if (indexDef.includes('USING hash')) return 'HASH';
    if (indexDef.includes('USING gist')) return 'GIST';
    return 'BTREE'; // Default
  }

  private extractIndexColumns(indexDef: string): string[] {
    const match = indexDef.match(/\((.*?)\)/);
    if (!match) return [];

    return match[1]
      .split(',')
      .map((col) => col.trim().replace(/"/g, ''))
      .filter((col) => col.length > 0);
  }
}
