# Requirements Document

## Introduction

Hệ thống hiện tại bao gồm 3 ứng dụng riêng biệt: backend (NestJS), CMS (Next.js), và frontend (Next.js). Dự án này nhằm tích hợp CMS vào frontend như một tính năng admin và chuyển đổi sang cấu trúc monorepo thống nhất. Mục tiêu là giảm từ 3 deployments xuống 2 (backend + unified frontend), chia sẻ code chung, và đơn giản hóa quản lý dependencies.

## Glossary

- **Monorepo_System**: Hệ thống quản lý nhiều packages trong một repository duy nhất
- **Workspace_Manager**: Công cụ quản lý workspaces (pnpm workspaces hoặc npm workspaces)
- **Unified_Frontend**: Ứng dụng Next.js tích hợp cả frontend công khai và CMS admin
- **Admin_Routes**: Các routes bắt đầu với /admin/\* dành cho CMS
- **Public_Routes**: Các routes công khai của frontend (/, /products, /cart, etc.)
- **Shared_Package**: Package chứa code dùng chung (types, utils, components)
- **CMS_Module**: Tập hợp các components và pages của CMS
- **Auth_Guard**: Cơ chế bảo vệ admin routes yêu cầu authentication
- **Build_System**: Hệ thống build và bundle code cho production
- **Deployment_Service**: Service được deploy (backend hoặc unified frontend)

## Requirements

### Requirement 1: Monorepo Structure Setup

**User Story:** Là một developer, tôi muốn có cấu trúc monorepo thống nhất, để dễ dàng quản lý và chia sẻ code giữa các packages.

#### Acceptance Criteria

1. THE Monorepo_System SHALL organize code into separate packages: backend, frontend, and shared packages
2. THE Workspace_Manager SHALL manage dependencies across all packages
3. THE Monorepo_System SHALL support independent versioning for each package
4. THE Build_System SHALL build packages in correct dependency order
5. THE Monorepo_System SHALL use a single package-lock file at root level

### Requirement 2: CMS Integration into Frontend

**User Story:** Là một admin, tôi muốn truy cập CMS thông qua /admin/\* routes trong cùng ứng dụng frontend, để không cần chuyển đổi giữa các ứng dụng riêng biệt.

#### Acceptance Criteria

1. THE Unified_Frontend SHALL serve all CMS pages under /admin/\* routes
2. THE Unified_Frontend SHALL serve all public pages under Public_Routes
3. WHEN a user navigates to /admin/dashboard, THE Unified_Frontend SHALL render the CMS dashboard page
4. WHEN a user navigates to /admin/products, THE Unified_Frontend SHALL render the CMS products management page
5. WHEN a user navigates to /admin/categories, THE Unified_Frontend SHALL render the CMS categories management page
6. WHEN a user navigates to /admin/tags, THE Unified_Frontend SHALL render the CMS tags management page
7. WHEN a user navigates to /admin/media, THE Unified_Frontend SHALL render the CMS media management page
8. WHEN a user navigates to /admin/leads, THE Unified_Frontend SHALL render the CMS leads management page
9. WHEN a user navigates to /admin/import, THE Unified_Frontend SHALL render the CMS catalogue import pages

### Requirement 3: Admin Routes Protection

**User Story:** Là một system administrator, tôi muốn bảo vệ tất cả admin routes, để chỉ người dùng đã xác thực mới có thể truy cập CMS.

#### Acceptance Criteria

1. WHEN an unauthenticated user accesses any /admin/\* route, THE Auth_Guard SHALL redirect to /admin/login
2. WHEN an authenticated user accesses any /admin/\* route, THE Auth_Guard SHALL allow access
3. WHEN a user logs out, THE Auth_Guard SHALL clear authentication state and redirect to /admin/login
4. THE Auth_Guard SHALL verify JWT tokens with the backend API
5. WHEN a JWT token expires, THE Auth_Guard SHALL redirect to /admin/login

### Requirement 4: Shared Types Package

**User Story:** Là một developer, tôi muốn chia sẻ TypeScript types giữa frontend và backend, để đảm bảo type safety và tránh code duplication.

#### Acceptance Criteria

1. THE Shared_Package SHALL export all API request and response types
2. THE Shared_Package SHALL export all domain model types (Product, Category, Tag, Media, Lead)
3. THE Shared_Package SHALL export all DTO types used by backend API
4. WHEN backend types change, THE Shared_Package SHALL reflect those changes
5. WHEN frontend imports types, THE Shared_Package SHALL provide type definitions without runtime code

### Requirement 5: Shared Utils Package

