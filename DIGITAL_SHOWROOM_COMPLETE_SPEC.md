# Digital Showroom - Complete System Specification

## Project Overview

Digital Showroom là một hệ thống e-commerce cao cấp cho vật liệu xây dựng luxury bao gồm gạch ốp lát, thiết bị vệ sinh, và đồ dùng nhà bếp. Hệ thống gồm 4 components chính:

1. **Backend API** (NestJS) - Core business logic và data management
2. **Frontend** (Next.js) - Customer-facing showroom website
3. **CMS** (Next.js) - Admin dashboard cho content management
4. **Infrastructure** - Database, file storage, deployment setup

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │      CMS        │    │   Mobile App    │
│   (Port 3000)   │    │   (Port 3002)   │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────────────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌─────────────────┐
          │   Backend API   │
          │   (Port 3001)   │
          └─────────┬───────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐    ┌────▼────┐    ┌─────▼─────┐
│SQLite/ │    │   AWS   │    │   CDN     │
│Postgres│    │   S3    │    │Cloudflare │
└────────┘    └─────────┘    └───────────┘
```

## 1. Backend API Specification

### 1.1 Technology Stack

- **Framework**: NestJS 11+ with TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod) with Prisma ORM
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3 with presigned URLs
- **Validation**: class-validator + class-transformer
- **Testing**: Jest with supertest
- **Documentation**: Swagger/OpenAPI

### 1.2 Core Modules

#### Authentication Module

```typescript
// Endpoints
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/profile

// Features
- JWT token generation (24h expiry)
- Refresh token mechanism
- Role-based access control (Admin, User)
- Password hashing with bcrypt
```

#### Products Module

```typescript
// Endpoints
GET    /api/v1/products              // List with filtering
GET    /api/v1/products/:id          // Get single product
POST   /api/v1/products              // Create (Admin only)
PUT    /api/v1/products/:id          // Update (Admin only)
DELETE /api/v1/products/:id          // Delete (Admin only)
PATCH  /api/v1/products/:id/publish  // Toggle publish status

// Product Schema
interface Product {
  id: string
  name: string
  sku: string
  description: string
  categoryId: string
  technicalSpecs: Record<string, any> // JSONB
  isPublished: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  category: Category
  media: Media[]
  styles: Style[]
  spaces: Space[]
}
```

#### Categories Module

```typescript
// Endpoints
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/categories
PUT    /api/v1/categories/:id
DELETE /api/v1/categories/:id

// Category Schema (Hierarchical)
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  isActive: boolean

  // Relations
  parent?: Category
  children: Category[]
  products: Product[]
}
```

#### Media Module

```typescript
// Endpoints
GET    /api/v1/products/:id/media
POST   /api/v1/products/:id/media/upload
PUT    /api/v1/media/:id
DELETE /api/v1/media/:id
PATCH  /api/v1/media/:id/set-cover

// Media Types
enum MediaType {
  LIFESTYLE = 'lifestyle',
  CUTOUT = 'cutout',
  VIDEO = 'video',
  MODEL_3D = '3d',
  PDF = 'pdf'
}

// Media Schema
interface Media {
  id: string
  productId: string
  type: MediaType
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  cdnUrl?: string
  isCover: boolean
  order: number
}
```

#### Leads Module

```typescript
// Endpoints
GET    /api/v1/leads
GET    /api/v1/leads/:id
POST   /api/v1/leads              // Create from frontend
PUT    /api/v1/leads/:id          // Update status (Admin)
DELETE /api/v1/leads/:id

// Lead Schema
interface Lead {
  id: string
  type: 'APPOINTMENT' | 'QUOTE_REQUEST'
  status: 'NEW' | 'CONTACTED' | 'CONVERTED'

  // Contact Info
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string

  // Project Details
  projectName?: string
  projectDescription?: string
  preferredDate?: Date
  budget?: string

  // Products of Interest
  productIds: string[]

