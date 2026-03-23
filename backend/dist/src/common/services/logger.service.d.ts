export interface LogContext {
    userId?: string;
    requestId?: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    duration?: number;
    error?: any;
    [key: string]: any;
}
export declare class LoggerService {
    private logger;
    log(message: string, context?: LogContext): void;
    error(message: string, error?: any, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
    logRequest(method: string, endpoint: string, requestId: string): void;
    logResponse(method: string, endpoint: string, statusCode: number, duration: number, requestId: string): void;
    logDatabaseOperation(operation: string, table: string, duration: number, context?: LogContext): void;
    logAuthenticationAttempt(email: string, success: boolean, context?: LogContext): void;
    logAuthorizationFailure(userId: string, resource: string, context?: LogContext): void;
    private formatLogEntry;
}
