import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface InspirationFilters {
  styles?: string[];
  spaces?: string[];
}

@Injectable()
export class InspirationFilterService {
  constructor(private prisma: PrismaService) {}

  /**
   * Build where clause for inspiration-based filtering
   * Logic: Products match ANY selected style AND ANY selected space
   * (OR within tag type, AND across tag types)
   */
  buildInspirationWhere(filters: InspirationFilters): any {
    const conditions: any[] = [];

    // Style filter - match ANY of the selected styles
    if (filters.styles && filters.styles.length > 0) {
      conditions.push({
        style_tags: {
          some: {
            style_id: { in: filters.styles },
          },
        },
      });
    }

    // Space filter - match ANY of the selected spaces
    if (filters.spaces && filters.spaces.length > 0) {
      conditions.push({
        space_tags: {
          some: {
            space_id: { in: filters.spaces },
          },
        },
      });
    }

    // Return AND condition if both filters are present, otherwise return the single condition
    if (conditions.length === 0) {
      return {};
    } else if (conditions.length === 1) {
      return conditions[0];
    } else {
      return { AND: conditions };
    }
  }

  /**
   * Get available filter options for inspiration tab
   */
  async getAvailableFilters() {
    const [styles, spaces] = await Promise.all([
      this.prisma.style.findMany({
        orderBy: { name: 'asc' },
      }),
      this.prisma.space.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      styles,
      spaces,
    };
  }

  /**
   * Get filter counts for inspiration filters
   */
  async getFilterCounts(baseWhere: any = {}) {
    const [styleCounts, spaceCounts] = await Promise.all([
      // Count products for each style
      this.prisma.style.findMany({
        include: {
          _count: {
            select: {
              products: {
                where: {
                  product: baseWhere,
                },
              },
            },
          },
        },
      }),
      // Count products for each space
      this.prisma.space.findMany({
        include: {
          _count: {
            select: {
              products: {
                where: {
                  product: baseWhere,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      styles: styleCounts.map((style) => ({
        ...style,
        count: style._count.products,
      })),
      spaces: spaceCounts.map((space) => ({
        ...space,
        count: space._count.products,
      })),
    };
  }
}
