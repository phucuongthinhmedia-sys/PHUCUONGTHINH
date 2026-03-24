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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylesController = void 0;
const common_1 = require("@nestjs/common");
const styles_service_1 = require("./styles.service");
const create_style_dto_1 = require("./dto/create-style.dto");
const update_style_dto_1 = require("./dto/update-style.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StylesController = class StylesController {
    stylesService;
    constructor(stylesService) {
        this.stylesService = stylesService;
    }
    create(createStyleDto) {
        return this.stylesService.create(createStyleDto);
    }
    findAll() {
        return this.stylesService.findAll();
    }
    findOne(id) {
        return this.stylesService.findOne(id);
    }
    update(id, updateStyleDto) {
        return this.stylesService.update(id, updateStyleDto);
    }
    updatePut(id, updateStyleDto) {
        return this.stylesService.update(id, updateStyleDto);
    }
    remove(id) {
        return this.stylesService.remove(id);
    }
};
exports.StylesController = StylesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_style_dto_1.CreateStyleDto]),
    __metadata("design:returntype", void 0)
], StylesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StylesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StylesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_style_dto_1.UpdateStyleDto]),
    __metadata("design:returntype", void 0)
], StylesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_style_dto_1.UpdateStyleDto]),
    __metadata("design:returntype", void 0)
], StylesController.prototype, "updatePut", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StylesController.prototype, "remove", null);
exports.StylesController = StylesController = __decorate([
    (0, common_1.Controller)('styles'),
    __metadata("design:paramtypes", [styles_service_1.StylesService])
], StylesController);
//# sourceMappingURL=styles.controller.js.map