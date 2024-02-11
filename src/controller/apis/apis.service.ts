import { Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/api.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Api } from '../../entities';

@Injectable()
export class ApisService {
  constructor(@InjectModel('apis') private apiModel: Model<Api>) {}

  async create(createApiDto: CreateApiDto) {
    return await this.apiModel.create(createApiDto);
  }

  async findOne(id: string) {
    return await this.apiModel.findById({ _id: id }).lean();
  }

  async remove(id: string) {
    return await this.apiModel.deleteOne({ _id: id });
  }
}
