import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from './cache.service';

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
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

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
        // Use a more robust regex-like approach if supported, or multiple ORs
        const orConditions = value.map((val) => ({
          technical_specs: {
            contains: `"${key}":"${val}"`,
          },
        }));
        conditions.push({ OR: orConditions });
      } else if (
        typeof value === 'object' &&
        (value.min !== undefined || value.max !== undefined)
      ) {
        // For range filters in SQLite string-based JSON, we can only check for existence
        // and then filter in memory if needed, or use a more complex SQL fragment.
        // For now, we keep it simple but acknowledge the limitation.
        conditions.push({
          technical_specs: {
            contains: `"${key}":`,
          },
        });
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
   * Optimized with caching to avoid full table scans on every request
   */
  async getAvailableTechnicalFilters(baseWhere: any = {}) {
    const cacheKey = `available_technical_filters:${JSON.stringify(baseWhere)}`;

    return this.cacheService.cached(
      cacheKey,
      async () => {
        // Get all products to analyze their technical specs
        // Only fetch technical_specs to minimize I/O
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
            if (!product.technical_specs) return;
            const specs = JSON.parse(product.technical_specs);
            Object.entries(specs).forEach(([key, value]) => {
              // Skip internal/system keys
              if (
                [
                  'slug',
                  'meta_title',
                  'meta_description',
                  'product_type',
                  'badges',
                ].includes(key)
              )
                return;

              if (!technicalOptions[key]) {
                technicalOptions[key] = new Set();
              }

              if (Array.isArray(value)) {
                value.forEach((v) => {
                  if (v !== null && v !== undefined)
                    technicalOptions[key].add(v);
                });
              } else if (value !== null && value !== undefined) {
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
          result[key] = Array.from(valueSet).sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') return a - b;
            return String(a).localeCompare(String(b));
          });
        });

        return result;
      },
      { ttl: 600 }, // 10 minutes cache
    );
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
