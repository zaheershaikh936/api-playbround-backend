import { Injectable } from '@nestjs/common';
import { CreateApiItemDto, UpdateApiItemDto } from './dto/api-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiItem } from '../../entities';

@Injectable()
export class ApiItemService {
  constructor(@InjectModel('apiItem') private apiItemModel: Model<ApiItem>) { }

  async create(createApiItemDto: CreateApiItemDto) {
    const data = await this.apiItemModel.create(createApiItemDto);
    return {
      description: 'Folder Created Successfully!',
      title: 'Success!',
      data,
    };
  }

  async findOne(id: string) {
    return await this.apiItemModel.findOne({ projectId: id }).lean();
  }

  async update(id: string, updateApiItemDto: UpdateApiItemDto) {
    updateApiItemDto.updateAt = new Date();
    const data = await this.apiItemModel.findOneAndUpdate(
      { projectId: id },
      { $set: updateApiItemDto },
      { new: true },
    );

    return {
      description: 'Folder Created Successfully!',
      title: 'Success!',
      data,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} apiItem`;
  }
}
