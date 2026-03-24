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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISemanticLayerDto = exports.RelationalDataDto = exports.DigitalAssetsDto = exports.DocumentsDto = exports.VideosDto = exports.ArchitectFilesDto = exports.MarketingContentDto = exports.TechnicalDataDto = exports.InstallationDto = exports.PerformanceSpecsDto = exports.DimensionsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DimensionsDto {
    width_mm;
    length_mm;
    thickness_mm;
    weight_kg;
}
exports.DimensionsDto = DimensionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "width_mm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "length_mm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "thickness_mm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "weight_kg", void 0);
class PerformanceSpecsDto {
    slip_resistance;
    water_absorption;
    frost_resistance;
    fire_rating;
    wear_rating;
}
exports.PerformanceSpecsDto = PerformanceSpecsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceSpecsDto.prototype, "slip_resistance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PerformanceSpecsDto.prototype, "water_absorption", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PerformanceSpecsDto.prototype, "frost_resistance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceSpecsDto.prototype, "fire_rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceSpecsDto.prototype, "wear_rating", void 0);
class InstallationDto {
    method;
    tools_required;
    difficulty_level;
}
exports.InstallationDto = InstallationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], InstallationDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], InstallationDto.prototype, "tools_required", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['easy', 'medium', 'hard']),
    __metadata("design:type", String)
], InstallationDto.prototype, "difficulty_level", void 0);
class TechnicalDataDto {
    dimensions;
    material;
    performance_specs;
    installation;
    certifications;
    warranty_years;
}
exports.TechnicalDataDto = TechnicalDataDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DimensionsDto),
    __metadata("design:type", DimensionsDto)
], TechnicalDataDto.prototype, "dimensions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TechnicalDataDto.prototype, "material", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PerformanceSpecsDto),
    __metadata("design:type", PerformanceSpecsDto)
], TechnicalDataDto.prototype, "performance_specs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => InstallationDto),
    __metadata("design:type", InstallationDto)
], TechnicalDataDto.prototype, "installation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TechnicalDataDto.prototype, "certifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TechnicalDataDto.prototype, "warranty_years", void 0);
class MarketingContentDto {
    short_description;
    long_description;
    target_spaces;
    design_styles;
    key_features;
    care_instructions;
    seo_keywords;
}
exports.MarketingContentDto = MarketingContentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MarketingContentDto.prototype, "short_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MarketingContentDto.prototype, "long_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MarketingContentDto.prototype, "target_spaces", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MarketingContentDto.prototype, "design_styles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MarketingContentDto.prototype, "key_features", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MarketingContentDto.prototype, "care_instructions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MarketingContentDto.prototype, "seo_keywords", void 0);
class ArchitectFilesDto {
    seamless_texture_map;
    normal_map;
    displacement_map;
    cad_files;
}
exports.ArchitectFilesDto = ArchitectFilesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArchitectFilesDto.prototype, "seamless_texture_map", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArchitectFilesDto.prototype, "normal_map", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArchitectFilesDto.prototype, "displacement_map", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ArchitectFilesDto.prototype, "cad_files", void 0);
class VideosDto {
    installation_guide;
    product_showcase;
}
exports.VideosDto = VideosDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideosDto.prototype, "installation_guide", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideosDto.prototype, "product_showcase", void 0);
class DocumentsDto {
    technical_sheet;
    installation_guide;
    care_guide;
}
exports.DocumentsDto = DocumentsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentsDto.prototype, "technical_sheet", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentsDto.prototype, "installation_guide", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentsDto.prototype, "care_guide", void 0);
class DigitalAssetsDto {
    cover_image;
    lifestyle_images;
    technical_drawings;
    architect_files;
    videos;
    documents;
}
exports.DigitalAssetsDto = DigitalAssetsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DigitalAssetsDto.prototype, "cover_image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DigitalAssetsDto.prototype, "lifestyle_images", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DigitalAssetsDto.prototype, "technical_drawings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArchitectFilesDto),
    __metadata("design:type", ArchitectFilesDto)
], DigitalAssetsDto.prototype, "architect_files", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VideosDto),
    __metadata("design:type", VideosDto)
], DigitalAssetsDto.prototype, "videos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DocumentsDto),
    __metadata("design:type", DocumentsDto)
], DigitalAssetsDto.prototype, "documents", void 0);
class RelationalDataDto {
    matching_grouts;
    similar_alternatives;
    complementary_products;
    required_accessories;
    color_variants;
    size_variants;
}
exports.RelationalDataDto = RelationalDataDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RelationalDataDto.prototype, "matching_grouts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RelationalDataDto.prototype, "similar_alternatives", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RelationalDataDto.prototype, "complementary_products", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RelationalDataDto.prototype, "required_accessories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RelationalDataDto.prototype, "color_variants", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RelationalDataDto.prototype, "size_variants", void 0);
class AISemanticLayerDto {
    semantic_text;
    embedding_vector_id;
    auto_generated_tags;
    similarity_score;
    content_quality_score;
    last_ai_update;
}
exports.AISemanticLayerDto = AISemanticLayerDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AISemanticLayerDto.prototype, "semantic_text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AISemanticLayerDto.prototype, "embedding_vector_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AISemanticLayerDto.prototype, "auto_generated_tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AISemanticLayerDto.prototype, "similarity_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AISemanticLayerDto.prototype, "content_quality_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], AISemanticLayerDto.prototype, "last_ai_update", void 0);
//# sourceMappingURL=jsonb-validation.dto.js.map