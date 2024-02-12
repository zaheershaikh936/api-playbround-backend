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
import { inviteEmail } from 'src/middleware/emailTemplate';

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
        const { name } = await this.accessService.findProjectName(
          createAccessDto.projectId,
        );
        const emailBody = {
          name: user.data.data.name || user.data.data.email,
          to: user.data.data.email,
          project: name,
        };
        inviteEmail({
          name: emailBody.name,
          to: emailBody.to,
          project: emailBody.project,
        });
      } else {
        createAccessDto.userId = user._id;
        createAccessDto.userObject = {
          name: user?.name,
          email: user.email,
        };
      }
      const isAccessExist = await this.accessService.isExistAccess(
        user._id || user.data.data._id,
        createAccessDto.projectId,
      );

      if (!isAccessExist) {
        const data = await this.accessService.create(createAccessDto);
        return {
          title: 'Success!',
          description: 'User added successfully!',
          data: data,
        };
      } else {
        return {
          title: 'Success!',
          description: 'User added successfully!',
          data: isAccessExist,
        };
      }
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
