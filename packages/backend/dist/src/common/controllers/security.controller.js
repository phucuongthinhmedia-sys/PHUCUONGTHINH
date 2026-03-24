"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const security_headers_service_1 = require("../services/security-headers.service");
const rate_limiter_service_1 = require("../services/rate-limiter.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let SecurityController = class SecurityController {
    securityHeaders;
    rateLimiter;
    constructor(securityHeaders, rateLimiter) {
        this.securityHeaders = securityHeaders;
        this.rateLimiter = rateLimiter;
    }
    getSecurityHeaders() {
        return {
            headers: this.securityHeaders.getSecurityHeaders(),
            corsConfiguration: this.securityHeaders.getCorsConfiguration(),
            csrfConfiguration: this.securityHeaders.getCsrfConfiguration(),
        };
    }
    getPasswordPolicy() {
        return this.securityHeaders.getPasswordPolicy();
    }
    getInputValidationRules() {
        return this.securityHeaders.getInputValidationRules();
    }
    getSecurityRecommendations() {
        return {
            recommendations: this.securityHeaders.getSecurityRecommendations(),
        };
    }
    getRateLimitStats() {
        return this.rateLimiter.getStats();
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Get)('headers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getSecurityHeaders", null);
__decorate([
    (0, common_1.Get)('password-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getPasswordPolicy", null);
__decorate([
    (0, common_1.Get)('input-validation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getInputValidationRules", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getSecurityRecommendations", null);
__decorate([
    (0, common_1.Get)('rate-limit-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getRateLimitStats", null);
exports.SecurityController = SecurityController = __decorate([
    (0, common_1.Controller)('security'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [security_headers_service_1.SecurityHeadersService,
        rate_limiter_service_1.RateLimiterService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map