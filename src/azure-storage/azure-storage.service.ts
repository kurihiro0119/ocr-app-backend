import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureStorageService
{
  private blobServiceClient: BlobServiceClient;

  constructor(private configService: ConfigService)
  {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.configService.get('AZURE_STORAGE_CONNECTION_STRING'));
  }

  async uploadFile(containerName: string, blobName: string, file: Buffer): Promise<string>
  {
    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(file, file.length);

    return blockBlobClient.url;
  }
}
