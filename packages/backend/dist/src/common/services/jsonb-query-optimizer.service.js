"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JsonbQueryOptimizerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonbQueryOptimizerService = void 0;
const common_1 = require("@nestjs/common");
let JsonbQueryOptimizerService = JsonbQueryOptimizerService_1 = class JsonbQueryOptimizerService {
    logger = new common_1.Logger(JsonbQueryOptimizerService_1.name);
    optimizeJsonbQuery(tableName, jsonbColumn, operation, path) {
        const recommendations = [];
        let optimizedQuery = '';
        let estimatedGain = 0;
        switch (operation.toLowerCase()) {
            case 'containment':
                optimizedQuery = this.optimizeContainmentQuery(tableName, jsonbColumn);
                recommendations.push(`CREATE INDEX CONCURRENTLY ${tableName}_${jsonbColumn}_gin_idx ON ${tableName} USING GIN (${jsonbColumn});`);
                estimatedGain = 70;
                break;
            case 'path_lookup':
                if (path) {
                    optimizedQuery = this.optimizePathQuery(tableName, jsonbColumn, path);
                    recommendations.push(`CREATE INDEX CONCURRENTLY ${tableName}_${jsonbColumn}_${path}_gin_idx ON ${tableName} USING GIN ((${jsonbColumn}->'${path}'));`);
                    estimatedGain = 60;
                }
                break;
            case 'existence':
                optimizedQuery = this.optimizeExistenceQuery(tableName, jsonbColumn, path);
                recommendations.push(`CREATE INDEX CONCURRENTLY ${tableName}_${jsonbColumn}_gin_idx ON ${tableName} USING GIN (${jsonbColumn});`);
                estimatedGain = 50;
                break;
        }
        return {
            originalQuery: `SELECT * FROM ${tableName} WHERE ${jsonbColumn}...`,
            optimizedQuery,
            indexRecommendations: recommendations,
            estimatedPerformanceGain: estimatedGain,
        };
    }
    optimizeContainmentQuery(tableName, jsonbColumn) {
        return `SELECT * FROM ${tableName} WHERE ${jsonbColumn} @> $1`;
    }
    optimizePathQuery(tableName, jsonbColumn, path) {
        return `SELECT * FROM ${tableName} WHERE ${jsonbColumn}->>'${path}' = $1`;
    }
    optimizeExistenceQuery(tableName, jsonbColumn, path) {
        if (path) {
            return `SELECT * FROM ${tableName} WHERE ${jsonbColumn} ? '${path}'`;
        }
        return `SELECT * FROM ${tableName} WHERE ${jsonbColumn} IS NOT NULL`;
    }
};
exports.JsonbQueryOptimizerService = JsonbQueryOptimizerService;
exports.JsonbQueryOptimizerService = JsonbQueryOptimizerService = JsonbQueryOptimizerService_1 = __decorate([
    (0, common_1.Injectable)()
], JsonbQueryOptimizerService);
//# sourceMappingURL=jsonb-query-optimizer.service.js.map