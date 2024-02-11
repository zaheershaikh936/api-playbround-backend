import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApisService } from './apis.service';
import { CreateApiDto } from './dto/api.dto';

@Controller('apis')
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @Post()
  create(@Body() createApiDto: CreateApiDto) {
    return this.apisService.create(createApiDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apisService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apisService.remove(id);
  }
}
