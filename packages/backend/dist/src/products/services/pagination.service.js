"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const common_1 = require("@nestjs/common");
let PaginationService = class PaginationService {
    DEFAULT_LIMIT = 20;
    MAX_LIMIT = 100;
    calculatePagination(total, options = {}) {
        const page = Math.max(1, options.page || 1);
        const maxLimit = options.maxLimit || this.MAX_LIMIT;
        const limit = Math.min(Math.max(1, options.limit || this.DEFAULT_LIMIT), maxLimit);
        const offset = (page - 1) * limit;
        const total_pages = Math.ceil(total / limit);
        const has_next = page < total_pages;
        const has_previous = page > 1;
        return {
            page,
            limit,
            total,
            total_pages,
            has_next,
            has_previous,
            offset,
        };
    }
    createPaginatedResponse(data, total, options = {}) {
        const pagination = this.calculatePagination(total, options);
        return {
            data,
            pagination,
        };
    }
    validatePaginationOptions(options) {
        const errors = [];
        if (options.page !== undefined) {
            if (!Number.isInteger(options.page) || options.page < 1) {
                errors.push('Page must be a positive integer');
            }
        }
        if (options.limit !== undefined) {
            if (!Number.isInteger(options.limit) || options.limit < 1) {
                errors.push('Limit must be a positive integer');
            }
            const maxLimit = options.maxLimit || this.MAX_LIMIT;
            if (options.limit > maxLimit) {
                errors.push(`Limit cannot exceed ${maxLimit}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    createCursorPagination(data, limit, hasMore) {
        const nextCursor = hasMore && data.length > 0
            ? Buffer.from(JSON.stringify({
                id: data[data.length - 1].id,
                created_at: data[data.length - 1].created_at.toISOString(),
            })).toString('base64')
            : undefined;
        return {
            data,
            pagination: {
                limit,
                has_next: hasMore,
                next_cursor: nextCursor,
            },
        };
    }
    parseCursor(cursor) {
        try {
            const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
            const parsed = JSON.parse(decoded);
            if (parsed.id && parsed.created_at) {
                return parsed;
            }
            return null;
        }
        catch {
            return null;
        }
    }
    calculateOptimalBatchSize(totalItems, maxBatchSize = 1000) {
        if (totalItems <= 100)
            return totalItems;
        if (totalItems <= 1000)
            return Math.ceil(totalItems / 2);
        return Math.min(maxBatchSize, Math.ceil(totalItems / 10));
    }
    createPaginationLinks(baseUrl, pagination, queryParams = {}) {
        const createUrl = (page) => {
            const params = new URLSearchParams({
                ...queryParams,
                page: page.toString(),
                limit: pagination.limit.toString(),
            });
            return `${baseUrl}?${params.toString()}`;
        };
        const links = {};
        if (pagination.page > 1) {
            links.first = createUrl(1);
        }
        if (pagination.has_previous) {
            links.previous = createUrl(pagination.page - 1);
        }
        if (pagination.has_next) {
            links.next = createUrl(pagination.page + 1);
        }
        if (pagination.page < pagination.total_pages) {
            links.last = createUrl(pagination.total_pages);
        }
        return links;
    }
};
exports.PaginationService = PaginationService;
exports.PaginationService = PaginationService = __decorate([
    (0, common_1.Injectable)()
], PaginationService);
//# sourceMappingURL=pagination.service.js.map