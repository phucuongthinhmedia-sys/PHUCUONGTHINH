"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityHeadersService = void 0;
const common_1 = require("@nestjs/common");
let SecurityHeadersService = class SecurityHeadersService {
    getSecurityHeaders() {
        return {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'",
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
        };
    }
    getCsrfConfiguration() {
        return {
            headerName: 'X-CSRF-Token',
            parameterName: '_csrf',
            cookieName: 'XSRF-TOKEN',
            cookieOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            },
        };
    }
    getCorsConfiguration() {
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
            maxAge: 86400,
        };
    }
    getPasswordPolicy() {
        return {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        };
    }
    validatePassword(password) {
        const policy = this.getPasswordPolicy();
        const errors = [];
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
        if (policy.requireSpecialChars &&
            !new RegExp(`[${policy.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password)) {
            errors.push('Password must contain at least one special character');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    getInputValidationRules() {
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
    getSecurityRecommendations() {
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
};
exports.SecurityHeadersService = SecurityHeadersService;
exports.SecurityHeadersService = SecurityHeadersService = __decorate([
    (0, common_1.Injectable)()
], SecurityHeadersService);
//# sourceMappingURL=security-headers.service.js.map