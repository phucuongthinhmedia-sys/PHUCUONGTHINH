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
exports.CreateLeadDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLeadDto {
    name;
    email;
    phone;
    inquiry_type;
    project_details;
    preferred_date;
    product_ids;
    emailRequired;
    phoneRequired;
}
exports.CreateLeadDto = CreateLeadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['appointment', 'quote']),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "inquiry_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "project_details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "preferred_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateLeadDto.prototype, "product_ids", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.phone),
    (0, class_validator_1.IsNotEmpty)({ message: 'Either email or phone must be provided' }),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "emailRequired", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_validator_1.IsNotEmpty)({ message: 'Either email or phone must be provided' }),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "phoneRequired", void 0);
//# sourceMappingURL=create-lead.dto.js.map