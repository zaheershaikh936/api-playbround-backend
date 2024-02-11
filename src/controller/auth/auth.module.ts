import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/middleware/authGuard';
import { GoogleAuth } from 'src/middleware/google.strategy';
import { GithubStrategy } from 'src/middleware/github.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    GoogleAuth,
    GithubStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
