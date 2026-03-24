# Authentication System

This module provides JWT-based authentication and role-based authorization for the Digital Showroom CMS backend.

## Components

### Guards

#### JwtAuthGuard
Protects routes requiring authentication. Validates JWT tokens and populates `request.user`.

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedData() {
  return { message: 'This requires authentication' };
}
```

#### RolesGuard
Provides role-based authorization. Must be used together with `JwtAuthGuard`.

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from './auth';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin-only')
getAdminData() {
  return { message: 'Admin only data' };
}
```

### Decorators

#### @Roles(...roles)
Specifies which roles can access a route.

```typescript
@Roles('admin', 'manager') // Users with either role can access
@Get('management')
getManagementData() {
  return { data: 'Management data' };
}
```

#### @CurrentUser()
Extracts the current user from the request.

```typescript
import { CurrentUser } from './decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: any) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
```

## Configuration

### CORS
CORS is configured in `main.ts` to allow requests from frontend domains:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000', // Next.js development server
    'http://localhost:3001', // CMS development server
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.CMS_URL || 'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### Global API Prefix
All API endpoints are prefixed with `/api/v1`:

```typescript
app.setGlobalPrefix('api/v1');
```

### Error Handling
Authentication and authorization errors are handled by `AuthExceptionFilter`:

```typescript
app.useGlobalFilters(new AuthExceptionFilter());
```

## Usage Examples

### Basic Authentication
```typescript
@Controller('products')
export class ProductsController {
  
  @UseGuards(JwtAuthGuard)
  @Get()
  getProducts(@CurrentUser() user: any) {
    // Only authenticated users can access
    return this.productsService.findAll();
  }
}
```

### Role-Based Authorization
```typescript
@Controller('admin')
export class AdminController {
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users')
  getUsers(@CurrentUser() user: any) {
    // Only admin users can access
    return this.usersService.findAll();
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get('reports')
  getReports(@CurrentUser() user: any) {
    // Admin or manager users can access
    return this.reportsService.findAll();
  }
}
```

### Frontend Integration
Frontend applications should include the JWT token in the Authorization header:

```typescript
// Example API call from frontend
const response = await fetch('/api/v1/products', {
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  },
});
```

## Error Responses

Authentication and authorization errors return standardized responses:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized",
    "timestamp": "2026-03-13T13:15:39.000Z",
    "path": "/api/v1/protected"
  }
}
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **1.4**: JWT authorization enforcement for API requests
- **1.5**: Proper rejection of requests without valid tokens
- **11.5**: CORS configuration for frontend domains

The middleware and guards provide a secure, scalable authentication system that can be easily applied to any controller or route in the application.