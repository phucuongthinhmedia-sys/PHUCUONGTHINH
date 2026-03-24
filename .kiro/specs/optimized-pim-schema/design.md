# Design Document

## Overview

Thiết kế database schema tối ưu cho hệ thống PIM (Product Information Management) sử dụng kiến trúc Hybrid Relational + JSONB. Schema được thiết kế để cân bằng giữa hiệu suất tìm kiếm (relational columns với indexes) và tính linh hoạt (JSONB columns cho dữ liệu có cấu trúc thay đổi).

## Architecture

### Hybrid Relational + JSONB Strategy

**Fast Search Columns (Relational):**

- Các trường được sử dụng thường xuyên cho filtering, sorting, và joins
- Có indexes để tối ưu hiệu suất query
- Bao gồm: id, sku, brand_id, category_id, status, base_price, created_at, updated_at

**Flexible Data Columns (JSONB):**

- Dữ liệu có cấu trúc thay đổi theo loại sản phẩm
- Hỗ trợ nested structures và flexible schema
- Bao gồm: technical_data, marketing_content, digital_assets, relational_data, ai_semantic_layer

### Database Provider Strategy

**Current State:** SQLite (development)
**Target State:** PostgreSQL (production) với JSONB support

## Components and Interfaces

### Core Models

#### Product Model

```prisma
model Product {
  // Fast Search Columns (Relational)
  id                String   @id @default(uuid())
  sku              String   @unique
  name             String
  brand_id         String
  category_id      String
  sub_category_id  String?
  collection_id    String?
  designer_id      String?
  status           ProductStatus @default(DRAFT)
  base_price_vnd   Int?
  stock_status     StockStatus @default(OUT_OF_STOCK)
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  // Flexible Data Columns (JSONB)
  technical_data     Json?
  marketing_content  Json?
  digital_assets     Json?
  relational_data    Json?
  ai_semantic_layer  Json?

  // Relations
  brand            Brand     @relation(fields: [brand_id], references: [id])
  category         Category  @relation(fields: [category_id], references: [id])
  sub_category     SubCategory? @relation(fields: [sub_category_id], references: [id])
  collection       Collection? @relation(fields: [collection_id], references: [id])
  designer         Designer? @relation(fields: [designer_id], references: [id])

  // Indexes for Fast Search
  @@index([sku])
  @@index([brand_id])
  @@index([category_id])
  @@index([status])
  @@index([created_at])
  @@index([name]) // For text search
  @@map("products")
}
```

#### Supporting Models

```prisma
model Brand {
  id         String    @id @default(uuid())
  name       String    @unique
  slug       String    @unique
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt

  products   Product[]

  @@map("brands")
}

model Category {
  id         String    @id @default(uuid())
  name       String
  slug       String    @unique
  parent_id  String?
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt

  parent       Category?     @relation("CategoryHierarchy", fields: [parent_id], references: [id])
  children     Category[]    @relation("CategoryHierarchy")
  products     Product[]
  sub_categories SubCategory[]

  @@index([parent_id])
  @@map("categories")
}

model SubCategory {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  category_id String
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  category    Category  @relation(fields: [category_id], references: [id])
  products    Product[]

  @@index([category_id])
  @@map("sub_categories")
}

model Collection {
  id         String    @id @default(uuid())
  name       String    @unique
  slug       String    @unique
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt

  products   Product[]

  @@map("collections")
}

model Designer {
  id         String    @id @default(uuid())
  name       String    @unique
  slug       String    @unique
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt

  products   Product[]

  @@map("designers")
}
```

#### Enums

```prisma
enum ProductStatus {
  DRAFT
  ACTIVE
  INACTIVE
  DISCONTINUED
}

enum StockStatus {
  IN_STOCK
  LOW_STOCK
  OUT_OF_STOCK
  DISCONTINUED
}
```

## Data Models

### JSONB Structure Definitions

