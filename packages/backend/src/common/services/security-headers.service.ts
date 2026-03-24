import { Injectable } from '@nestjs/common';

/**
 * Security headers service for HTTP security
 * Provides configuration for security headers and CSRF protection
 */
@Injectable()
export class SecurityHeadersService {
  /**
   * Get security headers for responses
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      // Prevent clickjacking attacks
      'X-Frame-Options': 'DENY',

      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',

      // Enable XSS protection in older browsers
      'X-XSS-Protection': '1; mode=block',

      // Content Security Policy
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'",

      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',

      // Permissions Policy (formerly Feature Policy)
      'Permissions-Policy':
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',

      // Strict Transport Security (HSTS)
      'Strict-Transport-Security':
        'max-age=31536000; includeSubDomains; preload',

      // Disable caching for sensitive responses
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };
  }

  /**
   * Get CSRF token configuration
   */
  getCsrfConfiguration(): {
    headerName: string;
    parameterName: string;
    cookieName: string;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: string;
      maxAge: number;
    };
  } {
    return {
      headerName: 'X-CSRF-Token',
      parameterName: '_csrf',
      cookieName: 'XSRF-TOKEN',
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
      },
    };
  }

  /**
   * Get CORS configuration
   */
  getCorsConfiguration(): {
    origin: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    maxAge: number;
  } {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.CMS_URL || 'http://localhost:3001',
    ].filter(Boolean);

    return {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400, // 24 hours
    };
  }

  /**
   * Get password policy requirements
   */
  getPasswordPolicy(): {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    specialChars: string;
  } {
    return {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };
  }

  /**
   * Validate password against policy
   */
  validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const policy = this.getPasswordPolicy();
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (
      policy.requireSpecialChars &&
      !new RegExp(
        `[${policy.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`,
      ).test(password)
    ) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get input validation rules
   */
  getInputValidationRules(): {
    email: { pattern: RegExp; maxLength: number };
    username: { pattern: RegExp; minLength: number; maxLength: number };
    url: { pattern: RegExp };
    phone: { pattern: RegExp };
  } {
    return {
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 255,
      },
      username: {
        pattern: /^[a-zA-Z0-9_-]+$/,
        minLength: 3,
        maxLength: 32,
      },
      url: {
        pattern: /^https?:\/\/.+/,
      },
      phone: {
        pattern: /^\+?[\d\s\-()]+$/,
      },
    };
  }

  /**
   * Get security audit recommendations
   */
  getSecurityRecommendations(): string[] {
    return [
      'Enable HTTPS/TLS for all communications',
      'Implement rate limiting on authentication endpoints',
      'Use strong password hashing (bcrypt with salt rounds >= 10)',
      'Implement account lockout after failed login attempts',
      'Enable two-factor authentication (2FA)',
      'Implement CSRF protection for state-changing operations',
      'Validate and sanitize all user inputs',
      'Use parameterized queries to prevent SQL injection',
      'Implement proper access control and authorization',
      'Log security events and monitor for suspicious activity',
      'Keep dependencies updated and patch vulnerabilities',
      'Implement secure session management',
      'Use secure cookies (HttpOnly, Secure, SameSite)',
      'Implement Content Security Policy (CSP)',
      'Regular security audits and penetration testing',
    ];
  }
}
