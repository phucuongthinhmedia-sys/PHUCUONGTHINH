export declare class DimensionsDto {
    width_mm?: number;
    length_mm?: number;
    thickness_mm?: number;
    weight_kg?: number;
}
export declare class PerformanceSpecsDto {
    slip_resistance?: string;
    water_absorption?: number;
    frost_resistance?: boolean;
    fire_rating?: string;
    wear_rating?: string;
}
export declare class InstallationDto {
    method?: string[];
    tools_required?: string[];
    difficulty_level?: 'easy' | 'medium' | 'hard';
}
export declare class TechnicalDataDto {
    dimensions?: DimensionsDto;
    material?: string;
    performance_specs?: PerformanceSpecsDto;
    installation?: InstallationDto;
    certifications?: string[];
    warranty_years?: number;
}
export declare class MarketingContentDto {
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
export declare class ArchitectFilesDto {
    seamless_texture_map?: string;
    normal_map?: string;
    displacement_map?: string;
    cad_files?: string[];
}
export declare class VideosDto {
    installation_guide?: string;
    product_showcase?: string;
}
export declare class DocumentsDto {
    technical_sheet?: string;
    installation_guide?: string;
    care_guide?: string;
}
export declare class DigitalAssetsDto {
    cover_image?: string;
    lifestyle_images?: string[];
    technical_drawings?: string[];
    architect_files?: ArchitectFilesDto;
    videos?: VideosDto;
    documents?: DocumentsDto;
}
export declare class RelationalDataDto {
    matching_grouts?: string[];
    similar_alternatives?: string[];
    complementary_products?: string[];
    required_accessories?: string[];
    color_variants?: string[];
    size_variants?: string[];
}
export declare class AISemanticLayerDto {
    semantic_text?: {
        [language: string]: string;
    };
    embedding_vector_id?: string;
    auto_generated_tags?: string[];
    similarity_score?: number;
    content_quality_score?: number;
    last_ai_update?: string;
}
