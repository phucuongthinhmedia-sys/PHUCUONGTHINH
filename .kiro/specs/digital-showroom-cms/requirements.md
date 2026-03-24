# Requirements Document

## Introduction

This document specifies the requirements for a Digital Showroom and Custom CMS system designed for luxury building materials (Tiles, Sanitary Ware, Kitchen Appliances). The system targets three distinct user groups: homeowners seeking lifestyle inspiration, architects/designers requiring technical specifications and downloadable assets, and contractors needing inventory and wholesale capabilities. The platform emphasizes premium visual experiences with high-resolution media, lead generation through appointment booking and quote requests, and flexible product attribute management to accommodate diverse material specifications.

## Glossary

- **Digital_Showroom**: The client-facing Next.js application providing product browsing, filtering, and lead generation
- **Custom_CMS**: The administrative dashboard for managing products, media, leads, and system content
- **Backend_API**: The NestJS-based REST API handling business logic and data operations
- **Product**: A building material item (tile, sanitary ware, or kitchen appliance) with associated attributes and media
- **Lead**: A potential customer inquiry captured through appointment booking or quote request forms
- **Media_Asset**: Digital content associated with products (images, videos, 3D files, PDFs)
- **Technical_Spec**: Product-specific attributes stored in flexible JSONB format
- **Style_Tag**: Mood/aesthetic classification (e.g., Minimalist, Indochine) for inspiration-based filtering
- **Space_Tag**: Room/location classification (e.g., Master Bath, Outdoor) for context-based filtering
- **Filter_Tab**: One of two filtering interfaces - Inspiration (mood/style-based) or Technical (specification-based)
- **Admin_User**: Authenticated staff member with access to the Custom_CMS
- **CDN**: Content Delivery Network for optimized media delivery (Cloudflare)
- **S3_Bucket**: AWS storage service for media assets

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As an admin user, I want to securely access the Custom CMS, so that I can manage products and leads without unauthorized access.

#### Acceptance Criteria

1. WHEN an admin user submits valid credentials, THE Authentication_System SHALL generate a JWT token with user identity and role information
2. WHEN an admin user submits invalid credentials, THE Authentication_System SHALL reject the login attempt and return an error message
3. WHEN a JWT token expires, THE Authentication_System SHALL require re-authentication before allowing further CMS access
4. WHEN an API request includes a valid JWT token, THE Backend_API SHALL authorize the request and process it
5. WHEN an API request lacks a valid JWT token, THE Backend_API SHALL reject the request with a 401 unauthorized status

### Requirement 2: Dynamic Product Attribute Management

**User Story:** As an admin user, I want to define product-specific technical specifications without rigid schema constraints, so that I can accommodate diverse material types with varying attributes.

#### Acceptance Criteria

1. WHEN creating a tile product, THE Product_Management_System SHALL store attributes like thickness, slip resistance, and format in a JSONB field
2. WHEN creating a sanitary ware product, THE Product_Management_System SHALL store attributes like cut-out dimensions and material composition in a JSONB field
3. WHEN creating a kitchen appliance product, THE Product_Management_System SHALL store attributes like power rating and dimensions in a JSONB field
4. WHEN querying products by technical specifications, THE Backend_API SHALL filter using JSONB field queries with proper indexing
5. THE Product_Management_System SHALL validate that required base fields (name, category, SKU) are present for all products

### Requirement 3: Dual-Tab Filtering System

**User Story:** As a homeowner, I want to filter products by mood and style, so that I can find materials that match my aesthetic vision.

**User Story:** As an architect, I want to filter products by technical specifications, so that I can find materials meeting project requirements.

#### Acceptance Criteria

1. WHEN a user selects the Inspiration tab, THE Digital_Showroom SHALL display filters for Style (Minimalist, Indochine, etc.), Space (Master Bath, Outdoor, etc.), and Touch/Feel attributes
2. WHEN a user selects the Technical tab, THE Digital_Showroom SHALL display filters for Format (Slab, Mosaic, etc.), Color palette, Material type, and Slip-rating
3. WHEN a user applies Inspiration filters, THE Digital_Showroom SHALL return products matching any selected Style tags AND any selected Space tags
4. WHEN a user applies Technical filters, THE Digital_Showroom SHALL return products matching the selected technical specification criteria from JSONB fields
5. WHEN a user switches between tabs, THE Digital_Showroom SHALL preserve the current product result set until new filters are applied

