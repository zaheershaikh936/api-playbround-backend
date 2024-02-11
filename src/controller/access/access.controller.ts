import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Query,
  Req,
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
    try {
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
        createAccessDto.userId = user.data.data._id;
        createAccessDto.userObject = {
          name: user.data.data.name,
          email: user.data.data.email,
        };
      } else {
        createAccessDto.userId = user._id;
        createAccessDto.userObject = {
          name: user?.name,
          email: user.email,
        };
      }
      const data = await this.accessService.create(createAccessDto);
      return {
        title: 'Success!',
        description: 'User added successfully!',
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        title: 'Failed',
        description: 'Uh oh! Something went wrong.',
        error,
      });
    }
  }

  @Get('/check/owner/:projectId')
  findIsOwner(@Param('projectId') projectId: string, @Req() req: any) {
    return this.accessService.findIsOwner(projectId, req.user.sub);
  }

  @Get(':id')
  findAllById(
    @Param('id') id: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.accessService.findAllById(id, limit, page);
  }

  @Get('/user/:projectId/:customerId')
  getOne(
    @Param('projectId') projectId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.accessService.getOne(projectId, customerId);
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
