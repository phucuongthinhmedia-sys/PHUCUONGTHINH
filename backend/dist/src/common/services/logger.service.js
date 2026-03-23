"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
let LoggerService = class LoggerService {
    logger = new common_1.Logger('Application');
    log(message, context) {
        const logEntry = this.formatLogEntry('INFO', message, context);
        this.logger.log(logEntry);
    }
    error(message, error, context) {
        const errorContext = {
            ...context,
            error: error?.message || error,
            stack: error?.stack,
        };
        const logEntry = this.formatLogEntry('ERROR', message, errorContext);
        this.logger.error(logEntry);
    }
    warn(message, context) {
        const logEntry = this.formatLogEntry('WARN', message, context);
        this.logger.warn(logEntry);
    }
    debug(message, context) {
        const logEntry = this.formatLogEntry('DEBUG', message, context);
        this.logger.debug(logEntry);
    }
    logRequest(method, endpoint, requestId) {
        this.log(`Incoming ${method} request`, {
            endpoint,
            method,
            requestId,
            timestamp: new Date().toISOString(),
        });
    }
    logResponse(method, endpoint, statusCode, duration, requestId) {
        this.log(`${method} ${endpoint} completed`, {
            endpoint,
            method,
            statusCode,
            duration: duration,
            requestId,
            timestamp: new Date().toISOString(),
        });
    }
    logDatabaseOperation(operation, table, duration, context) {
        this.debug(`Database ${operation} on ${table}`, {
            operation,
            table,
            duration: duration,
            ...context,
        });
    }
    logAuthenticationAttempt(email, success, context) {
        const message = success
            ? `Authentication successful for ${email}`
            : `Authentication failed for ${email}`;
        this.log(message, {
            email,
            success,
            timestamp: new Date().toISOString(),
            ...context,
        });
    }
    logAuthorizationFailure(userId, resource, context) {
        this.warn(`Authorization denied for user ${userId} accessing ${resource}`, {
            userId,
            resource,
            timestamp: new Date().toISOString(),
            ...context,
        });
    }
    formatLogEntry(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? JSON.stringify(context) : '';
        return `[${timestamp}] [${level}] ${message} ${contextStr}`.trim();
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)()
], LoggerService);
//# sourceMappingURL=logger.service.js.map