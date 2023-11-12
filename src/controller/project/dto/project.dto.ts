import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  userId: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  updateAt: Date;
}
