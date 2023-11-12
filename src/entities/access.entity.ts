import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, Project } from '../entities';
export type AccessDocument = HydratedDocument<Access>;

@Schema({ versionKey: false })
export class Access {
  @Prop({ type: Object, required: true })
  userObject: {
    name: string;
    email: string;
  };

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  userId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: true,
  })
  projectId: Project;

  @Prop({ type: Boolean, required: true, default: false })
  writeP: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  deleteP: boolean;

  @Prop({ type: Date, required: true, default: new Date() })
  createAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updateAt: Date;
}
export const AccessSchema = SchemaFactory.createForClass(Access);
