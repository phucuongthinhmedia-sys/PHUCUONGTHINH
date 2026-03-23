import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * CDN caching strategy service for media asset delivery
 * Configures cache headers and optimization strategies
 */
@Injectable()
export class CdnCachingService {
  private cdnDomain: string;

  constructor(private configService: ConfigService) {
    this.cdnDomain = this.configService.get('CDN_DOMAIN') || 'cdn.example.com';
  }

  /**
   * Get cache headers for different media types
   */
  getCacheHeaders(mediaType: string): {
    'Cache-Control': string;
    'Content-Type': string;
    'CDN-Cache-Control'?: string;
  } {
    const headers = {
      'Cache-Control': '',
      'Content-Type': this.getContentType(mediaType),
    };

    switch (mediaType) {
      case 'lifestyle':
      case 'cutout':
        // Images: cache for 30 days
        headers['Cache-Control'] = 'public, max-age=2592000, immutable';
        headers['CDN-Cache-Control'] = 'max-age=2592000';
        break;

      case 'video':
        // Videos: cache for 7 days
        headers['Cache-Control'] = 'public, max-age=604800';
        headers['CDN-Cache-Control'] = 'max-age=604800';
        break;

      case '3d_file':
        // 3D files: cache for 30 days
        headers['Cache-Control'] = 'public, max-age=2592000, immutable';
        headers['CDN-Cache-Control'] = 'max-age=2592000';
        break;

      case 'pdf':
        // PDFs: cache for 7 days
        headers['Cache-Control'] = 'public, max-age=604800';
        headers['CDN-Cache-Control'] = 'max-age=604800';
        break;

      default:
        // Default: cache for 1 hour
        headers['Cache-Control'] = 'public, max-age=3600';
        headers['CDN-Cache-Control'] = 'max-age=3600';
    }

    return headers;
  }

  /**
   * Get content type for media type
   */
  private getContentType(mediaType: string): string {
    const contentTypes = {
      lifestyle: 'image/jpeg',
      cutout: 'image/png',
      video: 'video/mp4',
      '3d_file': 'application/octet-stream',
      pdf: 'application/pdf',
    };

    return contentTypes[mediaType] || 'application/octet-stream';
  }

  /**
   * Get CDN URL for a media asset
   */
  getCdnUrl(s3Key: string): string {
    return `https://${this.cdnDomain}/${s3Key}`;
  }

  /**
   * Get image variant URLs for responsive delivery
   */
  getImageVariants(s3Key: string): {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  } {
    const baseUrl = this.getCdnUrl(s3Key);
    const keyWithoutExtension = s3Key.substring(0, s3Key.lastIndexOf('.'));
    const extension = s3Key.substring(s3Key.lastIndexOf('.'));

    return {
      thumbnail: `${baseUrl}?w=200&h=200&fit=cover`,
      medium: `${baseUrl}?w=600&h=600&fit=cover`,
      large: `${baseUrl}?w=1200&h=1200&fit=cover`,
      original: baseUrl,
    };
  }

  /**
   * Get WebP variant URL for modern browsers
   */
  getWebPVariant(s3Key: string): string {
    const keyWithoutExtension = s3Key.substring(0, s3Key.lastIndexOf('.'));
    return this.getCdnUrl(`${keyWithoutExtension}.webp`);
  }

  /**
   * Get CDN purge configuration
   */
  getPurgeConfiguration(): {
    strategy: string;
    ttl: number;
    patterns: string[];
  } {
    return {
      strategy: 'time-based',
      ttl: 2592000, // 30 days in seconds
      patterns: ['/products/*', '/media/*', '/assets/*'],
    };
  }

  /**
   * Get CDN optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    return [
      'Enable gzip compression for text-based assets',
      'Use WebP format for images with fallback to JPEG/PNG',
      'Implement lazy loading for images below the fold',
      'Use srcset for responsive image delivery',
      'Enable HTTP/2 push for critical assets',
      'Configure cache headers based on content type',
      'Use CDN edge locations for global distribution',
      'Implement cache invalidation for updated assets',
      'Monitor CDN performance metrics',
      'Use image optimization (resize, compress) at edge',
    ];
  }

  /**
   * Get cache strategy for API responses
   */
  getApiCacheStrategy(): {
    products: string;
    categories: string;
    tags: string;
    media: string;
    leads: string;
  } {
    return {
      products: 'public, max-age=300', // 5 minutes
      categories: 'public, max-age=3600', // 1 hour
      tags: 'public, max-age=3600', // 1 hour
      media: 'public, max-age=86400', // 24 hours
      leads: 'private, no-cache', // No caching for leads
    };
  }
}
