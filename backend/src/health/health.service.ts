import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthStatus } from './health.controller';

@Injectable()
export class HealthService {
  private startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  async checkHealth(): Promise<HealthStatus> {
    const databaseCheck = await this.checkDatabase();
    const memoryCheck = this.checkMemory();

    const isHealthy =
      databaseCheck.status === 'ok' && memoryCheck.status === 'ok';
    const isDegraded =
      databaseCheck.status === 'ok' && memoryCheck.status === 'warning';

    const status = isHealthy
      ? 'healthy'
      : isDegraded
        ? 'degraded'
        : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        database: databaseCheck,
        memory: memoryCheck,
      },
    };
  }

  async isReady(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkDatabase(): Promise<{
    status: 'ok' | 'error';
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      return {
        status: 'ok',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkMemory(): {
    status: 'ok' | 'warning';
    usage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
  } {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    return {
      status: heapUsedPercent > 80 ? 'warning' : 'ok',
      usage: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
    };
  }
}
