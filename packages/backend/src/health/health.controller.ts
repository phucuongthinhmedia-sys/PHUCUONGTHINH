import { Controller, Get } from '@nestjs/common';
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

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }

  @Get('ready')
  async getReadiness(): Promise<{ ready: boolean }> {
    const isReady = await this.healthService.isReady();
    return { ready: isReady };
  }

  @Get('live')
  async getLiveness(): Promise<{ alive: boolean }> {
    return { alive: true };
  }
}
