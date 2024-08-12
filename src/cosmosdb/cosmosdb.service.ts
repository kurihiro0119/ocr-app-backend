import { Injectable } from '@nestjs/common';
import { CosmosClient } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CosmosdbService
{
  private client: CosmosClient;
  private database;
  private container;

  constructor(private configService: ConfigService)
  {
    this.client = new CosmosClient({
        endpoint: this.configService.get('COSMOSDB_ENDPOINT'),
        key: this.configService.get<string>('COSMOSDB_KEY'),
    })
    this.database = this.client.database(this.configService.get<string>('COSMOSDB_DATABASE'));
    this.container = this.database.container(this.configService.get<string>('COSMOSDB_CONTAINER'));
  }

  // 保存するデータを受け取り、Cosmos DBに保存する
  async saveReceiptData(data: any): Promise<any>
  {
    const { resource } = await this.container.items.create(data);
    return resource;
  }

  // Cosmos DBに保存されているデータを取得し、要約情報を返す
  async listReceiptDataSummary(): Promise<any>
  {
    const querySpec = {
      query: 'SELECT c.url, c.id, c._ts FROM c',
    }

    const { resources: items } = await this.container.items.query(querySpec).fetchAll();


    return items.map(item => ({
      id: item.id,
      fileName: this.extractFileName(item.url),
      createdTime: this.formatDate(new Date(item._ts * 1000)),
    }));
  }

  // Cosmos DBに保存されているデータの詳細情報を取得する
  async getReceiptData(id: string): Promise<any>
  {
    const { resource } = await this.container.item(id).read();
    return resource;
  }

  private extractFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  private formatDate(date: Date): string
  {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
  }
}
