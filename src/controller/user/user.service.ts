import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';

// !other import
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../entities';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private AuthServiceInject: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const data = await this.userModel.create(createUserDto);
    const payload = { sub: data.id, roleId: 'user' };
    const token = await this.AuthServiceInject.tokenGenerate(payload);
    return { data, token };
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  async isExist(email: string) {
    return await this.userModel.findOne(
      { email: email },
      { email: 1, password: 1 },
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
}
