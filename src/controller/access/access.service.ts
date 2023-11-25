import { Injectable } from '@nestjs/common';
import { CreateAccessDto, UpdateAccessDto } from './dto/access.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Access } from '../../entities';
import { Model, Types } from 'mongoose';
@Injectable()
export class AccessService {
  constructor(@InjectModel('accesses') private accessModel: Model<Access>) {}
  ObjectId = Types.ObjectId;

  async create(createAccessDto: CreateAccessDto) {
    return await this.accessModel.create(createAccessDto);
  }

  async findAllById(id: string) {
    const projectId = new this.ObjectId(id);
    return await this.accessModel.aggregate([
      {
        $match: {
          projectId: projectId,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$userId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$userId'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                name: 1,
                isVerify: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$userObject.email',
          isVerify: '$user.isVerify',
          writeP: 1,
          deleteP: 1,
          createAt: 1,
        },
      },
    ]);
  }

  async update(id: string, updateAccessDto: UpdateAccessDto) {
    return await this.accessModel.findByIdAndUpdate(
      { id },
      { $set: updateAccessDto },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }
}
