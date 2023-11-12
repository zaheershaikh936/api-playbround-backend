import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

// !other import
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private UserServiceInject: UserService,
    private JwtServiceService: JwtService,
  ) {}

  async SignIn(authBody: AuthDto) {
    const { email, password } = authBody;
    const isUserExist = await this.UserServiceInject.isExist(email);
    if (!isUserExist)
      throw new UnauthorizedException({
        message: `email is in correct. Please check the email Id ${email} `,
      });

    const isValid = await compare(password, isUserExist.password);
    if (!isValid)
      throw new UnauthorizedException({ message: 'password is in correct' });

    const payload = { sub: isUserExist.id, roleId: 'user' };

    const token = await this.tokenGenerate(payload);
    delete isUserExist.password;
    return { token, data: { _id: isUserExist._id, email: isUserExist.email } };
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
}