### Requirement 4: Multi-Asset Media Management

**User Story:** As an admin user, I want to upload and organize multiple media types per product, so that different user types can access appropriate visual and technical assets.

#### Acceptance Criteria

1. WHEN uploading media for a product, THE Media_Management_System SHALL support lifestyle photos, cut-out photos, macro texture videos, 3D map files, and PDF catalogues
2. WHEN uploading media files, THE Media_Management_System SHALL store files in S3_Bucket and record metadata in the database
3. WHEN setting a cover image, THE Media_Management_System SHALL mark exactly one media asset per product as the primary display image
4. WHEN ordering media assets, THE Media_Management_System SHALL maintain a sort_order field to control display sequence
5. WHEN a product has multiple media assets, THE Digital_Showroom SHALL serve files through CDN for optimized delivery
6. THE Media_Management_System SHALL store media type classification (lifestyle, cutout, video, 3d_file, pdf) for each asset

### Requirement 5: Lead Capture and Management

**User Story:** As a homeowner, I want to book a showroom appointment, so that I can view products in person.

**User Story:** As an architect, I want to request a quote, so that I can obtain pricing for project materials.

**User Story:** As an admin user, I want to track and manage leads, so that I can follow up with potential customers.

#### Acceptance Criteria

1. WHEN a user submits an appointment booking form, THE Digital_Showroom SHALL capture name, phone, email, project code, preferred date, and inquiry type
2. WHEN a user submits a quote request form, THE Digital_Showroom SHALL capture name, phone, email, project details, and selected product references
3. WHEN a lead is created, THE Lead_Management_System SHALL assign an initial status of "New"
4. WHEN an admin user views leads in the Custom_CMS, THE Lead_Management_System SHALL display all leads with filtering by status (New, Contacted, Converted)
5. WHEN an admin user updates a lead status, THE Lead_Management_System SHALL record the status change with timestamp
6. THE Lead_Management_System SHALL validate that required contact fields (name, phone or email) are present before creating a lead

### Requirement 6: Product Categorization and Taxonomy

**User Story:** As an admin user, I want to organize products into categories, so that users can browse by material type.

#### Acceptance Criteria

1. WHEN creating a category, THE Category_Management_System SHALL store category name, slug, and optional parent category reference
2. WHEN assigning a product to a category, THE Product_Management_System SHALL enforce that exactly one primary category is assigned
3. WHEN querying products by category, THE Backend_API SHALL return all products within that category and its subcategories
4. THE Category_Management_System SHALL support hierarchical category structures (e.g., Tiles > Floor Tiles > Porcelain)
5. WHEN deleting a category with assigned products, THE Category_Management_System SHALL prevent deletion or require reassignment

### Requirement 7: Style and Space Tag Management

**User Story:** As an admin user, I want to tag products with styles and spaces, so that users can filter by inspiration criteria.

#### Acceptance Criteria

1. WHEN creating style tags, THE Tag_Management_System SHALL store unique style names (Minimalist, Indochine, Industrial, etc.)
2. WHEN creating space tags, THE Tag_Management_System SHALL store unique space names (Master Bath, Kitchen, Outdoor, etc.)
3. WHEN assigning tags to products, THE Product_Management_System SHALL support many-to-many relationships between products and style tags
4. WHEN assigning tags to products, THE Product_Management_System SHALL support many-to-many relationships between products and space tags
5. WHEN querying products by tags, THE Backend_API SHALL return products matching any of the selected tags within each tag type

### Requirement 8: High-Performance Product Filtering

**User Story:** As a user, I want fast filter responses, so that I can browse products without delays.

#### Acceptance Criteria

1. WHEN querying products with multiple filters, THE Backend_API SHALL return results within 500ms for datasets up to 10,000 products
2. THE Database_Schema SHALL include indexes on frequently queried fields (category_id, created_at, is_published)
3. THE Database_Schema SHALL include GIN indexes on JSONB technical_specs fields for efficient filtering
4. THE Database_Schema SHALL include indexes on many-to-many relationship tables for style and space tags
5. WHEN pagination is requested, THE Backend_API SHALL support limit and offset parameters with efficient query execution

### Requirement 9: Asset Download Functionality

**User Story:** As an architect, I want to download 3D map files and CAD files, so that I can integrate materials into project designs.

**User Story:** As a designer, I want to download PDF catalogues, so that I can review complete product specifications offline.

#### Acceptance Criteria

