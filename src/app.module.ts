import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureStorageModule } from './azure-storage/azure-storage.module';
import { AzureDocumentAnalysisModule } from './azure-document-analysis/azure-document-analysis.module';
import { CosmosdbModule } from './cosmosdb/cosmosdb.module';
import { ReceiptController } from './receipt/receipt.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    AzureStorageModule, AzureDocumentAnalysisModule, CosmosdbModule],
  controllers: [ReceiptController],
})
export class AppModule {}
