import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const r2Endpoint = this.configService.get('R2_ENDPOINT');
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') || 'auto',
      ...(r2Endpoint && { endpoint: r2Endpoint }),
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.bucketName =
      this.configService.get('AWS_S3_BUCKET_NAME') || 'default-bucket';
  }

  // StorageService interface implementation
  async uploadFile(file: Buffer, folder: string): Promise<string> {
    throw new NotImplementedException(
      'S3Service uses presigned URLs. Call getPresignedUploadUrl instead.',
    );
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn,
      unhoistableHeaders: new Set([
        'x-amz-checksum-crc32',
        'x-amz-sdk-checksum-algorithm',
      ]),
    });
  }

  async getPresignedDownloadUrl(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  generateS3Key(
    productId: string,
    filename: string,
    mediaType: string,
  ): string {
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `products/${productId}/${mediaType}/${Date.now()}_${sanitized}`;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  getPublicUrl(key: string): string {
    const cdnDomain = this.configService.get('CDN_DOMAIN');
    if (cdnDomain) return `https://${cdnDomain}/${key}`;
    const r2PublicUrl = this.configService.get('R2_PUBLIC_URL');
    if (r2PublicUrl) return `${r2PublicUrl}/${key}`;
    const r2Endpoint = this.configService.get('R2_ENDPOINT');
    if (r2Endpoint) return `${r2Endpoint}/${this.bucketName}/${key}`;
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }
}