  createdAt: Date
  updatedAt: Date
}
```

### 1.3 Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  parentId    String?
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
}

model Product {
  id             String   @id @default(cuid())
  name           String
  sku            String   @unique
  description    String
  categoryId     String
  technicalSpecs Json     // JSONB for flexible specs
  isPublished    Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  category       Category @relation(fields: [categoryId], references: [id])
  media          Media[]
  styles         ProductStyle[]
  spaces         ProductSpace[]
  leads          LeadProduct[]
}

model Style {
  id          String         @id @default(cuid())
  name        String         @unique
  description String?
  createdAt   DateTime       @default(now())

  products    ProductStyle[]
}

model Space {
  id          String         @id @default(cuid())
  name        String         @unique
  description String?
  createdAt   DateTime       @default(now())

  products    ProductSpace[]
}

model Media {
  id           String    @id @default(cuid())
  productId    String
  type         MediaType
  filename     String
  originalName String
  mimeType     String
  size         Int
  url          String
  cdnUrl       String?
  isCover      Boolean   @default(false)
  order        Int       @default(0)
  createdAt    DateTime  @default(now())

  product      Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Lead {
  id                 String        @id @default(cuid())
  type               LeadType
  status             LeadStatus    @default(NEW)
  firstName          String
  lastName           String
  email              String
  phone              String?
  company            String?
  projectName        String?
  projectDescription String?
  preferredDate      DateTime?
  budget             String?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  products           LeadProduct[]
}

// Junction Tables
model ProductStyle {
  productId String
  styleId   String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  style     Style   @relation(fields: [styleId], references: [id], onDelete: Cascade)

  @@id([productId, styleId])
}

model ProductSpace {
  productId String
  spaceId   String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  space     Space   @relation(fields: [spaceId], references: [id], onDelete: Cascade)

  @@id([productId, spaceId])
}

model LeadProduct {
  leadId    String
  productId String

  lead      Lead    @relation(fields: [leadId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@id([leadId, productId])
}

// Enums
enum Role {
  USER
  ADMIN
}

enum MediaType {
  LIFESTYLE
  CUTOUT
  VIDEO
  MODEL_3D
  PDF
}

enum LeadType {
  APPOINTMENT
  QUOTE_REQUEST
}

enum LeadStatus {
  NEW
  CONTACTED
  CONVERTED
}
```

### 1.4 Configuration & Environment

```bash
# .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET_NAME=""
AWS_REGION="us-east-1"

# CDN
CDN_BASE_URL=""

# Application
PORT=3001
NODE_ENV="development"
```

## 2. Frontend Specification

### 2.1 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context + useState/useReducer
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library

### 2.2 Page Structure

```
src/app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Homepage
├── products/
│   ├── page.tsx              # Product listing with filters
│   └── [id]/
│       └── page.tsx          # Product detail page
├── categories/
│   └── [slug]/
│       └── page.tsx          # Category page
├── about/
│   └── page.tsx              # About page
├── contact/
│   └── page.tsx              # Contact page
└── api/                      # API routes (if needed)
```

### 2.3 Key Components

#### Product Listing Component

```typescript
// components/ProductListing.tsx
interface ProductListingProps {
  initialProducts: Product[]
  categories: Category[]
  styles: Style[]
  spaces: Space[]
}

// Features:
- Dual-tab filtering (Inspiration vs Technical)
- Search functionality
- Pagination
- Sort options (name, price, newest)
- Grid/list view toggle
- Lazy loading images
```

#### Product Filter Component

```typescript
// components/ProductFilter.tsx
interface FilterState {
  category?: string
  styles: string[]
  spaces: string[]
  search: string
  technicalSpecs: Record<string, any>
}

// Features:
- Inspiration tab (styles + spaces)
- Technical tab (dynamic specs based on category)
- Search with debouncing
- Clear filters functionality
- Filter count indicators
```

#### Product Card Component

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: Product
  variant: 'grid' | 'list'
  showQuickView?: boolean
}

// Features:
- Hover effects with Framer Motion
- Quick view modal
- Add to favorites
- Request quote button
- Lazy loaded images
```

#### Media Gallery Component

```typescript
// components/MediaGallery.tsx
interface MediaGalleryProps {
  media: Media[]
  productName: string
}

// Features:
- Image zoom functionality
- Video playback
- 3D model viewer (future)
- PDF viewer
- Thumbnail navigation
- Fullscreen mode
```

### 2.4 API Integration

```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  // Products
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse>;
  async getProduct(id: string): Promise<Product>;

  // Categories
  async getCategories(): Promise<Category[]>;

  // Tags
  async getStyles(): Promise<Style[]>;
  async getSpaces(): Promise<Space[]>;

  // Leads
  async createLead(lead: CreateLeadDto): Promise<Lead>;
}
```

### 2.5 Performance Optimization

```typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ["your-cdn-domain.com"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

## 3. CMS Specification

### 3.1 Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State Management**: React Context
- **File Upload**: Drag & Drop with react-dropzone
- **Rich Text**: TipTap or similar (future)

### 3.2 Dashboard Structure

```
src/app/dashboard/
├── layout.tsx                # Dashboard layout with sidebar
├── page.tsx                  # Dashboard overview
├── products/
│   ├── page.tsx             # Product listing
│   ├── new/
│   │   └── page.tsx         # Create product
│   └── [id]/
│       └── page.tsx         # Edit product
├── categories/
│   └── page.tsx             # Category management
├── tags/
│   └── page.tsx             # Style & Space tag management
├── media/
│   └── page.tsx             # Media management
├── leads/
│   ├── page.tsx             # Lead listing
│   └── [id]/
│       └── page.tsx         # Lead detail
└── settings/
    └── page.tsx             # System settings
```

### 3.3 Key Features

#### Authentication System

```typescript
// contexts/auth-context.tsx
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Features:
- JWT token management
- Automatic token refresh
- Protected routes
- Role-based access control
```

#### Product Management

```typescript
// components/ProductForm.tsx
interface ProductFormData {
  name: string
  sku: string
  description: string
  categoryId: string
  technicalSpecs: Record<string, any>
  styleIds: string[]
  spaceIds: string[]
  isPublished: boolean
}

// Features:
- Dynamic technical specs editor
- Category selection with hierarchy
- Multi-select for styles/spaces
- Form validation
- Auto-save drafts
```

#### Media Management

```typescript
// components/MediaUpload.tsx
interface MediaUploadProps {
  productId: string
  onUploadComplete: (media: Media[]) => void
}

// Features:
- Drag & drop upload
- Multiple file selection
- File type validation
- Progress indicators
- Media ordering
- Cover image selection
```

## 4. Infrastructure Specification

### 4.1 Development Environment

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: digital_showroom_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 4.2 Production Deployment

#### Backend Deployment (AWS ECS/EC2)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

#### Frontend Deployment (Vercel/Netlify)

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.digitalshowroom.com/api/v1"
  }
}
```

### 4.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS ECS
        # AWS deployment steps

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        # Vercel deployment steps
```

