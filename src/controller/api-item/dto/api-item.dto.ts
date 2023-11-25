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
  @IsArray()
  apiItem: apiItemT;

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
