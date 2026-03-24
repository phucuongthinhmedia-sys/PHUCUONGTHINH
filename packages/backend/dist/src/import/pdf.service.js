"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const pdf_lib_1 = require("pdf-lib");
const pdfjsLib = __importStar(require("pdfjs-dist/legacy/build/pdf.mjs"));
const canvas_1 = require("canvas");
let PdfService = PdfService_1 = class PdfService {
    logger = new common_1.Logger(PdfService_1.name);
    async convertPageToImage(pdfPath, pageNumber) {
        this.logger.log(`Converting PDF page ${pageNumber}: ${pdfPath}`);
        try {
            const pdfBuffer = fs.readFileSync(pdfPath);
            const loadingTask = pdfjsLib.getDocument({
                data: new Uint8Array(pdfBuffer),
                useSystemFonts: true,
            });
            const pdfDoc = await loadingTask.promise;
            if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
                throw new Error(`Invalid page number: ${pageNumber}`);
            }
            const page = await pdfDoc.getPage(pageNumber);
            const scale = 2.0;
            const viewport = page.getViewport({ scale });
            const imageBuffer = await this.renderPageToBuffer(page, viewport);
            this.logger.log(`Converted page ${pageNumber}`);
            return imageBuffer;
        }
        catch (error) {
            this.logger.error(`Failed to convert page ${pageNumber}: ${error.message}`, error.stack);
            throw new Error(`PDF page conversion failed: ${error.message}`);
        }
    }
    async convertToImages(pdfPath) {
        this.logger.log(`Converting PDF to images: ${pdfPath}`);
        try {
            const pdfBuffer = fs.readFileSync(pdfPath);
            const loadingTask = pdfjsLib.getDocument({
                data: new Uint8Array(pdfBuffer),
                useSystemFonts: true,
            });
            const pdfDoc = await loadingTask.promise;
            const numPages = pdfDoc.numPages;
            this.logger.log(`PDF has ${numPages} pages`);
            const images = [];
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const scale = 2.0;
                const viewport = page.getViewport({ scale });
                const canvas = {
                    width: viewport.width,
                    height: viewport.height,
                };
                const renderContext = {
                    canvasContext: null,
                    viewport: viewport,
                };
                const renderTask = page.render(renderContext);
                await renderTask.promise;
                const imageBuffer = await this.renderPageToBuffer(page, viewport);
                images.push(imageBuffer);
                this.logger.log(`Converted page ${pageNum}/${numPages}`);
            }
            return images;
        }
        catch (error) {
            this.logger.error(`Failed to convert PDF: ${error.message}`, error.stack);
            throw new Error(`PDF conversion failed: ${error.message}`);
        }
    }
    async renderPageToBuffer(page, viewport) {
        const width = Math.floor(viewport.width);
        const height = Math.floor(viewport.height);
        const canvas = (0, canvas_1.createCanvas)(width, height);
        const context = canvas.getContext('2d');
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;
        return canvas.toBuffer('image/png');
    }
    async getPageCount(pdfPath) {
        try {
            const pdfBuffer = fs.readFileSync(pdfPath);
            const pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBuffer);
            return pdfDoc.getPageCount();
        }
        catch (error) {
            this.logger.error(`Failed to get page count: ${error.message}`);
            throw new Error(`Failed to read PDF: ${error.message}`);
        }
    }
    async validatePdf(filePath) {
        try {
            const pdfBuffer = fs.readFileSync(filePath);
            await pdf_lib_1.PDFDocument.load(pdfBuffer);
            return true;
        }
        catch (error) {
            this.logger.warn(`PDF validation failed: ${error.message}`);
            return false;
        }
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map