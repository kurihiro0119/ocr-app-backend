import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CosmosdbService } from './cosmosdb.service';

@Module({
  imports: [ConfigModule],
  providers: [CosmosdbService],
  exports: [CosmosdbService],
})
export class CosmosdbModule {}
