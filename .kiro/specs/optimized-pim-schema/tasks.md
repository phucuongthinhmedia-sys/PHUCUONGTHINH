# Implementation Plan: Optimized PIM Schema

## Overview

Triển khai database schema tối ưu cho hệ thống PIM sử dụng kiến trúc Hybrid Relational + JSONB. Implementation sẽ migration từ SQLite hiện tại sang PostgreSQL với schema mới, đồng thời đảm bảo backward compatibility và data integrity.

## Tasks

- [x] 1. Setup PostgreSQL and Update Prisma Configuration
  - Install PostgreSQL dependencies (@prisma/client, pg, @types/pg)
  - Update prisma.config.ts to support PostgreSQL
  - Configure environment variables for PostgreSQL connection
  - _Requirements: 1.1, 1.2_

- [x] 2. Create New Optimized Prisma Schema
  - [x] 2.1 Define core models with hybrid architecture
    - Create Product model with relational fast-search columns
    - Add JSONB columns for flexible data (technical_data, marketing_content, etc.)
    - Define proper indexes for performance optimization
    - _Requirements: 1.1, 1.2, 1.3, 5.1_

  - [ ] 2.2 Write property test for schema structure compliance
    - **Property 1: Schema Structure Compliance**
    - **Validates: Requirements 1.1, 1.2, 1.3, 5.1**

  - [x] 2.3 Create supporting models (Brand, Category, SubCategory, Collection, Designer)
    - Define relational models with proper foreign keys
    - Add appropriate indexes for performance
    - _Requirements: 6.1_

  - [x] 2.4 Write property test for referential integrity
    - **Property 5: Referential Integrity Enforcement**
    - **Validates: Requirements 6.1**

- [x] 3. Define TypeScript Interfaces for JSONB Structures
  - [x] 3.1 Create TechnicalData interface
    - Define dimensions, material, performance_specs structures
    - Support flexible technical specifications
    - _Requirements: 3.1_

  - [x] 3.2 Create MarketingContent interface with multi-language support
    - Define multi-language description structures
    - Support target_spaces, design_styles, key_features
    - _Requirements: 3.1, 8.1_

  - [x] 3.3 Create DigitalAssets, RelationalData, AISemanticLayer interfaces
    - Define flexible asset management structures
    - Support product relationships and AI metadata
    - _Requirements: 3.1_

  - [x] 3.4 Write property test for JSONB flexibility
    - **Property 2: JSONB Flexibility and Multi-language Support**
    - **Validates: Requirements 3.1, 8.1**

- [ ] 4. Checkpoint - Ensure schema validation passes
  - Ensure all tests pass, ask the user if questions arise.

- [-] 5. Create Database Migration Strategy
  - [-] 5.1 Generate initial PostgreSQL migration
    - Create migration from current SQLite schema to new PostgreSQL schema
    - Ensure proper data type mappings
    - _Requirements: 7.1_

  - [ ] 5.2 Create data migration scripts
    - Migrate existing product data to new schema structure
    - Transform current data to fit JSONB structures
    - Preserve data integrity during migration
    - _Requirements: 7.1_

  - [ ]\* 5.3 Write property test for schema evolution
    - **Property 6: Schema Evolution Backward Compatibility**
    - **Validates: Requirements 7.1**

- [ ] 6. Update Service Layer for Golden Record Construction
  - [ ] 6.1 Update ProductsService to construct Golden Record JSON
    - Implement method to combine relational and JSONB data
    - Ensure exact Golden Record structure is returned
    - _Requirements: 4.1_

  - [ ]\* 6.2 Write property test for Golden Record consistency
    - **Property 3: Golden Record Round-trip Consistency**
    - **Validates: Requirements 4.1**

  - [ ] 6.3 Update CombinedFilterService for hybrid querying
    - Implement efficient querying across relational and JSONB fields
    - Optimize performance for complex filters
    - _Requirements: 2.1, 5.1_

  - [ ]\* 6.4 Write property test for query performance
    - **Property 4: Query Performance with Indexes**
    - **Validates: Requirements 2.1, 5.1**

- [x] 7. Update API Controllers and DTOs
  - [x] 7.1 Update ProductsController to handle new schema
    - Modify endpoints to work with new data structures
    - Ensure backward compatibility for existing API consumers
    - _Requirements: 4.1_

  - [x] 7.2 Create/Update DTOs for new JSONB structures
    - Define validation schemas for JSONB data
    - Implement proper error handling for invalid structures
    - _Requirements: 3.1_

  - [x]\* 7.3 Write integration tests for API endpoints
    - Test complete flow from API to database
    - Validate Golden Record response structure
    - _Requirements: 4.1_

- [x] 8. Performance Optimization and Indexing
  - [x] 8.1 Implement JSONB-specific indexes where needed
    - Add GIN indexes for frequently queried JSONB paths
    - Optimize query performance for complex JSONB queries
    - _Requirements: 5.1_

  - [x] 8.2 Add query performance monitoring
    - Implement query execution plan analysis
    - Add performance metrics for critical queries
    - _Requirements: 5.1_

  - [ ]\* 8.3 Write performance benchmark tests
    - Test query performance with large datasets
    - Validate index usage in query execution plans
    - _Requirements: 5.1_

- [ ] 9. Data Seeding and Testing Data
  - [ ] 9.1 Update seed script for new schema
    - Create comprehensive test data covering various product types
    - Include examples of all JSONB structure variations
    - _Requirements: 3.1, 8.1_

  - [ ] 9.2 Create data generators for property tests
    - Implement generators for valid JSONB structures
    - Support multi-language content generation
    - _Requirements: 3.1, 8.1_

- [ ] 10. Documentation and Migration Guide
  - [ ] 10.1 Create database migration documentation
    - Document migration process from SQLite to PostgreSQL
    - Include rollback procedures and troubleshooting
    - _Requirements: 7.1_

  - [ ] 10.2 Update API documentation
    - Document new Golden Record structure
    - Update endpoint documentation for new schema
    - _Requirements: 4.1_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Migration strategy ensures zero-downtime deployment
- Performance optimization is critical for production readiness
