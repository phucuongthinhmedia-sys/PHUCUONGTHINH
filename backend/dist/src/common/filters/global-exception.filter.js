"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const timestamp = new Date().toISOString();
        const path = request.url;
        let status;
        let code;
        let message;
        let details;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                code = this.getErrorCodeFromStatus(status);
            }
            else if (typeof exceptionResponse === 'object') {
                message = exceptionResponse.message || exception.message;
                code =
                    exceptionResponse.error ||
                        this.getErrorCodeFromStatus(status);
                details = exceptionResponse.details;
            }
            else {
                message = exception.message;
                code = this.getErrorCodeFromStatus(status);
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            const prismaError = this.handlePrismaError(exception);
            code = prismaError.code;
            message = prismaError.message;
            details = prismaError.details;
        }
        else if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            code = 'VALIDATION_ERROR';
            message = 'Invalid data provided';
            details = exception.message;
        }
        else if (exception instanceof Error) {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            code = 'INTERNAL_SERVER_ERROR';
            message = 'An unexpected error occurred';
            details =
                process.env.NODE_ENV === 'development' ? exception.message : undefined;
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            code = 'UNKNOWN_ERROR';
            message = 'An unknown error occurred';
        }
        const isRouteMissing = exception instanceof common_1.NotFoundException &&
            (path === '/' || path === '/favicon.ico');
        if (!isRouteMissing) {
            this.logger.error(`${request.method} ${path} - ${status} - ${message}`, exception instanceof Error ? exception.stack : exception);
        }
        const errorResponse = {
            success: false,
            error: {
                code,
                message,
                details,
                timestamp,
                path,
            },
        };
        response.status(status).json(errorResponse);
    }
    getErrorCodeFromStatus(status) {
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                return 'BAD_REQUEST';
            case common_1.HttpStatus.UNAUTHORIZED:
                return 'UNAUTHORIZED';
            case common_1.HttpStatus.FORBIDDEN:
                return 'FORBIDDEN';
            case common_1.HttpStatus.NOT_FOUND:
                return 'NOT_FOUND';
            case common_1.HttpStatus.CONFLICT:
                return 'CONFLICT';
            case common_1.HttpStatus.UNPROCESSABLE_ENTITY:
                return 'VALIDATION_FAILED';
            case common_1.HttpStatus.TOO_MANY_REQUESTS:
                return 'TOO_MANY_REQUESTS';
            case common_1.HttpStatus.INTERNAL_SERVER_ERROR:
                return 'INTERNAL_SERVER_ERROR';
            default:
                return 'HTTP_ERROR';
        }
    }
    handlePrismaError(exception) {
        switch (exception.code) {
            case 'P2002':
                const target = exception.meta?.target;
                const field = target && target.length > 0 ? target[0] : 'field';
                return {
                    code: 'DUPLICATE_VALUE',
                    message: `A record with this ${field} already exists`,
                    details: { field, constraint: 'unique' },
                };
            case 'P2025':
                const cause = exception.meta?.cause;
                return {
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'The requested resource was not found',
                    details: { operation: cause || 'unknown' },
                };
            case 'P2003':
                const fieldName = exception.meta?.field_name;
                return {
                    code: 'CONSTRAINT_VIOLATION',
                    message: 'Referenced resource does not exist',
                    details: { field: fieldName || 'unknown' },
                };
            case 'P2014':
                const relationName = exception.meta?.relation_name;
                return {
                    code: 'REQUIRED_RELATION_VIOLATION',
                    message: 'The change would violate a required relation',
                    details: { relation: relationName || 'unknown' },
                };
            case 'P2000':
                const columnName = exception.meta?.column_name;
                return {
                    code: 'VALUE_TOO_LONG',
                    message: 'The provided value is too long for the database column',
                    details: { column: columnName || 'unknown' },
                };
            case 'P2001':
                const whereClause = exception.meta?.where;
                return {
                    code: 'RECORD_NOT_FOUND',
                    message: 'The record does not exist',
                    details: { where: whereClause || 'unknown' },
                };
            default:
                return {
                    code: 'DATABASE_ERROR',
                    message: 'A database error occurred',
                    details: { prismaCode: exception.code },
                };
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map