import { SecurityHeadersService } from '../services/security-headers.service';
import { RateLimiterService } from '../services/rate-limiter.service';
export declare class SecurityController {
    private securityHeaders;
    private rateLimiter;
    constructor(securityHeaders: SecurityHeadersService, rateLimiter: RateLimiterService);
    getSecurityHeaders(): {
        headers: Record<string, string>;
        corsConfiguration: {
            origin: string[];
            credentials: boolean;
            methods: string[];
            allowedHeaders: string[];
            exposedHeaders: string[];
            maxAge: number;
        };
        csrfConfiguration: {
            headerName: string;
            parameterName: string;
            cookieName: string;
            cookieOptions: {
                httpOnly: boolean;
                secure: boolean;
                sameSite: string;
                maxAge: number;
            };
        };
    };
    getPasswordPolicy(): {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        specialChars: string;
    };
    getInputValidationRules(): {
        email: {
            pattern: RegExp;
            maxLength: number;
        };
        username: {
            pattern: RegExp;
            minLength: number;
            maxLength: number;
        };
        url: {
            pattern: RegExp;
        };
        phone: {
            pattern: RegExp;
        };
    };
    getSecurityRecommendations(): {
        recommendations: string[];
    };
    getRateLimitStats(): {
        totalKeys: number;
        keys: Array<{
            key: string;
            count: number;
            resetTime: number;
        }>;
    };
}
