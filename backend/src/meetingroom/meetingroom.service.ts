import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MeetingroomVo } from './dto/meetingroom.vo';
import {
  CreateMeetingRoomDto,
  UpdateMeetingRoomDto,
} from './dto/meetingroom.dto';

@Injectable()
export class MeetingroomService {
  async delete(id: number) {
    console.log(`delete: ${id}`);
    const result = await this.prismaService.meetingRoom.delete({
      where: {
        id: id,
      },
    });
    console.log(result);
    if (!result) {
      throw new BadRequestException('会议室不存在');
    }
    return '删除成功';
  }
  async getOne(id: number) {
    return await this.prismaService.meetingRoom.findUnique({
      where: {
        id: id,
      },
    });
  }
  async update(room: UpdateMeetingRoomDto) {
    const target = await this.prismaService.meetingRoom.findUnique({
      where: {
        id: room.id,
      },
    });
    if (!target) {
      throw new BadRequestException('会议室不存在');
    }

    if (room.name) {
      target.name = room.name;
    }
    if (room.capacity) {
      target.capacity = room.capacity;
    }
    if (room.description) {
      target.description = room.description;
    }
    if (room.equipment) {
      target.equipment = room.equipment;
    }
    if (room.location) {
      target.location = room.location;
    }

    return await this.prismaService.meetingRoom.update({
      where: {
        id: room.id,
      },
      data: target,
    });
  }

  async create(room: CreateMeetingRoomDto) {
    const target = await this.prismaService.meetingRoom.findFirst({
      where: {
        name: room.name,
      },
    });

    if (target) {
      throw new BadRequestException('会议室名称已存在');
    }

    return await this.prismaService.meetingRoom.create({
      data: {
        name: room.name,
        capacity: room.capacity,
        description: room.description,
        equipment: room.equipment,
        location: room.location,
      },
    });
  }
  @Inject()
  private readonly prismaService: PrismaService;

  async list(
    pageNo: number,
    pageSize: number,
    name: string | null,
    capacity: number | null,
    equipment: string | null,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('pageNo 应该大于等于 1');
    }

    const data = await this.prismaService.meetingRoom.findMany({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      where: {
        name: name ? { contains: name } : undefined,
        capacity: capacity ? { equals: capacity } : undefined,
        equipment: equipment ? { contains: equipment } : undefined,
      },
    });
    console.log(data);

    const total = data.length;
    const meetingrooms = data.map((item) => {
      const vo = new MeetingroomVo();
      vo.id = item.id;
      vo.name = item.name;
      vo.capacity = item.capacity;
      vo.description = item.description;
      vo.equipment = item.equipment;
      vo.location = item.location;
      vo.createTime = item.create_time;
      vo.updateTime = item.update_time;
      return vo;
    });
    return { data: meetingrooms, total };
  }
}
