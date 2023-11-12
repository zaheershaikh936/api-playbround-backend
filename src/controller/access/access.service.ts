import { Injectable, Logger } from '@nestjs/common';
import { CreateAccessDto } from './dto/access.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Access } from '../../entities';

@Injectable()
export class AccessService {
  constructor(@InjectModel('accesses') private accessModel: Model<Access>) {}

  async create(createAccessDto: CreateAccessDto) {
    return await this.accessModel.create(createAccessDto);
  }

  findAll() {
    return `This action returns all access`;
  }

  findOne(id: number) {
    return `This action returns a #${id} access`;
  }

  update(id: number, updateAccessDto: any) {
    Logger.debug(updateAccessDto);
    return `This action updates a #${id} access`;
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }
}
