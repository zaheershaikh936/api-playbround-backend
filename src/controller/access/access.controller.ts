import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { UserService } from '../user/user.service';
import { CreateAccessDto } from './dto/access.dto';
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
      createAccessDto.userObject = {
        name: user.data.name,
        email: user.data.email,
      };
      delete user.token;
      createAccessDto.userId = user.data.id;
    }
    return this.accessService.create(createAccessDto);
  }

  @Get()
  findAll() {
    return this.accessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessDto: any) {
    return this.accessService.update(+id, updateAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessService.remove(+id);
  }
}
