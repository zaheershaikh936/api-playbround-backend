import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from './project.entity';

export type ApiDocument = HydratedDocument<Api>;

@Schema({ versionKey: false })
export class Api {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: true,
  })
  projectId: Project;

  @Prop({
    type: String,
    required: true,
    enum: ['get', 'post', 'patch', 'put', 'delete'],
  })
  method: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Array, required: false })
  queryP: [
    {
      key: string;
      value: string;
      description: string;
    },
  ];

  @Prop({ type: Boolean, required: true, default: false })
  auth: boolean;

  @Prop({ type: Array, required: false })
  headerP: [
    {
      key: string;
      value: string;
      description: string;
    },
  ];

  @Prop({ type: String, required: false })
  body: string;

  @Prop({ type: Date, required: true, default: new Date() })
  createAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updateAt: Date;
}

export const ApiSchema = SchemaFactory.createForClass(Api);
