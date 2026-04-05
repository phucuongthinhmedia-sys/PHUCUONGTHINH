import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from './cache.service';

export interface SearchFilters {
  query?: string;
  categories?: string[];
  published?: 'true' | 'false' | 'all';
}

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get search suggestions based on partial query
   * Optimized with caching and targeted query
   */
  async getSearchSuggestions(partialQuery: string, limit: number = 10) {
    if (!partialQuery || partialQuery.trim().length < 2) {
      return [];
    }

    const normalizedQuery = this.normalizeSearchQuery(partialQuery);
    const cacheKey = `search_suggestions:${normalizedQuery}:${limit}`;

    return this.cacheService.cached(
      cacheKey,
      async () => {
        // Get suggestions from product names and SKUs
        // Use select to minimize data transfer
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
          take: limit * 2,
        });

        const uniqueSuggestions = new Set<string>();
        suggestions.forEach((product) => {
          if (product.name.toLowerCase().includes(normalizedQuery)) {
            uniqueSuggestions.add(product.name);
          }
          if (product.sku.toLowerCase().includes(normalizedQuery)) {
            uniqueSuggestions.add(product.sku);
          }
        });

        return Array.from(uniqueSuggestions)
          .slice(0, limit)
          .sort((a, b) => a.length - b.length);
      },
      { ttl: 3600 }, // 1 hour cache for suggestions
    );
  }

  /**
   * Combine search with other filters (inspiration, technical)
   * Optimized to fetch only necessary fields and use parallel counts
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
      if (inspirationFilters.styles?.length) {
        whereConditions.push({
          style_tags: { some: { style_id: { in: inspirationFilters.styles } } },
        });
      }
      if (inspirationFilters.spaces?.length) {
        whereConditions.push({
          space_tags: { some: { space_id: { in: inspirationFilters.spaces } } },
        });
      }
    }

    // Technical filters
    if (technicalFilters && Object.keys(technicalFilters).length > 0) {
      const techConditions = Object.entries(technicalFilters).map(
        ([key, value]) => ({
          technical_specs: { contains: `"${key}":"${value}"` },
        }),
      );
      whereConditions.push({ AND: techConditions });
    }

    const finalWhere =
      whereConditions.length > 1
        ? { AND: whereConditions }
        : whereConditions[0] || {};

    // Execute query with optimized select
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: finalWhere,
        select: {
          id: true,
          name: true,
          sku: true,
          description: true,
          category_id: true,
          technical_specs: true,
          is_published: true,
          created_at: true,
          category: { select: { id: true, name: true, slug: true } },
          style_tags: {
            select: { style: { select: { id: true, name: true } } },
          },
          space_tags: {
            select: { space: { select: { id: true, name: true } } },
          },
          media: {
            where: { is_cover: true },
            select: { id: true, file_url: true, media_type: true },
            take: 1,
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
        // Flatten tags for frontend
        style_tags: product.style_tags.map((t) => t.style),
        space_tags: product.space_tags.map((t) => t.space),
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

  async getPopularSearchTerms(limit: number = 10) {
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
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  private extractSearchTerms(normalizedQuery: string): string[] {
    return normalizedQuery.split(' ').filter((term) => term.length >= 2);
  }

  private buildBaseWhere(filters: SearchFilters): any {
    const where: any = {};
    if (filters.published === 'true') where.is_published = true;
    else if (filters.published === 'false') where.is_published = false;
    if (filters.categories?.length)
      where.category_id = { in: filters.categories };
    return where;
  }

  private buildSearchConditions(searchTerms: string[]): any[] {
    return searchTerms.flatMap((term) => [
      { name: { contains: term } },
      { sku: { contains: term } },
      { description: { contains: term } },
      { technical_specs: { contains: term } },
    ]);
  }

  private calculateRelevanceScore(product: any, searchTerms: string[]) {
    let score = 0;
    const matchFields: string[] = [];
    const name = (product.name || '').toLowerCase();
    const sku = (product.sku || '').toLowerCase();

    searchTerms.forEach((term) => {
      if (name === term) {
        score += 100;
        matchFields.push('name_exact');
      } else if (name.includes(term)) {
        score += 25;
        matchFields.push('name_contains');
      }
      if (sku === term) {
        score += 80;
        matchFields.push('sku_exact');
      } else if (sku.includes(term)) {
        score += 40;
        matchFields.push('sku_contains');
      }
    });

    return { score, matchFields: [...new Set(matchFields)] };
  }

  private parseJsonSafely(json: string): any {
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }
}
