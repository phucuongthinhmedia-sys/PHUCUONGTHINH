export interface MarketingContent {
    short_description?: {
        [language: string]: string;
    };
    long_description?: {
        [language: string]: string;
    };
    target_spaces?: string[];
    design_styles?: string[];
    key_features?: {
        [language: string]: string[];
    };
    care_instructions?: {
        [language: string]: string;
    };
    seo_keywords?: {
        [language: string]: string[];
    };
}
