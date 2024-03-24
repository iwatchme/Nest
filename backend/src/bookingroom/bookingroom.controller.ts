import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  RequireLogin,
  UserInfo,
  generateParseIntPipe,
} from 'src/util/custom.decorator';
import { BookingroomService } from './bookingroom.service';
import { CreateBookingDto } from './dto/CreateBookingDto.dto';

@Controller('booking')
export class BookingroomController {
  constructor(private readonly service: BookingroomService) {}

  @Get('list')
  list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(1),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') name: string | null,
    @Query('meetingRoomName') meetingRoomName: string | null,
    @Query('meetingRoomPosition') meetingRoomPostion: string | null,
    @Query('bookingTimeRangeStart', generateParseIntPipe('bookingTimeRangeEnd'))
    bookingTimeRangeStart: number | null,
    @Query('bookingTimeRangeEnd', generateParseIntPipe('bookingTimeRangeEnd'))
    bookingTimeRangeEnd: number | null,
  ) {
    return this.service.list(
      pageNo,
      pageSize,
      name,
      meetingRoomName,
      meetingRoomPostion,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    );
  }

  @Post('approve')
  approve() {}

  @Post('add')
  @RequireLogin()
  add(@Body() booking: CreateBookingDto, @UserInfo('id') userId: number) {
    console.log(`id : ${userId} `);
    return this.service.create(booking, userId);
  }

  @Get('apply/:id')
  apply(@Param('id', generateParseIntPipe('id')) id: number) {
    return this.service.apply(id);
  }

  @Get('reject/:id')
  reject(@Param('id', generateParseIntPipe('id')) id: number) {
    return this.service.reject(id);
  }

  @Get('unbind/:id')
  unbind(@Param('id', generateParseIntPipe('id')) id: number) {
    return this.service.unbind(id);
  }

  @Get('history')
  getHistory() {}

  @Get('urge/:id')
  urge(@Param('id', generateParseIntPipe('id')) id: number) {
    return this.service.urge(id);
  }
}
