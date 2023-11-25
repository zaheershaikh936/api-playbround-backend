import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { UserService } from '../user/user.service';
import { CreateAccessDto, UpdateAccessDto } from './dto/access.dto';
import { generatePassword } from '../../middleware/passwordGenerate';

@Controller('access')
export class AccessController {
  constructor(
    private readonly accessService: AccessService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createAccessDto: CreateAccessDto) {
    const { email } = createAccessDto;
    let user: any;
    user = await this.userService.findByEmail(email);
    if (!user) {
      const password = await generatePassword();
      user = await this.userService.create({
        email,
        password,
        name: '',
        image: '',
      });
      delete user.token;
    }
    createAccessDto.userId = user._id || user.data._id;
    createAccessDto.userObject = {
      name: user?.name || user.data?.name,
      email: user.email || user.data.email,
    };
    return this.accessService.create(createAccessDto);
  }

  @Get(':id')
  findAllById(@Param('id') id: string) {
    return this.accessService.findAllById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
    return this.accessService.update(id, updateAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessService.remove(+id);
  }
}
