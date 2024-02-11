import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

// !other import
import { AuthDto, RefreshDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private UserServiceInject: UserService,
    private JwtServiceService: JwtService,
  ) {}

  async SignIn(authBody: AuthDto) {
    const { email, password } = authBody;
    const isUserExist = await this.UserServiceInject.isExistEmail(email);
    if (!isUserExist)
      throw new UnauthorizedException({
        message: `email is in correct. Please check the email Id ${email} is not valid!`,
      });

    const isValid = await compare(password, isUserExist.password);
    if (!isValid)
      throw new UnauthorizedException({ message: 'password is in correct' });

    const payload = { sub: isUserExist.id, roleId: 'user' };

    const token = await this.tokenGenerate(payload);
    delete isUserExist.password;
    return {
      description: 'Login successfully!',
      title: 'Success!',
      data: { token, data: { _id: isUserExist._id, email: isUserExist.email } },
    };
  }

  async refreshToken(refreshToken: RefreshDto) {
    const valid = await this.JwtServiceService.verify(
      refreshToken.refreshToken,
    );

    if (!valid.sub) {
      throw new UnauthorizedException({
        title: 'Failed!',
        description: 'In valid token!',
      });
    }
    const user = await this.UserServiceInject.findOne(valid.sub);
    const payload = { sub: user._id, roleId: 'user' };
    const token = await this.tokenGenerate(payload);
    return { name: user.name, email: user.email, token };
  }

  async tokenGenerate(payload) {
    return {
      refresh_token: await this.JwtServiceService.signAsync(payload, {
        expiresIn: '6d',
      }),
      access_token: await this.JwtServiceService.signAsync(payload, {
        expiresIn: '12h',
      }),
    };
  }

  async SocialLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException({
        title: 'Failed!',
        description: 'Something went wrong please try again later!',
      });
    } else {
      const { email, name, picture } = req.user;
      const isExist = await this.UserServiceInject.IsExist(email);
      if (!isExist) {
        const salt = await genSalt(10);
        let password = 'Admin@123';
        password = await hash(password, salt);
        const createUserDto: CreateUserDto = {
          email: email,
          image: picture,
          name: name,
          password: password,
        };
        const result = await this.UserServiceInject.create(createUserDto);
        return {
          id: result.data.data.id,
          access_token: result.data.token.access_token,
          refresh_token: result.data.token.refresh_token,
        };
      } else {
        const data = await this.UserServiceInject.isExistEmail(email);
        http: delete data.password;
        const payload = { sub: data._id, roleId: 'user' };
        const token = await this.tokenGenerate(payload);
        return {
          id: data.id,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        };
      }
    }
  }
}
