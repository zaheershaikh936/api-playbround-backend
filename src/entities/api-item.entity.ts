import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project, User } from './index';

export type ApiItemDocument = HydratedDocument<ApiItem>;

@Schema({ versionKey: false })
export class ApiItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: true,
  })
  projectId: Project;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  })
  createdBy: User;

  @Prop({
    type: Array,
    required: true,
  })
  apiItem: [
    {
      name: '';
      type: '';
      subfolders: [];
      apiId: '';
    },
  ];

  @Prop({ type: Array, required: false })
  variables: [
    { index: number; variable: string; url: string; description: string },
  ];

  @Prop({ type: Date, required: true, default: new Date() })
  createAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updateAt: Date;
}

export const ApiItemSchema = SchemaFactory.createForClass(ApiItem);
