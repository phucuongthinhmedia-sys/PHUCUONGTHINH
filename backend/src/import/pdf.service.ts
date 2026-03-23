import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';
import sharp from 'sharp';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  /**
   * Convert a single PDF page to PNG image buffer
   * @param pdfPath Path to PDF file
   * @param pageNumber Page number (1-indexed)
   * @returns Image buffer
   */
  async convertPageToImage(
    pdfPath: string,
    pageNumber: number,
  ): Promise<Buffer> {
    this.logger.log(`Converting PDF page ${pageNumber}: ${pdfPath}`);

    try {
      // Read PDF file
      const pdfBuffer = fs.readFileSync(pdfPath);

      // Load PDF document using pdf.js
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(pdfBuffer),
        useSystemFonts: true,
      });

      const pdfDoc = await loadingTask.promise;

      if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
        throw new Error(`Invalid page number: ${pageNumber}`);
      }

      const page = await pdfDoc.getPage(pageNumber);

      // Set scale for good quality (2x for high DPI)
      const scale = 2.0;
      const viewport = page.getViewport({ scale });

      // Render page to buffer
      const imageBuffer = await this.renderPageToBuffer(page, viewport);

      this.logger.log(`Converted page ${pageNumber}`);

      return imageBuffer;
    } catch (error) {
      this.logger.error(
        `Failed to convert page ${pageNumber}: ${error.message}`,
        error.stack,
      );
      throw new Error(`PDF page conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert PDF file to array of PNG image buffers
   * @param pdfPath Path to PDF file
   * @returns Array of image buffers (one per page)
   */
  async convertToImages(pdfPath: string): Promise<Buffer[]> {
    this.logger.log(`Converting PDF to images: ${pdfPath}`);

    try {
      // Read PDF file
      const pdfBuffer = fs.readFileSync(pdfPath);

      // Load PDF document using pdf.js
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(pdfBuffer),
        useSystemFonts: true,
      });

      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      this.logger.log(`PDF has ${numPages} pages`);

      const images: Buffer[] = [];

      // Process each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);

        // Set scale for good quality (2x for high DPI)
        const scale = 2.0;
        const viewport = page.getViewport({ scale });

        // Create canvas
        const canvas = {
          width: viewport.width,
          height: viewport.height,
        };

        // Render page to canvas
        const renderContext = {
          canvasContext: null as any,
          viewport: viewport,
        };

        // For Node.js, we need to use a different approach
        // We'll render to a data structure and convert to image
        const renderTask = page.render(renderContext);
        await renderTask.promise;

        // Convert canvas to PNG buffer using sharp
        // Note: This is a simplified version. In production, you might need
        // a more robust solution using node-canvas or similar
        const imageBuffer = await this.renderPageToBuffer(page, viewport);

        images.push(imageBuffer);

        this.logger.log(`Converted page ${pageNum}/${numPages}`);
      }

      return images;
    } catch (error) {
      this.logger.error(`Failed to convert PDF: ${error.message}`, error.stack);
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  }

  /**
   * Render a PDF page to PNG buffer using canvas
   */
  private async renderPageToBuffer(page: any, viewport: any): Promise<Buffer> {
    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    // Create canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to PNG buffer
    return canvas.toBuffer('image/png');
  }

  /**
   * Get number of pages in PDF
   */
  async getPageCount(pdfPath: string): Promise<number> {
    try {
      const pdfBuffer = fs.readFileSync(pdfPath);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      return pdfDoc.getPageCount();
    } catch (error) {
      this.logger.error(`Failed to get page count: ${error.message}`);
      throw new Error(`Failed to read PDF: ${error.message}`);
    }
  }

  /**
   * Validate PDF file
   */
  async validatePdf(filePath: string): Promise<boolean> {
    try {
      const pdfBuffer = fs.readFileSync(filePath);
      await PDFDocument.load(pdfBuffer);
      return true;
    } catch (error) {
      this.logger.warn(`PDF validation failed: ${error.message}`);
      return false;
    }
  }
}
