export declare class PdfService {
    private readonly logger;
    convertPageToImage(pdfPath: string, pageNumber: number): Promise<Buffer>;
    convertToImages(pdfPath: string): Promise<Buffer[]>;
    private renderPageToBuffer;
    getPageCount(pdfPath: string): Promise<number>;
    validatePdf(filePath: string): Promise<boolean>;
}
