import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SearchFilters {
  query?: string;
  categories?: string[];
  published?: 'true' | 'false' | 'all';
}

export interface SearchResult {
  id: string;
  name: string;
  sku: string;
  description?: string;
  relevance_score: number;
  match_fields: string[];
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * Perform full-text search across product names, SKUs, and descriptions
   * with relevance scoring and ranking
   */
  async searchProducts(
    searchQuery: string,
    filters: SearchFilters = {},
    limit: number = 20,
    offset: number = 0,
  ) {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return {
        products: [],
        total: 0,
        query: searchQuery,
      };
    }

    const normalizedQuery = this.normalizeSearchQuery(searchQuery);
    const searchTerms = this.extractSearchTerms(normalizedQuery);

    // Build base where clause for filters
    const baseWhere = this.buildBaseWhere(filters);

    // Build search conditions
    const searchConditions = this.buildSearchConditions(searchTerms);

    // Combine base filters with search conditions
    const finalWhere = {
      ...baseWhere,
      AND: [...(baseWhere.AND || []), { OR: searchConditions }],
    };

    // Execute search query
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: finalWhere,
        include: {
          category: true,
          style_tags: {
            include: {
              style: true,
            },
          },
          space_tags: {
            include: {
              space: true,
            },
          },
          media: {
            where: { is_cover: true },
            take: 1,
          },
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where: finalWhere }),
    ]);

    // Calculate relevance scores and add match information
    const productsWithRelevance = products.map((product) => {
      const relevanceData = this.calculateRelevanceScore(product, searchTerms);
      return {
        ...product,
        technical_specs: this.parseJsonSafely(product.technical_specs),
        relevance_score: relevanceData.score,
        match_fields: relevanceData.matchFields,
      };
    });

    // Sort by relevance score (highest first)
    productsWithRelevance.sort((a, b) => b.relevance_score - a.relevance_score);

    return {
      products: productsWithRelevance,
      total,
      query: searchQuery,
      search_terms: searchTerms,
    };
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSearchSuggestions(partialQuery: string, limit: number = 10) {
    if (!partialQuery || partialQuery.trim().length < 2) {
      return [];
    }

    const normalizedQuery = this.normalizeSearchQuery(partialQuery);

    // Get suggestions from product names and SKUs
    const suggestions = await this.prisma.product.findMany({
      where: {
        is_published: true,
        OR: [
          { name: { contains: normalizedQuery } },
          { sku: { contains: normalizedQuery } },
        ],
      },
      select: {
        name: true,
        sku: true,
      },
      take: limit * 2, // Get more to filter duplicates
    });

    // Extract unique suggestions
    const uniqueSuggestions = new Set<string>();

    suggestions.forEach((product) => {
      // Add product name if it matches
      if (product.name.toLowerCase().includes(normalizedQuery.toLowerCase())) {
        uniqueSuggestions.add(product.name);
      }

      // Add SKU if it matches
      if (product.sku.toLowerCase().includes(normalizedQuery.toLowerCase())) {
        uniqueSuggestions.add(product.sku);
      }
    });

    return Array.from(uniqueSuggestions)
      .slice(0, limit)
      .sort((a, b) => a.length - b.length); // Shorter matches first
  }

  /**
   * Get popular search terms for analytics
   */
  async getPopularSearchTerms(limit: number = 10) {
    // This would typically be implemented with a search analytics table
    // For now, return common product-related terms
    return [
      'tile',
      'porcelain',
      'ceramic',
      'bathroom',
      'kitchen',
      'floor',
      'wall',
      'mosaic',
      'marble',
      'granite',
    ].slice(0, limit);
  }

  private normalizeSearchQuery(query: string): string {
    return query
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  private extractSearchTerms(normalizedQuery: string): string[] {
    return normalizedQuery
      .split(' ')
      .filter((term) => term.length > 0)
      .filter((term) => term.length >= 2); // Ignore single characters
  }

  private buildBaseWhere(filters: SearchFilters): any {
    const where: any = {};

    // Published filter
    if (filters.published === 'true') {
      where.is_published = true;
    } else if (filters.published === 'false') {
      where.is_published = false;
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      where.category_id = { in: filters.categories };
    }

    return where;
  }

  private buildSearchConditions(searchTerms: string[]): any[] {
    const conditions: any[] = [];

    searchTerms.forEach((term) => {
      // Search in name (highest priority)
      conditions.push({ name: { contains: term } });

      // Search in SKU (high priority)
      conditions.push({ sku: { contains: term } });

      // Search in description (medium priority)
      conditions.push({ description: { contains: term } });

      // Search in technical specs (lower priority)
      conditions.push({
        technical_specs: { contains: term },
      });
    });

    return conditions;
  }

  private calculateRelevanceScore(
    product: any,
    searchTerms: string[],
  ): {
    score: number;
    matchFields: string[];
  } {
    let score = 0;
    const matchFields: string[] = [];

    const productName = (product.name || '').toLowerCase();
    const productSku = (product.sku || '').toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    const productTechnicalSpecs = (product.technical_specs || '').toLowerCase();

    searchTerms.forEach((term) => {
      const lowerTerm = term.toLowerCase();

      // Exact matches in name (highest score)
      if (productName === lowerTerm) {
        score += 100;
        matchFields.push('name_exact');
      } else if (productName.includes(lowerTerm)) {
        // Partial matches in name
        if (productName.startsWith(lowerTerm)) {
          score += 50; // Prefix match
          matchFields.push('name_prefix');
        } else {
          score += 25; // Contains match
          matchFields.push('name_contains');
        }
      }

      // SKU matches (high score)
      if (productSku === lowerTerm) {
        score += 80;
        matchFields.push('sku_exact');
      } else if (productSku.includes(lowerTerm)) {
        score += 40;
        matchFields.push('sku_contains');
      }

      // Description matches (medium score)
      if (productDescription.includes(lowerTerm)) {
        score += 15;
        matchFields.push('description');
      }

      // Technical specs matches (lower score)
      if (productTechnicalSpecs.includes(lowerTerm)) {
        score += 10;
        matchFields.push('technical_specs');
      }
    });

    // Boost score for products with more matches
    const uniqueMatchFields = [...new Set(matchFields)];
    score += uniqueMatchFields.length * 5;

    return {
      score,
      matchFields: uniqueMatchFields,
    };
  }

  private parseJsonSafely(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch {
      return {};
    }
  }

  /**
   * Combine search with other filters (inspiration, technical)
   */
  async searchWithFilters(
    searchQuery: string,
    inspirationFilters?: any,
    technicalFilters?: any,
    baseFilters?: SearchFilters,
    pagination?: { page: number; limit: number },
  ) {
    const { page = 1, limit = 20 } = pagination || {};
    const offset = (page - 1) * limit;

    // If no search query, return empty results
    if (!searchQuery || searchQuery.trim().length === 0) {
      return {
        products: [],
        total: 0,
        pagination: { page, limit, total: 0, total_pages: 0 },
        query: searchQuery,
      };
    }

    const normalizedQuery = this.normalizeSearchQuery(searchQuery);
    const searchTerms = this.extractSearchTerms(normalizedQuery);

    // Build complex where clause combining search with filters
    const whereConditions: any[] = [];

    // Base filters
    const baseWhere = this.buildBaseWhere(baseFilters || {});
    if (Object.keys(baseWhere).length > 0) {
      whereConditions.push(baseWhere);
    }

    // Search conditions
    const searchConditions = this.buildSearchConditions(searchTerms);
    whereConditions.push({ OR: searchConditions });

    // Inspiration filters
    if (inspirationFilters) {
      if (inspirationFilters.styles && inspirationFilters.styles.length > 0) {
        whereConditions.push({
          style_tags: {
            some: {
              style_id: { in: inspirationFilters.styles },
            },
          },
        });
      }

      if (inspirationFilters.spaces && inspirationFilters.spaces.length > 0) {
        whereConditions.push({
          space_tags: {
            some: {
              space_id: { in: inspirationFilters.spaces },
            },
          },
        });
      }
    }

    // Technical filters (simplified for SQLite)
    if (technicalFilters && Object.keys(technicalFilters).length > 0) {
      const techConditions = Object.entries(technicalFilters).map(
        ([key, value]) => ({
          technical_specs: {
            contains: `"${key}":"${value}"`,
          },
        }),
      );
      whereConditions.push({ AND: techConditions });
    }

    const finalWhere =
      whereConditions.length > 1
        ? { AND: whereConditions }
        : whereConditions[0] || {};

    // Execute query
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: finalWhere,
        include: {
          category: true,
          style_tags: {
            include: {
              style: true,
            },
          },
          space_tags: {
            include: {
              space: true,
            },
          },
          media: {
            orderBy: {
              sort_order: 'asc',
            },
          },
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where: finalWhere }),
    ]);

    // Calculate relevance and sort
    const productsWithRelevance = products.map((product) => {
      const relevanceData = this.calculateRelevanceScore(product, searchTerms);
      return {
        ...product,
        technical_specs: this.parseJsonSafely(product.technical_specs),
        relevance_score: relevanceData.score,
        match_fields: relevanceData.matchFields,
      };
    });

    productsWithRelevance.sort((a, b) => b.relevance_score - a.relevance_score);

    return {
      products: productsWithRelevance,
      total,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      query: searchQuery,
      search_terms: searchTerms,
    };
  }
}
