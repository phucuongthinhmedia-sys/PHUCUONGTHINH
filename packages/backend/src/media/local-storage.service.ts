import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.baseUrl =
      this.configService.get('BACKEND_URL') || 'http://localhost:3001';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // StorageService interface implementation
  async uploadFile(file: Buffer, folder: string): Promise<string> {
    const key = `${folder}/${Date.now()}_upload`;
    await this.saveFile(key, file);
    return this.getPublicUrl(key);
  }

  generateS3Key(
    productId: string,
    filename: string,
    mediaType: string,
  ): string {
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `products/${productId}/${mediaType}/${Date.now()}_${sanitized}`;
  }

  getPublicUrl(key: string): string {
    return `${this.baseUrl}/uploads/${key}`;
  }

  async saveFile(key: string, buffer: Buffer): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  async getPresignedUploadUrl(
    key: string,
    _contentType: string,
  ): Promise<string> {
    return `${this.baseUrl}/api/v1/media/upload/${encodeURIComponent(key)}`;
  }

  async getPresignedDownloadUrl(key: string): Promise<string> {
    return this.getPublicUrl(key);
  }
}
