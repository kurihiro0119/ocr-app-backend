import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureDocumentAnalysisService } from './azure-document-analysis.service';

@Module({
  imports: [ConfigModule],
  providers: [AzureDocumentAnalysisService],
  exports: [AzureDocumentAnalysisService],
})
export class AzureDocumentAnalysisModule {}
