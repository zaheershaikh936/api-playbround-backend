import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/entities/project.entity';
import { AccessService } from '../access/access.service';
import { UserService } from '../user/user.service';
import { Access } from 'src/entities';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') private projectModel: Model<Project>,
    @InjectModel('access') private accessModel: Model<Access>,
    @Inject(forwardRef(() => AccessService))
    private AccessServiceInject: AccessService,
    @Inject(forwardRef(() => UserService))
    private userServiceInject: UserService,
  ) {}
  ObjectId = Types.ObjectId;
  async create(createProjectDto: CreateProjectDto) {
    try {
      const data = await this.projectModel.create(createProjectDto);
      const customer = await this.userServiceInject.findOne(
        createProjectDto.userId,
      );
      const accessObject = {
        email: customer.email,
        projectId: String(data._id),
        userObject: { name: customer.name, email: customer.email },
        userId: customer,
        writeP: true,
        deleteP: true,
        IsOwner: true,
      };
      await this.AccessServiceInject.create(accessObject);
      return {
        title: 'Success!',
        description: 'Repository added Successfully!',
        data: data,
      };
    } catch (error) {
      return {
        title: 'Failed',
        description: 'Uh oh! Something went wrong.',
        error,
      };
    }
  }

  async findAll(id: string) {
    const userId = new this.ObjectId(id);
    return await this.accessModel.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
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
      {
        $lookup: {
          from: 'projects',
          let: {
            projectId: '$projectId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$projectId'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                createAt: 1,
                updateAt: 1,
              },
            },
          ],
          as: 'project',
        },
      },
      { $unwind: '$user' },
      { $unwind: '$project' },
      {
        $project: {
          _id: '$project._id',
          userId: '$user.name',
          email: '$user.email',
          name: '$project.name',
          createAt: '$project.createAt',
          updateAt: '$project.updateAt',
          IsOwner: 1,
          writeP: 1,
          deleteP: 1,
        },
      },
    ]);
  }

  async findOneById(_id: string) {
    const projectId = new this.ObjectId(_id);
    const [data] = await this.projectModel.aggregate([
      {
        $match: {
          _id: projectId,
        },
      },
      {
        $lookup: {
          from: 'accesses',
          let: {
            userId: '$userId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$userId', '$$userId'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                IsOwner: 1,
              },
            },
          ],
          as: 'accesses',
        },
      },
      {
        $unwind: '$accesses',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          userId: 1,
          createAt: 1,
          updateAt: 1,
          isOwner: '$accesses.IsOwner',
        },
      },
    ]);
    return data;
  }

  async update(_id: string, updateProjectDto: UpdateProjectDto) {
    try {
      updateProjectDto.updateAt = new Date();

      const data = await this.projectModel.findByIdAndUpdate(
        { _id: _id },
        { $set: updateProjectDto },
        { new: true },
      );
      return {
        title: 'Success!',
        description: 'Repository updated Successfully!',
        data: data,
      };
    } catch (error) {
      return {
        title: 'Failed',
        description: 'Uh oh! Something went wrong.',
        error,
      };
    }
  }

  async remove(id: string) {
    return await this.projectModel.deleteOne({ _id: id });
  }
}
