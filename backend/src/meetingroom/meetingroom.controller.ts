import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingroomService } from './meetingroom.service';
import { generateParseIntPipe } from 'src/util/custom.decorator';
import {
  CreateMeetingRoomDto,
  UpdateMeetingRoomDto,
} from './dto/meetingroom.dto';

@Controller('meeting-room')
export class MeetingroomController {
  constructor(private readonly meetingroomService: MeetingroomService) {}

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(1),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('name') name: string | null,
    @Query('capacity', generateParseIntPipe('capacity'))
    capacity: number | null,
    @Query('equipment') equipment: string | null,
  ) {
    return this.meetingroomService.list(
      pageNo,
      pageSize,
      name,
      capacity,
      equipment,
    );
  }

  @Post('create')
  async create(@Body() room: CreateMeetingRoomDto) {
    console.log(room);
    return this.meetingroomService.create(room);
  }

  @Put('update')
  async update(@Body() room: UpdateMeetingRoomDto) {
    console.log(room);
    return this.meetingroomService.update(room);
  }

  @Get(':id')
  async getOne(@Param('id', generateParseIntPipe('id')) id: number) {
    return this.meetingroomService.getOne(id);
  }

  @Delete(':id')
  async delete(@Param('id', generateParseIntPipe('id')) id: number) {
    console.log(id);
    return this.meetingroomService.delete(id);
  }
}
