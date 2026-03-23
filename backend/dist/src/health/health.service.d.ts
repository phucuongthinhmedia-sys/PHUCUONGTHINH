import { PrismaService } from '../prisma/prisma.service';
import { HealthStatus } from './health.controller';
export declare class HealthService {
    private prisma;
    private startTime;
    constructor(prisma: PrismaService);
    checkHealth(): Promise<HealthStatus>;
    isReady(): Promise<boolean>;
    private checkDatabase;
    private checkMemory;
}
