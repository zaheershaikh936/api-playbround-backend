import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateApiDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['get', 'post', 'patch', 'put', 'delete'])
  method: string;

  @IsArray()
  @IsOptional()
  queryP: [];

  @IsBoolean()
  @IsNotEmpty()
  auth: boolean;

  @IsArray()
  @IsOptional()
  headerP: [];

  @IsString()
  @IsOptional()
  body: string;

  createAt: Date;
  updateAt: Date;
}
