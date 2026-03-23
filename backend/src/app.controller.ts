import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Digital Showroom API',
      version: '1.0',
      docs: '/api/v1/health',
    };
  }
}
