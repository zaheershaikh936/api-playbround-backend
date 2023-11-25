import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project, User } from './index';
import { apiItemT } from '../controller/api-item/dto/api-item.dto';

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
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: ['folder', 'api'],
  })
  type: string;

  @Prop({
    type: [],
    required: true,
  })
  subfolders: apiItemT;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'apiitems',
    required: true,
  })
  parent_id: ApiItem;

  @Prop({ type: Date, required: true, default: new Date() })
  createAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updateAt: Date;
}

export const ApiItemSchema = SchemaFactory.createForClass(ApiItem);
