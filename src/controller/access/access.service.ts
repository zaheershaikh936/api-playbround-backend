import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccessDto, UpdateAccessDto } from './dto/access.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Access } from '../../entities';
import { Model, Types } from 'mongoose';
import { paginate } from '../../middleware/paginate';

@Injectable()
export class AccessService {
  constructor(@InjectModel('accesses') private accessModel: Model<Access>) {}
  ObjectId = Types.ObjectId;

  async create(createAccessDto: CreateAccessDto) {
    return await this.accessModel.create(createAccessDto);
  }

  async findAllById(id: string, limit: number, page: number) {
    const { skip, get, current } = paginate(limit, page);
    const projectId = new this.ObjectId(id);
    const total = await this.accessModel.countDocuments({
      projectId: projectId,
    });
    const data = await this.accessModel.aggregate([
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
          joined: 1,
        },
      },
      {
        $limit: get,
      },
      {
        $skip: skip,
      },
    ]);

    return {
      paginate: { skip, limit: get, page: current, total },
      data,
    };
  }

  async update(id: string, updateAccessDto: UpdateAccessDto) {
    try {
      const data = await this.accessModel.findByIdAndUpdate(
        { _id: id },
        { $set: updateAccessDto },
        { new: true },
      );
      return {
        title: 'Success!',
        description: 'permission updated successfully!',
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        title: 'Failed',
        description: 'Uh oh! Something went wrong.',
        error,
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }

  async findIsOwner(project_id: string, userId: string) {
    const user = new this.ObjectId(userId);
    const project = new this.ObjectId(project_id);
    return await this.accessModel
      .findOne({ userId: user, projectId: project }, { IsOwner: 1 })
      .lean();
  }

  async getOne(project: string, user: string) {
    const projectId = new this.ObjectId(project);
    const userId = new this.ObjectId(user);
    return await this.accessModel
      .findOne({ projectId: projectId, userId: userId })
      .lean();
  }
}
