import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
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

  IsOwner: boolean;
}

export class UpdateAccessDto {
  @IsBoolean()
  @IsNotEmpty()
  writeP: boolean;

  @IsBoolean()
  @IsNotEmpty()
  deleteP: boolean;
}
