"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtils = void 0;
class ResponseUtils {
    static success(data, message, path) {
        return {
            success: true,
            data,
            message,
        };
    }
    static paginated(data, pagination, message) {
        return {
            success: true,
            data,
            pagination,
            message,
        };
    }
    static created(data, message = 'Resource created successfully') {
        return {
            success: true,
            data,
            message,
        };
    }
    static updated(data, message = 'Resource updated successfully') {
        return {
            success: true,
            data,
            message,
        };
    }
    static deleted(message = 'Resource deleted successfully') {
        return {
            success: true,
            data: null,
            message,
        };
    }
}
exports.ResponseUtils = ResponseUtils;
//# sourceMappingURL=response.utils.js.map