## 5. Integration & Testing

### 5.1 API Testing

```typescript
// backend/test/e2e/products.e2e-spec.ts
describe("Products API", () => {
  it("should create product with media", async () => {
    // Test complete product creation workflow
  });

  it("should filter products by category and tags", async () => {
    // Test filtering functionality
  });
});
```

### 5.2 Frontend Testing

```typescript
// frontend/src/__tests__/product-listing.test.tsx
describe("ProductListing", () => {
  it("should filter products by inspiration tags", async () => {
    // Test filtering UI
  });

  it("should handle pagination correctly", async () => {
    // Test pagination
  });
});
```

### 5.3 Integration Testing

```typescript
// integration-tests/full-workflow.test.ts
describe("Full System Workflow", () => {
  it("should complete product creation to display workflow", async () => {
    // 1. Create product via CMS
    // 2. Upload media via CMS
    // 3. Publish product
    // 4. Verify product appears on frontend
    // 5. Test filtering and search
    // 6. Test lead creation
  });
});
```

## 6. Performance & Security

### 6.1 Performance Requirements

- **Page Load Time**: < 3 seconds
- **Image Loading**: Progressive with lazy loading
- **API Response Time**: < 500ms for product listing
- **Database Queries**: Optimized with proper indexing
- **CDN**: All media served through CDN

### 6.2 Security Measures

- **Authentication**: JWT with secure httpOnly cookies
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **File Upload**: Virus scanning and file type validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **HTTPS**: SSL/TLS encryption for all communications

## 7. Monitoring & Analytics

### 7.1 Application Monitoring

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: New Relic or similar
- **Uptime Monitoring**: Pingdom or similar
- **Log Management**: CloudWatch or ELK stack

### 7.2 Business Analytics

- **User Behavior**: Google Analytics 4
- **Product Performance**: Custom dashboard
- **Lead Conversion**: CRM integration
- **A/B Testing**: Feature flags for testing

## 8. Future Enhancements

### 8.1 Phase 2 Features

- **Mobile App**: React Native app
- **AR/VR**: 3D product visualization
- **AI Recommendations**: ML-based product suggestions
- **Multi-language**: i18n support
- **Advanced Search**: Elasticsearch integration

### 8.2 Scalability Considerations

- **Microservices**: Break backend into smaller services
- **Caching**: Redis for session and data caching
- **CDN**: Global content delivery network
- **Database Sharding**: For large product catalogs
- **Load Balancing**: Multiple backend instances

## Implementation Timeline

### Phase 1: Core System (8 weeks)

- Week 1-2: Backend API development
- Week 3-4: Frontend development
- Week 5-6: CMS development
- Week 7-8: Integration & testing

### Phase 2: Production Ready (4 weeks)

- Week 9-10: Performance optimization
- Week 11-12: Security hardening & deployment

### Phase 3: Advanced Features (6 weeks)

- Week 13-15: Mobile app development
- Week 16-18: AI/ML features

## Success Metrics

### Technical Metrics

- **Uptime**: 99.9%
- **Page Load Speed**: < 3s
- **API Response Time**: < 500ms
- **Test Coverage**: > 80%

### Business Metrics

- **Lead Conversion Rate**: > 5%
- **User Engagement**: > 3 pages per session
- **Product Discovery**: > 50% use filters
- **Mobile Usage**: > 40% mobile traffic

---

_This specification serves as the complete blueprint for the Digital Showroom system. All components should be developed according to these specifications to ensure seamless integration and optimal performance._
