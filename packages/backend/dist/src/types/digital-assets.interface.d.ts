export interface DigitalAssets {
    cover_image?: string;
    lifestyle_images?: string[];
    technical_drawings?: string[];
    architect_files?: {
        seamless_texture_map?: string;
        normal_map?: string;
        displacement_map?: string;
        cad_files?: string[];
    };
    videos?: {
        installation_guide?: string;
        product_showcase?: string;
    };
    documents?: {
        technical_sheet?: string;
        installation_guide?: string;
        care_guide?: string;
    };
}
