import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { PdfService } from './pdf.service';
import { AiService } from './ai.service';
import { StorageService } from './storage.service';
import { CategoryMapperService } from './category-mapper.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ImportController],
  providers: [
    ImportService,
    PdfService,
    AiService,
    StorageService,
    CategoryMapperService,
    PrismaService,
  ],
  exports: [ImportService],
})
export class ImportModule {}
