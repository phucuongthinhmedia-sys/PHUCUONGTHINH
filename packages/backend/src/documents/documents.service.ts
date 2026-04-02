import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../media/s3.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * Upload document to cloud storage and save metadata
   */
  async uploadDocument(
    file: Express.Multer.File,
    categoryId: string,
    uploadedBy: string,
    tags?: Array<{ entity_type: string; entity_id: string }>,
  ) {
    // Fix encoding for Vietnamese filenames
    let originalName = file.originalname;
    try {
      originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (e) {
      originalName = file.originalname;
    }

    // Generate S3 key
    const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `documents/${Date.now()}_${sanitized}`;

    // Get presigned upload URL and upload the file
    const uploadUrl = await this.s3Service.getPresignedUploadUrl(
      s3Key,
      file.mimetype,
    );

    // Upload file to S3/R2 using presigned URL
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file.buffer as any,
      headers: {
        'Content-Type': file.mimetype,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    // Get public URL for the uploaded file
    const fileUrl = this.s3Service.getPublicUrl(s3Key);

    // Save metadata to database
    const document = await this.prisma.document.create({
      data: {
        file_name: s3Key,
        original_name: originalName,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.mimetype,
        category_id: categoryId,
        uploaded_by: uploadedBy,
        tags: tags
          ? {
              create: tags.map((tag) => ({
                entity_type: tag.entity_type,
                entity_id: tag.entity_id,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return document;
  }

  /**
   * Add tags to existing document (attach to entities)
   */
  async addDocumentTag(
    documentId: string,
    entityType: string,
    entityId: string,
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const tag = await this.prisma.documentTag.create({
      data: {
        document_id: documentId,
        entity_type: entityType,
        entity_id: entityId,
      },
    });

    return tag;
  }

  /**
   * Get documents with filtering
   */
  async getDocuments(filters: {
    category_id?: string;
    entity_type?: string;
    entity_id?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters.category_id) {
      where.category_id = filters.category_id;
    }

    if (filters.search) {
      where.OR = [
        { original_name: { contains: filters.search, mode: 'insensitive' } },
        { file_name: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filter by entity relationship
    if (filters.entity_type && filters.entity_id) {
      where.tags = {
        some: {
          entity_type: filters.entity_type,
          entity_id: filters.entity_id,
        },
      };
    }

    const documents = await this.prisma.document.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return documents;
  }

  /**
   * Get documents related to a specific entity (for contextual view)
   */
  async getDocumentsByEntity(entityType: string, entityId: string) {
    const documents = await this.prisma.document.findMany({
      where: {
        tags: {
          some: {
            entity_type: entityType,
            entity_id: entityId,
          },
        },
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return documents;
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // TODO: Delete from S3/R2
    // await this.s3Service.deleteFile(document.file_name);

    // Delete from database (tags will cascade delete)
    await this.prisma.document.delete({
      where: { id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return this.prisma.documentCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  /**
   * Preview document - stream file without forcing download
   */
  async previewDocument(documentId: string, res: any) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const fileResponse = await fetch(document.file_url);
    if (!fileResponse.ok) {
      throw new NotFoundException('File not found in storage');
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Length', fileBuffer.byteLength);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodeURIComponent(document.original_name)}`,
    );
    res.end(Buffer.from(fileBuffer));
  }

  /**
   * Download document - fetch from R2 and stream to client to avoid CORS issues
   */
  async downloadDocument(documentId: string, res: any) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Fetch file from R2/cloud storage server-side
    const fileResponse = await fetch(document.file_url);
    if (!fileResponse.ok) {
      throw new NotFoundException('File not found in storage');
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    // Stream file back to client with proper headers
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(document.original_name)}`,
    );
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Length', fileBuffer.byteLength);
    res.setHeader('Cache-Control', 'no-cache');
    res.end(Buffer.from(fileBuffer));
  }
}
