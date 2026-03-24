import { PrismaClient } from '@prisma/client';
export declare class TestDatabaseService {
    private prisma;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    cleanup(): Promise<void>;
    getPrismaClient(): PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
}
