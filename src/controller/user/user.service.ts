import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';

// !other import
import { CreateUserDto, UpdateUserDto, ForgetPassword } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../entities';
import { AuthService } from '../auth/auth.service';
import { welcomeEmail } from 'src/middleware/emailTemplate';

import {
  ForgetTokenService,
  calculateExpiateTime,
} from '../../middleware/forgetPassword';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private AuthServiceInject: AuthService,
  ) {}

  async IsExist(email) {
    return await this.userModel.countDocuments({ email: email }).lean();
  }

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.IsExist(createUserDto.email);
    if (isExist >= 1)
      throw new HttpException(
        {
          title: 'Uh oh! Something went wrong.',
          description: 'User already exist!',
        },
        HttpStatus.BAD_REQUEST,
      );

    const data = await this.userModel.create(createUserDto);
    delete data.password;
    const payload = { sub: data.id, roleId: 'user' };
    const token = await this.AuthServiceInject.tokenGenerate(payload);
    const emailBody = {
      name: data.name || data.email,
      to: data.email,
    };
    welcomeEmail({ name: emailBody.name, to: emailBody.to });
    return {
      title: 'Success',
      description: 'Please check your email to verify you account!',
      data: { data, token },
    };
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  async isExistEmail(email: string) {
    return await this.userModel.findOne(
      { email: email },
      { email: 1, password: 1, _id: 1 },
    );
  }

  async findAll() {
    return await this.userModel.find().lean();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id, { password: 0 }).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto.updateAt = new Date();
    return await this.userModel.updateOne({ _id: id }, { $set: updateUserDto });
  }

  async forgetPassword(email: string) {
    const isExist = await this.IsExist(email);
    if (!isExist) {
      throw new HttpException(
        {
          title: 'Uh oh! Something went wrong.',
          description: "User does'nt exist!",
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const token = ForgetTokenService();
      const expiredTime = calculateExpiateTime();
      const user = await this.userModel.findOneAndUpdate(
        { email: email },
        { $set: { fToken: token, fTokenExpiry: expiredTime } },
        {
          new: true,
          fields: { _id: 1, name: 1, email: 1 },
        },
      );
      return {
        title: 'Success',
        description:
          'Reset password email has been sent. Please check your email!.',
        data: { token, user },
      };
    }
  }

  async verifyToken(forgetPassword: ForgetPassword) {
    const isExist = await this.IsExist(forgetPassword.email);
    if (!isExist) {
      throw new HttpException(
        {
          title: 'Uh oh! Something went wrong.',
          description: 'email is not valid!',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const user = await this.userModel
        .findOne(
          {
            email: forgetPassword.email,
            fTokenExpiry: { $gte: new Date() },
            fToken: forgetPassword.token,
          },
          { fToken: 1 },
        )
        .lean();

      if (!user) {
        throw new HttpException(
          {
            title: 'Uh oh! Something went wrong.',
            description: 'token is not valid!',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const data = await this.userModel.findByIdAndUpdate(
          { _id: user._id },
          { $set: { fToken: '', password: forgetPassword.password } },
          { new: true, fields: { _id: 1, name: 1, email: 1 } },
        );
        return {
          title: 'Success',
          description: 'Reset password successfully!.',
          data,
        };
      }
    }
  }
}
