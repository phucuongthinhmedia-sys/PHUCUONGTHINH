# Implementation Plan: CMS-Frontend Integration Monorepo

## Overview

This plan migrates the existing 3-application architecture (backend, frontend, CMS) into a unified monorepo with 2 services. The unified frontend will serve both public routes and admin routes (/admin/\*) in a single Next.js application, with shared packages for types, utilities, and components. All implementation will use TypeScript to match the existing codebase.

## Tasks

- [x] 1. Set up monorepo structure with pnpm workspaces
  - Create root package.json with pnpm workspace configuration
  - Create packages/ directory structure
  - Configure pnpm-workspace.yaml to define workspace packages
  - Move existing backend/ to packages/backend/
  - Move existing frontend/ to packages/frontend/
  - Create packages/shared-types/ directory
  - Create packages/shared-utils/ directory
  - Create packages/shared-components/ directory
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 2. Configure shared-types package
  - [x] 2.1 Create package.json for shared-types with TypeScript configuration
    - Set up package.json with name "@repo/shared-types"
    - Configure TypeScript with declaration files only (no runtime code)
    - Add build script to compile TypeScript definitions
    - _Requirements: 4.1, 4.5_
  - [x] 2.2 Extract and consolidate type definitions
    - Export Product, Category, Tag, Media, Lead domain types
    - Export all API request DTOs (CreateProductDto, UpdateProductDto, etc.)
    - Export all API response types
    - Export authentication types (LoginDto, AuthResponse, JwtPayload)
    - Export import job types (ImportJob, ImportStatus, ExtractedProduct)
    - _Requirements: 4.2, 4.3_

- [x] 3. Configure shared-utils package
  - [x] 3.1 Create package.json for shared-utils with dependencies
    - Set up package.json with name "@repo/shared-utils"
    - Add axios as dependency for API client
    - Configure TypeScript compilation
    - Add dependency on @repo/shared-types
    - _Requirements: 5.1, 5.2_
  - [x] 3.2 Create API client with interceptors
    - Create configured axios instance with base URL from env
    - Implement request interceptor to add JWT token to headers
    - Implement response interceptor for error handling
    - Export API client factory function
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  - [x] 3.3 Extract common utility functions
    - Export formatters (currency, date, number)
    - Export validators (email, phone, URL)
    - Export helper functions used by both frontend and CMS
    - Export constants (API endpoints, status codes, error messages)
    - _Requirements: 5.1, 5.3, 5.4_

- [ ] 4. Configure shared-components package
  - [ ] 4.1 Create package.json for shared-components with React dependencies
    - Set up package.json with name "@repo/shared-components"
    - Add React, React-DOM as peer dependencies
    - Add Tailwind CSS and class-variance-authority
    - Configure TypeScript with JSX support
    - _Requirements: 6.1, 6.4_
  - [ ] 4.2 Extract UI primitives from CMS
    - Export Button component with variants
    - Export Input, Textarea, Select form components
    - Export Modal and Dialog components
    - Export Card, Badge, Alert components
    - _Requirements: 6.2_
  - [x] 4.3 Create shared form components
    - Export FormField wrapper with validation display
    - Export FormLabel, FormError, FormDescription
    - Export validated form inputs with error states
    - _Requirements: 6.3_

- [x] 5. Set up unified Tailwind CSS configuration
  - Create shared tailwind.config.js at root level
  - Define color scheme, typography, spacing tokens
  - Configure content paths for all packages
  - Create shared CSS utilities in shared-components
  - Update frontend and packages to extend shared config
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 6. Checkpoint - Verify shared packages build correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create authentication context in shared-utils
  - [x] 7.1 Implement AuthContext provider
    - Create React context for authentication state
    - Implement login, logout, and token refresh logic
    - Store JWT token in localStorage
    - Provide user state and loading state
    - _Requirements: 13.1, 13.4, 13.5_
  - [x] 7.2 Create authentication hooks
    - Export useAuth hook for accessing auth context
    - Export useUser hook for accessing current user
    - Export useRequireAuth hook for protected routes
    - _Requirements: 13.2_

- [x] 8. Migrate CMS pages to frontend under /admin/\* routes
  - [x] 8.1 Create admin route structure in frontend
  - [x] 8.2 Copy CMS components to frontend (product-form, spec-table, media-uploader, price-section, category-picker)
  - [x] 8.3 Migrate catalogue import feature (import page, job status, preview, product-card, edit-modal)

- [x] 9. Implement admin layout with sidebar
  - [x] 9.1 Create AdminLayout with sidebar navigation, user info, logout
  - [x] 9.2 Public layout preserved (admin layout is scoped to /admin/\*)

- [x] 10. Implement admin route protection
  - [x] 10.1 AdminGuard component with useRequireAuth hook, middleware.ts created
  - [x] 10.2 AuthProvider wraps admin routes, token expiry handled, logout clears state

