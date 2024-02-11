import { IsOptional, IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  image: string;
}

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  image: string;

  @IsOptional()
  isVerify: boolean;

  updateAt: Date;
}

export class ForgetPassword {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
