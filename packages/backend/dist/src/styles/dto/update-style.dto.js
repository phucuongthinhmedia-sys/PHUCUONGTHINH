"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStyleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_style_dto_1 = require("./create-style.dto");
class UpdateStyleDto extends (0, mapped_types_1.PartialType)(create_style_dto_1.CreateStyleDto) {
}
exports.UpdateStyleDto = UpdateStyleDto;
//# sourceMappingURL=update-style.dto.js.map