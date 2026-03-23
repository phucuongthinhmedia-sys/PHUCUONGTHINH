import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggerService } from './common/services/logger.service';
import { SecurityHeadersService } from './common/services/security-headers.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);
  const securityHeadersService = app.get(SecurityHeadersService);

  // Increase body size limit for file uploads
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Get configuration values
  const port = configService.get<number>('app.port') || 3001;
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';
  const frontendUrl =
    configService.get<string>('app.frontend.url') || 'http://localhost:3001';
  const cmsUrl =
    configService.get<string>('app.frontend.cmsUrl') || 'http://localhost:3002';

  // Enable CORS for frontend domains
  const corsConfig = securityHeadersService.getCorsConfiguration();
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js development server
      'http://localhost:3001', // Frontend development server
      'http://localhost:3002', // CMS development server
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

  // Apply security headers middleware
  app.use((req, res, next) => {
    const headers = securityHeadersService.getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  });

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set global API prefix, exclude root path
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
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
