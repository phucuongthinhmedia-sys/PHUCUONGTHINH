export interface AISemanticLayer {
    semantic_text?: {
        [language: string]: string;
    };
    embedding_vector_id?: string;
    auto_generated_tags?: string[];
    similarity_score?: number;
    content_quality_score?: number;
    last_ai_update?: string;
}
