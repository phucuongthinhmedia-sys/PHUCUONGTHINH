export declare class SecurityHeadersService {
    getSecurityHeaders(): Record<string, string>;
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
    };
    getCorsConfiguration(): {
        origin: string[];
        credentials: boolean;
        methods: string[];
        allowedHeaders: string[];
        exposedHeaders: string[];
        maxAge: number;
    };
    getPasswordPolicy(): {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        specialChars: string;
    };
    validatePassword(password: string): {
        valid: boolean;
        errors: string[];
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
    getSecurityRecommendations(): string[];
}
