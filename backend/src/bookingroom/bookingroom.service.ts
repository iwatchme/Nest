import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/CreateBookingDto.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingroomService {
  @Inject()
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  async urge(id: number) {
    const flag = await this.redisService.get('urge_' + id);

    if (flag) {
      return '半小时内只能催办一次，请耐心等待';
    }

    let email = await this.redisService.get('admin_email');

    console.log(email);

    if (!email) {
      const admin = await this.prismaService.user.findFirst({
        where: {
          is_admin: true,
        },
        select: {
          email: true,
        },
      });


      email = admin ? admin.email : null;

      if (email) {
        this.redisService.set('admin_email', email);
        this.emailService.sendMail({
          to: email,
          subject: '预定申请催办提醒',
          html: `id 为 ${id} 的预定申请正在等待审批`,
        });

        this.redisService.set('urge_' + id, 1, 60 * 30);
      }
    }
  }
  async reject(id: number) {
    await this.prismaService.booking.update({
      where: {
        id,
      },
      data: {
        status: '审批拒绝',
      },
    });
    return 'success';
  }

  async unbind(id: number) {
    await this.prismaService.booking.update({
      where: {
        id,
      },
      data: {
        status: '已解除',
      },
    });
    return 'success';
  }

  async apply(id: number) {
    await this.prismaService.booking.update({
      where: {
        id,
      },
      data: {
        status: '审批通过',
      },
    });
    return 'success';
  }
  async create(booking: CreateBookingDto, userId: number) {
    const meetingroom = await this.prismaService.meetingRoom.findUnique({
      where: {
        id: booking.meetingRoomId,
      },
    });

    if (!meetingroom) {
      throw new BadRequestException('会议室不存在');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const hasBooking = await this.prismaService.booking.findFirst({
      where: {
        room: meetingroom,
        start_time: {
          gte: new Date(booking.startTime).toISOString(),
        },
        end_time: {
          lte: new Date(booking.endTime).toISOString(),
        },
      },
    });

    if (hasBooking) {
      throw new BadRequestException('会议室已被预定');
    }

    const result = await this.prismaService.booking.create({
      data: {
        start_time: new Date(booking.startTime).toISOString(),
        end_time: new Date(booking.endTime).toISOString(),
        status: '审核中',
        user: {
          connect: {
            id: userId,
          },
        },
        room: {
          connect: {
            id: booking.meetingRoomId,
          },
        },
        note: booking.note ? booking.note : '',
      },
    });

    return result;
  }

  async list(
    pageNo: number,
    pageSize: number,
    name: string | null,
    meetingRoomName: string | null,
    meetingRoomPostion: string | null,
    bookingTimeRangeStart: number | null,
    bookingTimeRangeEnd: number | null,
  ) {
    const bookings = await this.prismaService.booking.findMany({
      where: {
        user: {
          username: name ? { contains: name } : undefined,
        },
        room: {
          name: meetingRoomName ? { contains: meetingRoomName } : undefined,
          location: meetingRoomPostion
            ? { contains: meetingRoomPostion }
            : undefined,
        },
        start_time: {
          gte: bookingTimeRangeStart
            ? new Date(bookingTimeRangeStart)
            : undefined,
          lte: bookingTimeRangeEnd ? new Date(bookingTimeRangeEnd) : undefined,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            nick_name: true,
            email: true,
            phone_number: true,
            head_pic: true,
          },
        },
      },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = bookings.length;

    return { bookings, totalCount };
  }
}
