"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AiService = AiService_1 = class AiService {
    configService;
    logger = new common_1.Logger(AiService_1.name);
    openai;
    MAX_RETRIES = 3;
    RETRY_DELAYS = [1000, 2000, 4000];
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            this.logger.warn('OPENAI_API_KEY not configured. AI extraction will not work.');
        }
        this.openai = new openai_1.default({ apiKey });
    }
    async callWithRetry(fn, context) {
        let lastError;
        for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error;
                const isLastAttempt = attempt === this.MAX_RETRIES - 1;
                const isRetryable = this.isRetryableError(error);
                if (!isRetryable || isLastAttempt) {
                    this.logger.error(`${context} failed after ${attempt + 1} attempts: ${error.message}`);
                    throw error;
                }
                const delay = this.RETRY_DELAYS[attempt];
                this.logger.warn(`${context} failed (attempt ${attempt + 1}/${this.MAX_RETRIES}), retrying in ${delay}ms...`);
                await this.sleep(delay);
            }
        }
        throw lastError;
    }
    isRetryableError(error) {
        if (error.status === 429)
            return true;
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET')
            return true;
        if (error.status >= 500 && error.status < 600)
            return true;
        return false;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async extractProducts(imageBuffer, pageNumber) {
        this.logger.log(`Extracting products from page ${pageNumber}`);
        return this.callWithRetry(async () => {
            const base64Image = imageBuffer.toString('base64');
            const prompt = `
Bạn là chuyên gia phân tích catalogue sản phẩm vật liệu xây dựng (gạch, thiết bị vệ sinh, vật liệu phụ trợ).

Hãy trích xuất TOÀN BỘ sản phẩm từ trang catalogue này. Với mỗi sản phẩm, trích xuất:

- **name**: Tên sản phẩm đầy đủ (tiếng Việt)
- **sku**: Mã sản phẩm/Model (nếu có)
- **description**: Mô tả ngắn gọn về sản phẩm
- **category**: Phân loại sản phẩm (gạch/thiết bị vệ sinh/vật liệu phụ trợ/khác)
- **specs**: Object chứa thông số kỹ thuật:
  - kich_thuoc: Kích thước (VD: "600x1200mm", "800x800mm")
  - do_day: Độ dày (VD: "10mm")
  - chat_lieu: Chất liệu (VD: "Sứ cao cấp", "Porcelain")
  - mau_sac: Màu sắc
  - xuat_xu: Xuất xứ/Thương hiệu
  - [các thông số khác tùy loại sản phẩm]
- **price_retail**: Giá bán lẻ (số, đơn vị VNĐ, không có dấu phân cách)
- **price_dealer**: Giá đại lý (nếu có)
- **unit**: Đơn vị tính ("M2", "VIEN", "BO", "CAI", "SET")

LƯU Ý QUAN TRỌNG:
- Trích xuất TẤT CẢ sản phẩm trên trang, không bỏ sót
- Nếu không tìm thấy thông tin nào, để trống (null)
- Giá phải là số nguyên, không có dấu chấm phân cách
- Đơn vị tính phải là một trong: M2, VIEN, BO, CAI, SET

Trả về JSON theo format:
{
  "products": [
    {
      "name": "Gạch Ốp Lát Porcelain 600x1200",
      "sku": "GCH-600-1200-001",
      "description": "Gạch porcelain cao cấp, bề mặt bóng",
      "category": "gạch",
      "specs": {
        "kich_thuoc": "600x1200mm",
        "do_day": "10mm",
        "chat_lieu": "Porcelain",
        "xuat_xu": "Tây Ban Nha"
      },
      "price_retail": 1500000,
      "price_dealer": 1200000,
      "unit": "M2"
    }
  ]
}
`;
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/png;base64,${base64Image}`,
                                    detail: 'high',
                                },
                            },
                        ],
                    },
                ],
                response_format: { type: 'json_object' },
                max_tokens: 4096,
                temperature: 0.1,
            });
            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('Empty response from OpenAI');
            }
            const result = JSON.parse(content);
            if (!result.products || !Array.isArray(result.products)) {
                this.logger.warn(`Invalid response format from OpenAI for page ${pageNumber}`);
                return [];
            }
            this.logger.log(`Extracted ${result.products.length} products from page ${pageNumber}`);
            return result.products;
        }, `Extract products from page ${pageNumber}`);
    }
    async healthCheck() {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 5,
            });
            return !!response.choices[0];
        }
        catch (error) {
            this.logger.error(`OpenAI health check failed: ${error.message}`);
            return false;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map