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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_decorator_1 = require("../decorators/user.decorator");
let ProtectedController = class ProtectedController {
    getAuthenticatedData(user) {
        return {
            message: 'This data requires authentication',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
    getAdminOnlyData(user) {
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
    getManagementData(user) {
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
};
exports.ProtectedController = ProtectedController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('authenticated'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProtectedController.prototype, "getAuthenticatedData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('admin-only'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProtectedController.prototype, "getAdminOnlyData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, common_1.Get)('management'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProtectedController.prototype, "getManagementData", null);
exports.ProtectedController = ProtectedController = __decorate([
    (0, common_1.Controller)('protected')
], ProtectedController);
//# sourceMappingURL=protected.controller.js.map