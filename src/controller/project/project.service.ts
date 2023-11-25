import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('project') private projectModel: Model<Project>) {}
  ObjectId = Types.ObjectId;
  async create(createProjectDto: CreateProjectDto) {
    return await this.projectModel.create(createProjectDto);
  }

  async findAll(id: string) {
    const userId = new this.ObjectId(id);
    return await this.projectModel.aggregate([
      {
        $match: {
          userId: userId,
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
                name: 1,
                email: 1,
                _id: 0,
              },
            },
          ],
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$user.name',
          email: '$user.email',
          _id: 1,
          name: 1,
          createAt: 1,
          updateAt: 1,
        },
      },
    ]);
  }

  async update(_id: string, updateProjectDto: UpdateProjectDto) {
    updateProjectDto.updateAt = new Date();
    return await this.projectModel.findByIdAndUpdate(
      { _id },
      { set: updateProjectDto },
    );
  }

  async remove(id: string) {
    return await this.projectModel.deleteOne({ _id: id });
  }
}
