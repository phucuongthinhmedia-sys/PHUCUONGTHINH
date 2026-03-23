import { Injectable, Logger } from '@nestjs/common';

export interface JsonbQueryOptimization {
  originalQuery: string;
  optimizedQuery: string;
  indexRecommendations: string[];
  estimatedPerformanceGain: number;
}

@Injectable()
export class JsonbQueryOptimizerService {
  private readonly logger = new Logger(JsonbQueryOptimizerService.name);

  /**
   * Optimize JSONB queries for better performance
   */
  optimizeJsonbQuery(
    tableName: string,
    jsonbColumn: string,
    operation: string,
    path?: string,
  ): JsonbQueryOptimization {
    const recommendations: string[] = [];
    let optimizedQuery = '';
    let estimatedGain = 0;

    // Analyze and optimize based on operation type
    switch (operation.toLowerCase()) {
      case 'containment':
        optimizedQuery = this.optimizeContainmentQuery(tableName, jsonbColumn);
        recommendations.push(
          `CREATE INDEX CONCURRENTLY ${tableName}_${jsonbColumn}_gin_idx ON ${tableName} USING GIN (${jsonbColumn});`,
        );
        estimatedGain = 70;
        break;

      case 'path_lookup':
        if (path) {
          optimizedQuery = this.optimizePathQuery(tableName, jsonbColumn, path);
          recommendations.push(
            `CREATE INDEX CONCURRENTLY ${tableName}_${jsonbColumn}_${path}_gin_idx ON ${tableName} USING GIN ((${jsonbColumn}->'${path}'));`,
          );
          estimatedGain = 60;
        }
        break;

      case 'existence':
        optimizedQuery = this.optimizeExistenceQuery(
          tableName,
          jsonbColumn,
          path,
        );
        recommendations.push(
          `CREATE INDEX CONCURRENTLY ${tableName}_${jsonbColumn}_gin_idx ON ${tableName} USING GIN (${jsonbColumn});`,
        );
        estimatedGain = 50;
        break;
    }

    return {
      originalQuery: `SELECT * FROM ${tableName} WHERE ${jsonbColumn}...`,
      optimizedQuery,
      indexRecommendations: recommendations,
      estimatedPerformanceGain: estimatedGain,
    };
  }

  private optimizeContainmentQuery(
    tableName: string,
    jsonbColumn: string,
  ): string {
    return `SELECT * FROM ${tableName} WHERE ${jsonbColumn} @> $1`;
  }

  private optimizePathQuery(
    tableName: string,
    jsonbColumn: string,
    path: string,
  ): string {
    return `SELECT * FROM ${tableName} WHERE ${jsonbColumn}->>'${path}' = $1`;
  }

  private optimizeExistenceQuery(
    tableName: string,
    jsonbColumn: string,
    path?: string,
  ): string {
    if (path) {
      return `SELECT * FROM ${tableName} WHERE ${jsonbColumn} ? '${path}'`;
    }
    return `SELECT * FROM ${tableName} WHERE ${jsonbColumn} IS NOT NULL`;
  }
}