1. WHEN a user requests a downloadable asset, THE Digital_Showroom SHALL generate a pre-signed S3 URL with expiration
2. WHEN a user downloads a 3D file, THE Media_Management_System SHALL track the download event for analytics
3. WHEN a user downloads a PDF catalogue, THE Media_Management_System SHALL serve the file through CDN
4. THE Media_Management_System SHALL classify downloadable assets separately from display media (images/videos)
5. WHEN multiple downloadable files exist for a product, THE Digital_Showroom SHALL display all available downloads with file type and size information

### Requirement 10: Product Publishing Workflow

**User Story:** As an admin user, I want to control product visibility, so that I can prepare products before making them public.

#### Acceptance Criteria

1. WHEN creating a product, THE Product_Management_System SHALL default the product to unpublished status
2. WHEN publishing a product, THE Product_Management_System SHALL validate that required fields (name, category, at least one media asset) are present
3. WHEN a product is unpublished, THE Digital_Showroom SHALL exclude it from all public queries and search results
4. WHEN a product is published, THE Digital_Showroom SHALL include it in filtered results and search
5. THE Custom_CMS SHALL display published status clearly for each product in the product list

### Requirement 11: RESTful API Design

**User Story:** As a frontend developer, I want consistent API endpoints, so that I can integrate the Digital Showroom with the Backend API.

#### Acceptance Criteria

1. THE Backend_API SHALL expose endpoints following REST conventions with proper HTTP methods (GET, POST, PUT, DELETE)
2. WHEN an API error occurs, THE Backend_API SHALL return standardized error responses with status codes and error messages
3. WHEN an API request succeeds, THE Backend_API SHALL return standardized success responses with appropriate status codes
4. THE Backend_API SHALL version all endpoints with `/api/v1/` prefix for future compatibility
5. THE Backend_API SHALL support CORS configuration to allow requests from the Digital_Showroom domain

### Requirement 12: Database Schema Integrity

**User Story:** As a system architect, I want enforced database relationships, so that data integrity is maintained across the system.

#### Acceptance Criteria

1. THE Database_Schema SHALL use UUID primary keys for all entities to support distributed systems
2. THE Backend_API SHALL validate referential integrity before creating or updating records with foreign key relationships
3. THE Database_Schema SHALL include created_at and updated_at timestamps for all entities
4. THE Backend_API SHALL handle cascade operations appropriately (e.g., deleting a product should delete its media)
5. THE Backend_API SHALL enforce unique constraints on critical fields (user email, product SKU, category slug) through validation

### Requirement 13: Media File Validation

**User Story:** As an admin user, I want to upload only valid media files, so that the system maintains quality standards.

#### Acceptance Criteria

1. WHEN uploading image files, THE Media_Management_System SHALL accept only JPEG, PNG, and WebP formats
2. WHEN uploading video files, THE Media_Management_System SHALL accept only MP4 and WebM formats
3. WHEN uploading 3D files, THE Media_Management_System SHALL accept common CAD formats (DWG, OBJ, FBX)
4. WHEN uploading PDF files, THE Media_Management_System SHALL validate file integrity and size limits
5. IF an invalid file type is uploaded, THEN THE Media_Management_System SHALL reject the upload and return a descriptive error message

### Requirement 14: Search Functionality

**User Story:** As a user, I want to search for products by name or SKU, so that I can quickly find specific items.

#### Acceptance Criteria

1. WHEN a user enters a search query, THE Digital_Showroom SHALL search across product names, SKUs, and descriptions
2. WHEN search results are returned, THE Digital_Showroom SHALL rank results by relevance
3. THE Backend_API SHALL support partial text matching for search queries
4. THE Database_Schema SHALL include text search indexes for optimized query performance
5. WHEN combining search with filters, THE Digital_Showroom SHALL apply both search and filter criteria to results

### Requirement 15: Responsive Media Delivery

**User Story:** As a user on any device, I want fast-loading images, so that I can browse products smoothly.

#### Acceptance Criteria

1. WHEN serving images, THE CDN SHALL deliver optimized formats based on browser support (WebP for modern browsers)
2. WHEN serving images, THE CDN SHALL provide multiple size variants for responsive layouts
3. THE Media_Management_System SHALL generate thumbnail, medium, and full-size variants for each uploaded image
4. WHEN a user requests media, THE Digital_Showroom SHALL use lazy loading for images below the fold
5. THE CDN SHALL cache media assets with appropriate cache headers for optimal performance
