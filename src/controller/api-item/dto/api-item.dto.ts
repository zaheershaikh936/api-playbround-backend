import { IsArray, IsNotEmpty, IsString } from 'class-validator';
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

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  parent_id: string;

  @IsNotEmpty()
  @IsArray()
  subfolders: string;

  createdBy: string;
  createAt: Date;
  updateAt: Date;
}

export class UpdateApiItemDto {
  @IsNotEmpty()
  @IsArray()
  apiItem: apiItemT;

  updateAt: Date;
}
