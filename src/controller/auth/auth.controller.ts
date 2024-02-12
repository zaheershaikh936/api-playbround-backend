import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RefreshDto } from './dto/auth.dto';
import { Public } from 'src/middleware/publicAccess';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/test')
  async testing() {
    // const data = await this.mainService.sendUserConfirmation({
    //   name: 'zaheer shaikh',
    //   email: 'zaheer.mantiqh@gmail.com',
    // });
    // Logger.debug(data);
    return 'All good ready to use!';
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: any) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:5173', 302)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuthNavigate(@Req() request: any) {
    const data = await this.authService.SocialLogin(request);
    return {
      url: `http://localhost:5173/home/login/${data?.id}/${data.access_token}/${data.refresh_token}`,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  @Redirect('http://localhost:5173', 302)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async githubAuthCallback(@Req() request: any) {
    const userData = {
      user: {
        name: request.user.displayName,
        email: `${request.user.username}@apiPlayground.com`,
        picture: request.user.photos[0].value,
      },
    };
    console.log(userData);
    const data = await this.authService.SocialLogin(userData);
    return {
      url: `http://localhost:5173/home/login/${data?.id}/${data.access_token}/${data.refresh_token}`,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.SignIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/refreshToken')
  refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto);
  }
}