**User Story:** Là một developer, tôi muốn chia sẻ utility functions giữa frontend và CMS, để tránh code duplication.

#### Acceptance Criteria

1. THE Shared_Package SHALL export common utility functions (formatters, validators, helpers)
2. THE Shared_Package SHALL export API client configuration
3. THE Shared_Package SHALL export constants used across applications
4. WHEN a utility function is needed by both frontend and CMS, THE Shared_Package SHALL provide it

### Requirement 6: Shared Components Package

**User Story:** Là một developer, tôi muốn chia sẻ React components giữa frontend và CMS, để tái sử dụng UI components.

#### Acceptance Criteria

1. WHERE components are used by both frontend and CMS, THE Shared_Package SHALL export those components
2. THE Shared_Package SHALL export UI primitives (buttons, inputs, modals, dialogs)
3. THE Shared_Package SHALL export form components with validation
4. THE Shared_Package SHALL maintain consistent styling across frontend and CMS

### Requirement 7: CMS Layout Integration

**User Story:** Là một admin, tôi muốn CMS có layout riêng với sidebar navigation, để dễ dàng điều hướng giữa các trang quản lý.

#### Acceptance Criteria

1. WHEN rendering /admin/\* routes, THE Unified_Frontend SHALL use CMS layout with sidebar
2. WHEN rendering Public_Routes, THE Unified_Frontend SHALL use public layout with header and footer
3. THE CMS_Module SHALL maintain sidebar navigation with links to all admin pages
4. THE CMS_Module SHALL display current user information in sidebar
5. THE CMS_Module SHALL provide logout functionality in sidebar

### Requirement 8: Build and Bundle Optimization

**User Story:** Là một developer, tôi muốn build system tối ưu, để giảm bundle size và cải thiện performance.

#### Acceptance Criteria

1. THE Build_System SHALL create separate bundles for public routes and admin routes
2. THE Build_System SHALL enable code splitting for admin routes
3. WHEN a user visits Public_Routes, THE Build_System SHALL not load CMS code
4. WHEN a user visits Admin_Routes, THE Build_System SHALL load CMS code on demand
5. THE Build_System SHALL optimize shared dependencies to avoid duplication

### Requirement 9: Environment Configuration

**User Story:** Là một developer, tôi muốn quản lý environment variables tập trung, để dễ dàng cấu hình cho các môi trường khác nhau.

#### Acceptance Criteria

1. THE Monorepo_System SHALL support environment-specific configuration files
2. THE Unified_Frontend SHALL read API URL from environment variables
3. THE Unified_Frontend SHALL read authentication configuration from environment variables
4. THE Build_System SHALL validate required environment variables before build
5. WHERE different environments exist (dev, staging, production), THE Monorepo_System SHALL support separate configurations

### Requirement 10: Deployment Simplification

**User Story:** Là một DevOps engineer, tôi muốn deploy chỉ 2 services thay vì 3, để đơn giản hóa infrastructure và giảm chi phí.

#### Acceptance Criteria

1. THE Deployment_Service SHALL deploy backend as a separate service
2. THE Deployment_Service SHALL deploy Unified_Frontend as a single service containing both public and admin functionality
3. THE Deployment_Service SHALL support Railway platform deployment
4. THE Build_System SHALL generate production builds for both services
5. WHEN deploying to Railway, THE Deployment_Service SHALL use monorepo-aware build configuration

### Requirement 11: Development Experience

**User Story:** Là một developer, tôi muốn development workflow mượt mà, để có thể phát triển và test cả frontend và CMS cùng lúc.

#### Acceptance Criteria

1. THE Monorepo_System SHALL support running all packages in development mode simultaneously
2. THE Monorepo_System SHALL support hot reload for all packages
3. THE Workspace_Manager SHALL install dependencies for all packages with a single command
4. THE Monorepo_System SHALL support running tests for all packages
5. THE Monorepo_System SHALL support linting and formatting for all packages

### Requirement 12: Migration Path

**User Story:** Là một developer, tôi muốn có migration path rõ ràng, để chuyển đổi từ 3 apps riêng biệt sang monorepo mà không làm mất code.

#### Acceptance Criteria

1. THE Monorepo_System SHALL preserve all existing backend code and functionality
2. THE Monorepo_System SHALL preserve all existing frontend code and functionality
3. THE Monorepo_System SHALL preserve all existing CMS code and functionality
4. THE Monorepo_System SHALL migrate CMS routes from root level to /admin/\* prefix
5. THE Monorepo_System SHALL update all internal links and navigation to use new route structure

### Requirement 13: Authentication Context Sharing

