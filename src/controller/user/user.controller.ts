import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Logger,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

// !other import
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ForgetPassword } from './dto/user.dto';
import { Public } from 'src/middleware/publicAccess';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    Logger.debug(createUserDto);
    const salt = await genSalt(10);
    createUserDto.password = await hash(createUserDto.password, salt);
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get('/forget/password/:email')
  async forgetPassword(@Param('email') email: string) {
    return this.userService.forgetPassword(email);
  }

  @Public()
  @Post('/forget/password/')
  async verifyToken(@Body() forgetPassword: ForgetPassword) {
    const salt = await genSalt(10);
    forgetPassword.password = await hash(forgetPassword.password, salt);
    return this.userService.verifyToken(forgetPassword);
  }

  @Public()
  @Get('/home')
  Test() {
    return 'Api Playground working.';
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    console.log(req.headers);
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
