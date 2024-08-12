import { Injectable } from '@nestjs/common';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import { DefaultAzureCredential } from '@azure/identity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';


@Injectable()
export class AzureDocumentAnalysisService
{
  private client: DocumentAnalysisClient;

  constructor(private configService: ConfigService)
  {
    const endpoint = this.configService.get<string>('AZURE_FORM_RECOGNIZER_ENDPOINT');
    const apiKey = this.configService.get<string>('AZURE_FORM_RECOGNIZER_API_KEY');
    const credential = new AzureKeyCredential(apiKey);
    this.client = new DocumentAnalysisClient(endpoint, credential);
  }

  async analyzeReceipt(filePath: string): Promise<any>
  {
    const file = fs.createReadStream(filePath);
    const modelId = "prebuilt-receipt";
    const poller = await this.client.beginAnalyzeDocument(modelId, file)
    const result = await poller.pollUntilDone();

    return result; 
  }
  
}
