import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface TechnicalFilters {
  format?: string[];
  color_palette?: string[];
  material?: string[];
  slip_rating?: string[];
  thickness?: { min?: number; max?: number };
  dimensions?: {
    length?: { min?: number; max?: number };
    width?: { min?: number; max?: number };
  };
  [key: string]: any; // Allow arbitrary technical spec filters
}

@Injectable()
export class TechnicalFilterService {
  constructor(private prisma: PrismaService) {}

  /**
   * Build where clause for technical specification filtering
   * Uses JSON queries for SQLite technical_specs field
   */
  buildTechnicalWhere(filters: TechnicalFilters): any {
    const conditions: any[] = [];

    // Handle each technical specification filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value) && value.length > 0) {
        // Array filters - match any of the values
        const orConditions = value.map((val) => ({
          technical_specs: {
            contains: `"${key}":"${val}"`,
          },
        }));
        conditions.push({ OR: orConditions });
      } else if (
        (typeof value === 'object' && value.min !== undefined) ||
        value.max !== undefined
      ) {
        // Range filters for numeric values
        if (value.min !== undefined) {
          conditions.push({
            technical_specs: {
              contains: `"${key}":`,
            },
          });
          // Note: For proper numeric range filtering in production,
          // consider using PostgreSQL with proper JSONB operators
        }
        if (value.max !== undefined) {
          conditions.push({
            technical_specs: {
              contains: `"${key}":`,
            },
          });
        }
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        // Exact match filters
        conditions.push({
          technical_specs: {
            contains: `"${key}":"${value}"`,
          },
        });
      }
    });

    return conditions.length > 0 ? { AND: conditions } : {};
  }

  /**
   * Extract available technical specification options from existing products
   */
  async getAvailableTechnicalFilters(baseWhere: any = {}) {
    // Get all products to analyze their technical specs
    const products = await this.prisma.product.findMany({
      where: baseWhere,
      select: {
        technical_specs: true,
      },
    });

    const technicalOptions: Record<string, Set<any>> = {};

    // Parse and aggregate technical specifications
    products.forEach((product) => {
      try {
        const specs = JSON.parse(product.technical_specs);
        Object.entries(specs).forEach(([key, value]) => {
          if (!technicalOptions[key]) {
            technicalOptions[key] = new Set();
          }

          if (Array.isArray(value)) {
            value.forEach((v) => technicalOptions[key].add(v));
          } else {
            technicalOptions[key].add(value);
          }
        });
      } catch (error) {
        // Skip invalid JSON
      }
    });

    // Convert sets to arrays and sort
    const result: Record<string, any[]> = {};
    Object.entries(technicalOptions).forEach(([key, valueSet]) => {
      result[key] = Array.from(valueSet).sort();
    });

    return result;
  }

  /**
   * Get common technical specification fields for the UI
   */
  getCommonTechnicalFields() {
    return {
      format: ['Slab', 'Mosaic', 'Hexagon', 'Subway', 'Penny Round'],
      material: ['Porcelain', 'Ceramic', 'Natural Stone', 'Glass', 'Metal'],
      finish: ['Matte', 'Glossy', 'Textured', 'Polished', 'Honed'],
      slip_rating: ['R9', 'R10', 'R11', 'R12', 'R13'],
      color_palette: [
        'White',
        'Black',
        'Grey',
        'Beige',
        'Brown',
        'Blue',
        'Green',
      ],
    };
  }

  /**
   * Validate technical specification filters
   */
  validateTechnicalFilters(filters: TechnicalFilters): boolean {
    // Basic validation - ensure no malicious JSON injection
    try {
      Object.entries(filters).forEach(([key, value]) => {
        if (
          typeof key !== 'string' ||
          key.includes('"') ||
          key.includes('\\')
        ) {
          throw new Error('Invalid filter key');
        }

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (
              typeof v === 'string' &&
              (v.includes('"') || v.includes('\\'))
            ) {
              throw new Error('Invalid filter value');
            }
          });
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}
