import { Injectable } from '@nestjs/common';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limiting service to prevent abuse
 * Tracks requests per IP/user and enforces limits
 */
@Injectable()
export class RateLimiterService {
  private limits = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredEntries();
      },
      5 * 60 * 1000,
    );
  }

  /**
   * Check if request is within rate limit
   */
  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    // Check if within limit
    if (entry.count < config.maxRequests) {
      entry.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string, config: RateLimitConfig): number {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      return config.maxRequests;
    }

    return Math.max(0, config.maxRequests - entry.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key);
    return entry ? entry.resetTime : null;
  }

  /**
   * Reset limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all limits
   */
  clear(): void {
    this.limits.clear();
  }

  /**
   * Get rate limit statistics
   */
  getStats(): {
    totalKeys: number;
    keys: Array<{ key: string; count: number; resetTime: number }>;
  } {
    const keys = Array.from(this.limits.entries()).map(([key, entry]) => ({
      key,
      count: entry.count,
      resetTime: entry.resetTime,
    }));

    return {
      totalKeys: this.limits.size,
      keys,
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let count = 0;

    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
        count++;
      }
    }

    if (count > 0) {
      console.log(`Rate limiter cleanup: removed ${count} expired entries`);
    }
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.limits.clear();
  }
}