#### Technical Data Structure

```typescript
interface TechnicalData {
  dimensions?: {
    width_mm?: number;
    length_mm?: number;
    thickness_mm?: number;
    weight_kg?: number;
  };
  material?: string;
  performance_specs?: {
    slip_resistance?: string;
    water_absorption?: number;
    frost_resistance?: boolean;
    fire_rating?: string;
    wear_rating?: string;
  };
  installation?: {
    method?: string[];
    tools_required?: string[];
    difficulty_level?: "easy" | "medium" | "hard";
  };
  certifications?: string[];
  warranty_years?: number;
}
```

#### Marketing Content Structure

```typescript
interface MarketingContent {
  short_description?: {
    [language: string]: string; // Multi-language support
  };
  long_description?: {
    [language: string]: string;
  };
  target_spaces?: string[];
  design_styles?: string[];
  key_features?: {
    [language: string]: string[];
  };
  care_instructions?: {
    [language: string]: string;
  };
  seo_keywords?: {
    [language: string]: string[];
  };
}
```

#### Digital Assets Structure

```typescript
interface DigitalAssets {
  cover_image?: string;
  lifestyle_images?: string[];
  technical_drawings?: string[];
  architect_files?: {
    seamless_texture_map?: string;
    normal_map?: string;
    displacement_map?: string;
    cad_files?: string[];
  };
  videos?: {
    installation_guide?: string;
    product_showcase?: string;
  };
  documents?: {
    technical_sheet?: string;
    installation_guide?: string;
    care_guide?: string;
  };
}
```

#### Relational Data Structure

```typescript
interface RelationalData {
  matching_grouts?: string[]; // SKUs
  similar_alternatives?: string[]; // SKUs
  complementary_products?: string[]; // SKUs
  required_accessories?: string[]; // SKUs
  color_variants?: string[]; // SKUs
  size_variants?: string[]; // SKUs
}
```

#### AI Semantic Layer Structure

