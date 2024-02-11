import { Optional } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
export type apiItemT = [
  {
    name: string;
    type: string;
    subfolders: [];
  },
];

export class CreateApiItemDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  createdBy: string;

  @IsNotEmpty()
  @IsArray()
  apiItem: string;
}

export class UpdateApiItemDto {
  @IsOptional()
  @IsArray()
  apiItem: [];

  @IsOptional()
  @IsArray()
  variables: [];

  updateAt: Date;
}
