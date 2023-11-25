import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiItemService } from './api-item.service';
import { CreateApiItemDto, UpdateApiItemDto } from './dto/api-item.dto';

@Controller('api-item')
export class ApiItemController {
  constructor(private readonly apiItemService: ApiItemService) {}

  @Post()
  create(@Body() createApiItemDto: CreateApiItemDto, @Req() req: any) {
    createApiItemDto.createdBy = req.user.sub;
    return this.apiItemService.create(createApiItemDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiItemDto: UpdateApiItemDto) {
    return this.apiItemService.update(id, updateApiItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiItemService.remove(+id);
  }
}
