import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Boolean, required: true, default: false })
  isVerify: boolean;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  image: string;

  @Prop({
    type: String,
    required: true,
    enum: ['web app', 'google', 'github'],
    default: 'web app',
  })
  source: string;

  @Prop({ type: String, required: false })
  fToken: string;

  @Prop({ type: Date, required: false })
  fTokenExpiry: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  createAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
