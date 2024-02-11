import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessSchema } from 'src/entities';
import { UserModule } from '../index';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'accesses', schema: AccessSchema }]),
    UserModule,
  ],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
