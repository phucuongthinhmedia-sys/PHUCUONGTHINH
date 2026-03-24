import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryMapperService {
  private readonly logger = new Logger(CategoryMapperService.name);

  // Keyword mapping rules
  private readonly CATEGORY_KEYWORDS = {
    gach: ['gạch', 'tile', 'ceramic', 'porcelain', 'granite', 'marble'],
    'thiet-bi-ve-sinh': [
      'lavabo',
      'bồn cầu',
      'vòi',
      'sen',
      'bồn tắm',
      'toilet',
      'sink',
      'faucet',
      'shower',
    ],
    'vat-lieu-phu-tro': [
      'keo',
      'xi măng',
      'vữa',
      'chống thấm',
      'adhesive',
      'cement',
    ],
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Map product name to category ID based on keywords
   * @param productName Product name to analyze
   * @returns Category ID or null if no match
   */
  async mapCategory(productName: string): Promise<string | null> {
    if (!productName) return null;

    const lowerName = productName.toLowerCase();

    // Try to match keywords
    for (const [categorySlug, keywords] of Object.entries(
      this.CATEGORY_KEYWORDS,
    )) {
      for (const keyword of keywords) {
        if (lowerName.includes(keyword.toLowerCase())) {
          // Find category by slug
          const category = await this.prisma.category.findFirst({
            where: {
              slug: {
                contains: categorySlug,
              },
            },
          });

          if (category) {
            this.logger.log(
              `Mapped "${productName}" to category "${category.name}" (${category.id})`,
            );
            return category.id;
          }
        }
      }
    }

    this.logger.warn(`Could not map category for product: ${productName}`);
    return null;
  }

  /**
   * Batch map multiple products
   */
  async mapCategories(
    productNames: string[],
  ): Promise<Map<string, string | null>> {
    const result = new Map<string, string | null>();

    for (const name of productNames) {
      const categoryId = await this.mapCategory(name);
      result.set(name, categoryId);
    }

    return result;
  }
}
