import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

// !other import
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Public } from 'src/middleware/publicAccess';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const salt = await genSalt(10);
    createUserDto.password = await hash(createUserDto.password, salt);
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get('/home')
  Test() {
    return 'Api Playground workign.';
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
