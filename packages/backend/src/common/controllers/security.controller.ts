import { Controller, Get, UseGuards } from '@nestjs/common';
import { SecurityHeadersService } from '../services/security-headers.service';
import { RateLimiterService } from '../services/rate-limiter.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('security')
@UseGuards(JwtAuthGuard)
export class SecurityController {
  constructor(
    private securityHeaders: SecurityHeadersService,
    private rateLimiter: RateLimiterService,
  ) {}

  @Get('headers')
  getSecurityHeaders() {
    return {
      headers: this.securityHeaders.getSecurityHeaders(),
      corsConfiguration: this.securityHeaders.getCorsConfiguration(),
      csrfConfiguration: this.securityHeaders.getCsrfConfiguration(),
    };
  }

  @Get('password-policy')
  getPasswordPolicy() {
    return this.securityHeaders.getPasswordPolicy();
  }

  @Get('input-validation')
  getInputValidationRules() {
    return this.securityHeaders.getInputValidationRules();
  }

  @Get('recommendations')
  getSecurityRecommendations() {
    return {
      recommendations: this.securityHeaders.getSecurityRecommendations(),
    };
  }

  @Get('rate-limit-stats')
  getRateLimitStats() {
    return this.rateLimiter.getStats();
  }
}