**User Story:** Là một developer, tôi muốn chia sẻ authentication context, để CMS có thể sử dụng cùng auth logic với frontend.

#### Acceptance Criteria

1. THE Shared_Package SHALL export authentication context provider
2. THE Shared_Package SHALL export authentication hooks (useAuth, useUser)
3. THE Auth_Guard SHALL use shared authentication context
4. WHEN a user logs in via /admin/login, THE Unified_Frontend SHALL store JWT token
5. WHEN making API requests, THE Unified_Frontend SHALL include JWT token in headers

### Requirement 14: API Client Consolidation

**User Story:** Là một developer, tôi muốn có một API client duy nhất, để tất cả API calls đều consistent.

#### Acceptance Criteria

1. THE Shared_Package SHALL export a configured API client (axios instance)
2. THE Shared_Package SHALL configure base URL from environment variables
3. THE Shared_Package SHALL configure request interceptors for authentication
4. THE Shared_Package SHALL configure response interceptors for error handling
5. WHEN any package makes API calls, THE Shared_Package SHALL provide the API client

### Requirement 15: Styling Consistency

**User Story:** Là một designer, tôi muốn styling consistent giữa frontend và CMS, để maintain brand identity.

#### Acceptance Criteria

1. THE Monorepo_System SHALL use a single Tailwind CSS configuration
2. THE Shared_Package SHALL export common CSS utilities and classes
3. THE Unified_Frontend SHALL apply consistent color scheme across public and admin routes
4. THE Unified_Frontend SHALL use consistent typography across public and admin routes
5. WHERE custom styles are needed for CMS, THE CMS_Module SHALL extend base styles without conflicts

### Requirement 16: Media Management Integration

**User Story:** Là một admin, tôi muốn media management hoạt động trong unified frontend, để upload và quản lý media files.

#### Acceptance Criteria

1. WHEN accessing /admin/media, THE CMS_Module SHALL display media library
2. WHEN uploading media via CMS, THE CMS_Module SHALL send files to backend API
3. WHEN selecting media in product forms, THE CMS_Module SHALL display media picker
4. THE CMS_Module SHALL support all existing media operations (upload, delete, update alt text)
5. THE CMS_Module SHALL display media thumbnails and previews

### Requirement 17: Product Management Integration

**User Story:** Là một admin, tôi muốn product management hoạt động trong unified frontend, để quản lý sản phẩm.

#### Acceptance Criteria

1. WHEN accessing /admin/products, THE CMS_Module SHALL display product list
2. WHEN creating a product, THE CMS_Module SHALL submit data to backend API
3. WHEN editing a product, THE CMS_Module SHALL load existing data and allow updates
4. WHEN deleting a product, THE CMS_Module SHALL confirm and send delete request
5. THE CMS_Module SHALL support all existing product fields (specs, media, categories, tags, pricing)

### Requirement 18: Catalogue Import Integration

**User Story:** Là một admin, tôi muốn catalogue import feature hoạt động trong unified frontend, để import products từ PDF catalogues.

#### Acceptance Criteria

1. WHEN accessing /admin/import, THE CMS_Module SHALL display import interface
2. WHEN uploading a PDF catalogue, THE CMS_Module SHALL send file to backend for processing
3. WHEN viewing import job status, THE CMS_Module SHALL poll backend API for updates
4. WHEN previewing extracted products, THE CMS_Module SHALL display product cards with edit capability
5. WHEN confirming import, THE CMS_Module SHALL bulk create products via backend API

### Requirement 19: Category and Tag Management Integration

**User Story:** Là một admin, tôi muốn category và tag management hoạt động trong unified frontend, để tổ chức sản phẩm.

#### Acceptance Criteria

1. WHEN accessing /admin/categories, THE CMS_Module SHALL display category tree
2. WHEN accessing /admin/tags, THE CMS_Module SHALL display tag list
3. THE CMS_Module SHALL support creating, editing, and deleting categories
4. THE CMS_Module SHALL support creating, editing, and deleting tags
5. THE CMS_Module SHALL support hierarchical category structure

### Requirement 20: Lead Management Integration

**User Story:** Là một admin, tôi muốn lead management hoạt động trong unified frontend, để quản lý customer inquiries.

#### Acceptance Criteria

1. WHEN accessing /admin/leads, THE CMS_Module SHALL display lead list
2. THE CMS_Module SHALL support filtering leads by status and date
3. THE CMS_Module SHALL support viewing lead details
4. THE CMS_Module SHALL support updating lead status
5. THE CMS_Module SHALL display lead source and contact information
