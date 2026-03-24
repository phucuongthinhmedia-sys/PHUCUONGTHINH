import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir = path.join(
    process.cwd(),
    'uploads',
    'catalogues',
  );
  private readonly imageDir = path.join(
    process.cwd(),
    'uploads',
    'catalogue-images',
  );

  constructor() {
    // Ensure upload directories exist
    this.ensureDirectoryExists(this.uploadDir);
    this.ensureDirectoryExists(this.imageDir);
  }

  /**
   * Save uploaded PDF file to storage
   * @param file Multer file object
   * @returns Path to saved file
   */
  async savePDF(file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFilename = this.sanitizeFilename(file.originalname);
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filePath = path.join(this.uploadDir, filename);

    try {
      fs.writeFileSync(filePath, file.buffer);
      this.logger.log(`Saved PDF: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to save PDF: ${error.message}`);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Save image buffer to storage
   * @param buffer Image buffer
   * @param filename Filename for the image
   * @returns Path to saved image
   */
  async saveImage(buffer: Buffer, filename: string): Promise<string> {
    const sanitizedFilename = this.sanitizeFilename(filename);
    const filePath = path.join(this.imageDir, sanitizedFilename);

    try {
      fs.writeFileSync(filePath, buffer);
      this.logger.log(`Saved image: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to save image: ${error.message}`);
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      // Don't throw - deletion failure shouldn't break the flow
    }
  }

  /**
   * Get file size in bytes
   */
  getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      this.logger.error(`Failed to get file size: ${error.message}`);
      return 0;
    }
  }

  /**
   * Check if file exists
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Sanitize filename to prevent path traversal attacks
   */
  private sanitizeFilename(filename: string): string {
    // Remove any path separators and keep only the filename
    const basename = path.basename(filename);
    // Replace any non-alphanumeric characters (except dots, dashes, underscores) with underscore
    return basename.replace(/[^a-zA-Z0-9.-_]/g, '_');
  }

  /**
   * Ensure directory exists, create if not
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      this.logger.log(`Created directory: ${dirPath}`);
    }
  }

  /**
   * Get public URL for a file (for serving via HTTP)
   * In production, this would return S3 URL or CDN URL
   */
  getPublicUrl(filePath: string): string {
    // For local development, return relative path
    const relativePath = path.relative(process.cwd(), filePath);
    return `/${relativePath.replace(/\\/g, '/')}`;
  }
}