- [ ] 11. Configure environment variables
  - [ ] 11.1 Create root .env.example file
    - Define NEXT_PUBLIC_API_URL for frontend
    - Define JWT_SECRET for authentication
    - Define environment-specific variables
    - Document all required environment variables
    - _Requirements: 9.1, 9.2, 9.3_
  - [ ] 11.2 Set up environment validation
    - Create env validation schema using zod or similar
    - Validate required variables at build time
    - Provide clear error messages for missing variables
    - Support .env.local, .env.development, .env.production
    - _Requirements: 9.4, 9.5_

- [ ] 12. Optimize build configuration for code splitting
  - [ ] 12.1 Configure Next.js for route-based code splitting
    - Update next.config.js to optimize bundle splitting
    - Configure dynamic imports for admin routes
    - Ensure admin code is not loaded on public routes
    - Set up separate chunks for CMS modules
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ] 12.2 Optimize shared dependencies
    - Configure webpack to deduplicate shared packages
    - Optimize React and common libraries bundling
    - Minimize bundle size for public routes
    - _Requirements: 8.5_

- [ ] 13. Checkpoint - Test unified frontend locally
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Update backend package configuration
  - Update backend package.json to work in monorepo context
  - Ensure backend can import @repo/shared-types
  - Update backend imports to use shared types
  - Verify backend builds and runs independently
  - _Requirements: 1.1, 12.1_

- [ ] 15. Configure monorepo scripts
  - [ ] 15.1 Add root-level development scripts
    - Add "dev" script to run all packages concurrently
    - Add "dev:frontend" to run only frontend
    - Add "dev:backend" to run only backend
    - Configure hot reload for all packages
    - _Requirements: 11.1, 11.2_
  - [ ] 15.2 Add build and test scripts
    - Add "build" script to build all packages in dependency order
    - Add "test" script to run tests for all packages
    - Add "lint" script to lint all packages
    - Add "format" script to format all packages
    - _Requirements: 1.4, 11.3, 11.4, 11.5_

- [ ] 16. Configure Railway deployment
  - [ ] 16.1 Create railway.toml for backend service
    - Configure build command for backend
    - Configure start command for backend
    - Set up environment variables for backend
    - _Requirements: 10.1, 10.3, 10.4_
  - [ ] 16.2 Create railway.toml for frontend service
    - Configure build command for unified frontend
    - Configure start command for frontend
    - Set up environment variables for frontend
    - Configure monorepo-aware build paths
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

- [ ] 17. Update all internal links and navigation
  - [ ] 17.1 Update CMS navigation links
    - Change all CMS routes from / to /admin/ prefix
    - Update sidebar navigation links
    - Update breadcrumb navigation
    - Update redirect logic after CRUD operations
    - _Requirements: 12.4, 12.5_
  - [ ] 17.2 Verify public frontend links unchanged
    - Ensure Header, Footer, MegaMenu links work
    - Verify product detail page links
    - Verify cart and wishlist navigation
    - Test all public route navigation
    - _Requirements: 12.2_

- [x] 18. Migrate product management functionality
  - [x] 18.1 Product list at /admin/products (paginated, search, publish toggle)
  - [x] 18.2 Product create/edit forms with full ProductForm component
  - [x] 18.3 Product delete with confirmation

- [x] 19. Migrate category and tag management
  - [x] 19.1 Category management at /admin/categories (CRUD, parent-child)
  - [x] 19.2 Tag management at /admin/tags (styles + spaces tabs)

- [x] 20. Migrate media management functionality
  - [x] 20.1 Media library at /admin/media (upload, delete, per-product)

- [x] 21. Migrate lead management functionality
  - [x] Lead list at /admin/leads with status filter and inline status update
  - [x] Lead detail at /admin/leads/[id] with project details editing

- [ ] 22. Final integration and testing
  - [ ] 22.1 Test all admin routes with authentication
    - Verify login flow works correctly
    - Test protected route access
    - Test logout functionality
    - Verify token refresh works
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ] 22.2 Test all CRUD operations
    - Test product create, read, update, delete
    - Test category create, read, update, delete
    - Test tag create, read, update, delete
    - Test media upload, delete, update
    - Test lead read and update
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 19.3, 19.4, 16.2, 16.4, 20.4_
  - [ ] 22.3 Test catalogue import feature
    - Test PDF upload and processing
    - Test job status polling
    - Test product preview and editing
    - Test bulk product creation
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  - [ ] 22.4 Verify public routes unaffected
    - Test all public pages load correctly
    - Verify no admin code loaded on public routes
    - Test product browsing and cart functionality
    - Verify SEO and performance unchanged
    - _Requirements: 8.3, 12.2_

- [ ] 23. Final checkpoint - Production readiness
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks use TypeScript to match the existing codebase (NestJS backend, Next.js frontend/CMS)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Migration preserves all existing functionality while consolidating architecture
- Focus on incremental progress: shared packages → auth → CMS migration → integration
- The monorepo reduces deployments from 3 services to 2 (backend + unified frontend)
