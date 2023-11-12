import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// !other import
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../../entities';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
