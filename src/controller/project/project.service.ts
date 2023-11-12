import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('project') private projectModel: Model<Project>) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectModel.create(createProjectDto);
  }

  async findAll(id: string) {
    return await this.projectModel.find({ userId: id });
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
