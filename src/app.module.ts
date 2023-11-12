import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//! other import
import {
  UserModule,
  AuthModule,
  ProjectModule,
  AccessModule,
} from './controller';
import 'dotenv/config';
import { LoggerMiddleware } from './middleware/http.logger';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB),
    UserModule,
    AuthModule,
    ProjectModule,
    AccessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
