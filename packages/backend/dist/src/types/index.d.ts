export type { TechnicalData } from './technical-data.interface';
export type { MarketingContent } from './marketing-content.interface';
export type { DigitalAssets } from './digital-assets.interface';
export type { RelationalData } from './relational-data.interface';
export type { AISemanticLayer } from './ai-semantic-layer.interface';
import type { TechnicalData } from './technical-data.interface';
import type { MarketingContent } from './marketing-content.interface';
import type { DigitalAssets } from './digital-assets.interface';
import type { RelationalData } from './relational-data.interface';
import type { AISemanticLayer } from './ai-semantic-layer.interface';
export interface ProductJSONBFields {
    technical_data?: TechnicalData;
    marketing_content?: MarketingContent;
    digital_assets?: DigitalAssets;
    relational_data?: RelationalData;
    ai_semantic_layer?: AISemanticLayer;
}
