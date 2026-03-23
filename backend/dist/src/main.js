"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const logger_service_1 = require("./common/services/logger.service");
const security_headers_service_1 = require("./common/services/security-headers.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const loggerService = app.get(logger_service_1.LoggerService);
    const securityHeadersService = app.get(security_headers_service_1.SecurityHeadersService);
    app.use(require('express').json({ limit: '50mb' }));
    app.use(require('express').urlencoded({ limit: '50mb', extended: true }));
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    const port = configService.get('app.port') || 3001;
    const nodeEnv = configService.get('app.nodeEnv') || 'development';
    const frontendUrl = configService.get('app.frontend.url') || 'http://localhost:3001';
    const cmsUrl = configService.get('app.frontend.cmsUrl') || 'http://localhost:3002';
    const corsConfig = securityHeadersService.getCorsConfiguration();
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            frontendUrl,
            cmsUrl,
            ...corsConfig.origin,
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: corsConfig.credentials,
    });
    app.use((req, res, next) => {
        const headers = securityHeadersService.getSecurityHeaders();
        Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1', { exclude: ['/', 'favicon.ico'] });
    await app.listen(port);
    loggerService.log(`Application started on port ${port}`, {
        environment: nodeEnv,
        timestamp: new Date().toISOString(),
        frontendUrl,
        cmsUrl,
    });
}
bootstrap().catch((error) => {
    const logger = new common_1.Logger('Bootstrap');
    logger.error('Failed to start application', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map