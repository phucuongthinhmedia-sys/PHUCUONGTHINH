# Performance Optimization Guide

## JSONB Indexing Strategy

This document describes the performance optimization implementation for the optimized PIM schema, focusing on JSONB indexing and query performance monitoring.

### GIN Indexes Added

The following GIN indexes have been implemented to optimize JSONB query performance:

#### General JSONB Column Indexes

- `products_technical_data_gin_idx` - Full JSONB column index for technical_data
- `products_marketing_content_gin_idx` - Full JSONB column index for marketing_content
- `products_digital_assets_gin_idx` - Full JSONB column index for digital_assets
- `products_relational_data_gin_idx` - Full JSONB column index for relational_data
- `products_ai_semantic_layer_gin_idx` - Full JSONB column index for ai_semantic_layer

#### Specific Path Indexes

- `products_technical_data_material_idx` - Index on technical_data->material
- `products_technical_data_dimensions_idx` - Index on technical_data->dimensions
- `products_marketing_content_target_spaces_idx` - Index on marketing_content->target_spaces
- `products_marketing_content_design_styles_idx` - Index on marketing_content->design_styles
- `products_relational_data_color_variants_idx` - Index on relational_data->color_variants
- `products_ai_semantic_layer_tags_idx` - Index on ai_semantic_layer->auto_generated_tags

### Query Performance Monitoring

#### QueryPerformanceService

The `QueryPerformanceService` provides comprehensive query performance monitoring:

```typescript
// Execute query with performance monitoring
const { result, metrics } = await queryPerformanceService.executeWithMonitoring(
  'SELECT * FROM products WHERE technical_data @> $1',
  [{ material: 'ceramic' }],
  { enableAnalyze: true, enableBuffers: true },
);

// Check JSONB index usage
const indexValidation = await queryPerformanceService.validateJsonbIndexUsage(
  'products',
  'technical_data',
  'containment',
  { material: 'ceramic' },
);
```

#### Performance Monitoring Endpoints

Access performance metrics via REST API:

- `GET /api/performance/metrics` - Recent query metrics
- `GET /api/performance/slow-queries` - Queries above threshold
- `GET /api/performance/pattern-stats?pattern=technical_data` - Pattern statistics
- `POST /api/performance/test-jsonb` - Test JSONB query performance
- `GET /api/performance/indexes` - Database index information

### Recommended Query Patterns

#### Efficient JSONB Queries

```sql
-- Use containment operator with GIN index
SELECT * FROM products WHERE technical_data @> '{"material": "ceramic"}';

-- Use path operator for specific fields
SELECT * FROM products WHERE technical_data->>'material' = 'ceramic';

-- Use existence operator
SELECT * FROM products WHERE technical_data ? 'material';

-- Multi-language content queries
SELECT * FROM products WHERE marketing_content->'short_description'->>'en' ILIKE '%luxury%';
```

#### Query Optimization Tips

1. **Use GIN indexes for containment queries** (`@>`, `<@`, `?`, `?&`, `?|`)
2. **Create specific path indexes** for frequently queried JSONB paths
3. **Use BTREE indexes** for range queries on extracted JSONB values
4. **Monitor query execution plans** to ensure indexes are being used
5. **Use CONCURRENTLY** when creating indexes on large tables

### Migration Instructions

To apply the JSONB indexes:

```bash
# Run the PostgreSQL migration
psql -d your_database -f backend/prisma/migrations/postgresql/002_add_jsonb_gin_indexes.sql
```

### Performance Benchmarks

Expected performance improvements with GIN indexes:

- **Containment queries**: 60-80% faster
- **Path-specific queries**: 50-70% faster
- **Existence queries**: 40-60% faster
- **Multi-language content**: 50-65% faster

### Monitoring and Maintenance

1. **Regular monitoring**: Check slow query logs and performance metrics
2. **Index maintenance**: Monitor index usage and size growth
3. **Query optimization**: Use EXPLAIN ANALYZE to validate query plans
4. **Performance testing**: Run benchmark tests after schema changes

### Troubleshooting

Common issues and solutions:

- **Indexes not being used**: Check query patterns and ensure proper syntax
- **Slow index creation**: Use CONCURRENTLY option for large tables
- **High memory usage**: Monitor GIN index size and consider partial indexes
- **Query plan issues**: Analyze with EXPLAIN (ANALYZE, BUFFERS) for detailed insights