```typescript
interface AISemanticLayer {
  semantic_text?: {
    [language: string]: string;
  };
  embedding_vector_id?: string;
  auto_generated_tags?: string[];
  similarity_score?: number;
  content_quality_score?: number;
  last_ai_update?: string; // ISO date
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property-Based Testing Analysis

Trước khi viết các correctness properties, tôi cần phân tích các acceptance criteria để xác định tính khả thi của việc testing:

**Acceptance Criteria Testing Prework:**

1.1. THE PIM_System SHALL separate fast search fields into relational columns with proper indexes
Thoughts: Đây là yêu cầu về cấu trúc schema, có thể test bằng cách kiểm tra metadata của database để đảm bảo các trường được định nghĩa đúng kiểu và có indexes
Testable: yes - property

1.2. THE PIM_System SHALL store flexible data fields as JSONB columns for schema flexibility  
 Thoughts: Có thể test bằng cách kiểm tra kiểu dữ liệu của các cột và khả năng lưu trữ/truy xuất JSON structures khác nhau
Testable: yes - property

1.3. THE PIM_System SHALL use UUID for all primary keys
Thoughts: Có thể test bằng cách kiểm tra format của tất cả primary keys trong database
Testable: yes - property

2.1. WHEN filtering by product identification fields, THE PIM_System SHALL use indexed relational columns
Thoughts: Có thể test bằng cách kiểm tra query execution plans để đảm bảo indexes được sử dụng
Testable: yes - property

3.1. THE PIM_System SHALL store technical_data as JSONB for flexible technical specifications
Thoughts: Có thể test bằng cách lưu trữ và truy xuất các cấu trúc technical_data khác nhau
Testable: yes - property

4.1. THE PIM_System SHALL construct the exact Golden Record JSON structure from database
Thoughts: Đây là round-trip property - lưu trữ dữ liệu vào database rồi construct lại Golden Record phải giống với input ban đầu
Testable: yes - property

5.1. THE PIM_System SHALL create indexes on frequently filtered fields
Thoughts: Có thể test bằng cách kiểm tra metadata của database để đảm bảo indexes tồn tại trên các trường được chỉ định
Testable: yes - property

6.1. THE PIM_System SHALL enforce foreign key constraints for relational data
Thoughts: Có thể test bằng cách thử insert dữ liệu vi phạm foreign key constraints và đảm bảo database reject
Testable: yes - property

7.1. THE PIM_System SHALL support schema evolution without breaking existing data
Thoughts: Có thể test bằng cách thêm fields mới vào JSONB và đảm bảo dữ liệu cũ vẫn accessible
Testable: yes - property

8.1. THE PIM_System SHALL support multiple languages in marketing_content JSONB
Thoughts: Có thể test bằng cách lưu trữ và truy xuất nội dung đa ngôn ngữ
Testable: yes - property

### Property Reflection

Sau khi phân tích, tôi thấy có một số properties có thể được kết hợp:

- Properties 1.1, 1.2, 1.3 có thể kết hợp thành một property về schema structure compliance
- Properties 3.1, 8.1 có thể kết hợp thành một property về JSONB flexibility
- Properties 5.1, 2.1 có thể kết hợp thành một property về indexing effectiveness

### Correctness Properties

**Property 1: Schema Structure Compliance**
_For any_ database schema generated from the Prisma model, all primary keys should be UUIDs, fast search fields should be relational columns with proper indexes, and flexible data fields should be JSONB columns
**Validates: Requirements 1.1, 1.2, 1.3, 5.1**

**Property 2: JSONB Flexibility and Multi-language Support**
_For any_ valid technical data or marketing content structure, the system should be able to store and retrieve it from JSONB columns while supporting multiple languages
**Validates: Requirements 3.1, 8.1**

**Property 3: Golden Record Round-trip Consistency**
_For any_ valid product data, storing it in the database and then constructing the Golden Record JSON should produce an equivalent structure to the original input
**Validates: Requirements 4.1**

**Property 4: Query Performance with Indexes**
_For any_ query filtering by indexed relational columns (sku, brand_id, category_id, status), the query execution plan should utilize the appropriate indexes
**Validates: Requirements 2.1, 5.1**

**Property 5: Referential Integrity Enforcement**
_For any_ attempt to create invalid foreign key relationships, the database should reject the operation and maintain data consistency
**Validates: Requirements 6.1**

**Property 6: Schema Evolution Backward Compatibility**
_For any_ existing JSONB data, adding new optional fields to the structure should not break the ability to read and process existing records
**Validates: Requirements 7.1**

## Error Handling

### Database Connection Errors

- Connection timeout handling
- Retry logic for transient failures
- Graceful degradation when database unavailable

### Data Validation Errors

- JSONB structure validation
- Foreign key constraint violations
- Unique constraint violations
- Data type mismatches

### Migration Errors

- Schema evolution conflicts
- Data migration failures
- Index creation failures
- Rollback strategies

## Testing Strategy

### Dual Testing Approach

**Unit Tests:**

- Schema validation tests
- JSONB structure validation
- Foreign key constraint tests
- Index existence verification
- Data type validation

**Property-Based Tests:**

- Schema compliance across random valid inputs
- JSONB flexibility with various data structures
- Golden Record round-trip consistency
- Query performance verification
- Referential integrity enforcement
- Backward compatibility testing

### Property Test Configuration

- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: **Feature: optimized-pim-schema, Property {number}: {property_text}**

### Database Testing Strategy

**Test Database Setup:**

- Use PostgreSQL for property tests (production-like environment)
- Use SQLite for unit tests (faster execution)
- Automated test data generation for various product types
- Migration testing with schema evolution scenarios

**Performance Testing:**

- Query execution plan analysis
- Index usage verification
- JSONB query performance benchmarks
- Concurrent access testing
