import { PrismaClient } from '@prisma/client';

export class TestDatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  async cleanup() {
    // Clean up in reverse order of dependencies
    // Use try-catch to handle missing tables gracefully
    try {
      await this.prisma.leadProduct.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.productSpaceTag.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.productStyleTag.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.media.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.lead.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.product.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.space.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.style.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.category.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }

    try {
      await this.prisma.user.deleteMany();
    } catch (error) {
      // Table might not exist, ignore
    }
  }

  getPrismaClient() {
    return this.prisma;
  }
}
