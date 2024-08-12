import { Controller, Post, UploadedFile, UseInterceptors, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureStorageService } from '../azure-storage/azure-storage.service';
import { AzureDocumentAnalysisService } from '../azure-document-analysis/azure-document-analysis.service';
import { CosmosdbService } from '../cosmosdb/cosmosdb.service';
import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';

// ファイルをローカルに保存するためのmulter設定
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) =>
  {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});



@Controller('receipt')
export class ReceiptController
{
  constructor(
    private readonly azureStorageService: AzureStorageService,
    private readonly azureDocumentAnalysisService: AzureDocumentAnalysisService,
    private readonly cosmosdbService: CosmosdbService
  ) {}
  
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadReceipt(@UploadedFile() file: Express.Multer.File)
  {
    const filePath = path.join(__dirname, '../../uploads', file.filename);

    // 1. アップロードされたファイルをAzure Blob Storageにアップロード
    const containerName = 'receipt';
    const blobName = file.filename;
    const url = await this.azureStorageService.uploadFile(containerName, blobName, fs.readFileSync(filePath));
    
    // 2. アップロードされたファイルをAzure Form Recognizerで解析
    const analysisResult = await this.azureDocumentAnalysisService.analyzeReceipt(filePath);

    // 3. 解析結果をCosmos DBに保存
    await this.cosmosdbService.saveReceiptData({ url, analysisResult });

    // 4. ローカルに保存したファイルを削除
    fs.unlinkSync(filePath);

    return { url, analysisResult };
  }

  @Get('list')
  async getReceiptList()
  {
    return this.cosmosdbService.listReceiptDataSummary();
  }

  @Get(':id')
  async getReceipt(@Param('id') id: string)
  {
    return this.cosmosdbService.getReceiptData(id);
  }
}
