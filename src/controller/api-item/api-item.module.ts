import { Module } from '@nestjs/common';
import { ApiItemService } from './api-item.service';
import { ApiItemController } from './api-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiItemSchema } from 'src/entities';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'apiItem', schema: ApiItemSchema }]),
  ],
  controllers: [ApiItemController],
  providers: [ApiItemService],
})
export class ApiItemModule {}
