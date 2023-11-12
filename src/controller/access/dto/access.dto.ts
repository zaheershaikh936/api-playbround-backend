import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../../../entities';

export class CreateAccessDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  userObject: object;

  userId: User;

  writeP: boolean;

  deleteP: boolean;
}
