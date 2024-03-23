import { IsNotEmpty, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateMeetingRoomDto {
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  @MaxLength(10, {
    message: '会议室名称最长为 10 字符',
  })
  name: string;

  @IsNotEmpty({
    message: '容量不能为空',
  })
  capacity: number;

  @IsNotEmpty({
    message: '位置不能为空',
  })
  @MaxLength(50, {
    message: '位置最长为 50 字符',
  })
  location: string;

  @IsNotEmpty({
    message: '设备不能为空',
  })
  @MaxLength(50, {
    message: '设备最长为 50 字符',
  })
  equipment: string;

  @IsNotEmpty({
    message: '描述不能为空',
  })
  @MaxLength(100, {
    message: '描述最长为 100 字符',
  })
  description: string;
}

export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
  @IsNotEmpty({
    message: '会议室 ID 不能为空',
  })
  id: number;
}
