import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/user.decorator';

/**
 * Example controller demonstrating how to use JWT authentication and role-based authorization
 * This controller shows different protection levels:
 * 1. JWT authentication only
 * 2. JWT authentication + role-based authorization
 */
@Controller('protected')
export class ProtectedController {
  /**
   * Endpoint protected by JWT authentication only
   * Any authenticated user can access this
   */
  @UseGuards(JwtAuthGuard)
  @Get('authenticated')
  getAuthenticatedData(@CurrentUser() user: any) {
    return {
      message: 'This data requires authentication',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Endpoint protected by JWT authentication + admin role
   * Only users with 'admin' role can access this
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminOnlyData(@CurrentUser() user: any) {
    return {
      message: 'This data is for admins only',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      adminData: {
        systemStats: 'Some admin statistics',
        userCount: 42,
      },
    };
  }

  /**
   * Endpoint that accepts multiple roles
   * Users with either 'admin' or 'manager' role can access this
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get('management')
  getManagementData(@CurrentUser() user: any) {
    return {
      message: 'This data is for management users',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      managementData: {
        reports: 'Management reports',
        analytics: 'User analytics',
      },
    };
  }
}
