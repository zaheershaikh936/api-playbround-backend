import { Module, forwardRef } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, AccessSchema } from 'src/entities';
import { AccessModule, UserModule } from '../index';

@Module({
  imports: [
    forwardRef(() => AccessModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: 'project', schema: ProjectSchema },
      { name: 'access', schema: AccessSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
