import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../entities';
export type ProjectDocument = HydratedDocument<Project>;

@Schema({ versionKey: false })
export class Project {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  userId: User;

  @Prop({ type: Date, required: true, default: new Date() })
  createAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updateAt: Date;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
