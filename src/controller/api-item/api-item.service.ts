import { Injectable } from '@nestjs/common';
import { CreateApiItemDto, UpdateApiItemDto } from './dto/api-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiItem } from '../../entities';

@Injectable()
export class ApiItemService {
  constructor(@InjectModel('apiItem') private apiItemModel: Model<ApiItem>) {}

  async create(createApiItemDto: CreateApiItemDto) {
    return await this.apiItemModel.create(createApiItemDto);
  }

  async findOne(id: string) {
    return await this.apiItemModel.find({ parent_id: id }).lean();
  }

  async update(id: string, updateApiItemDto: UpdateApiItemDto) {
    updateApiItemDto.updateAt = new Date();
    return await this.apiItemModel.findOneAndUpdate(
      { projectId: id },
      { $set: updateApiItemDto },
      { new: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} apiItem`;
  }
}
