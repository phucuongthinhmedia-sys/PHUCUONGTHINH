import { HealthService } from './health.service';
export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    checks: {
        database: {
            status: 'ok' | 'error';
            responseTime?: number;
            error?: string;
        };
        memory: {
            status: 'ok' | 'warning';
            usage: {
                heapUsed: number;
                heapTotal: number;
                external: number;
                rss: number;
            };
        };
    };
}
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    getHealth(): Promise<HealthStatus>;
    getReadiness(): Promise<{
        ready: boolean;
    }>;
    getLiveness(): Promise<{
        alive: boolean;
    }>;
}
