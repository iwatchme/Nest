import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  INestApplication,
} from '@nestjs/common';
import { Roles, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from '../util/crypto';
import { RegisterUserDto } from './dto/user.dto';
import { EmailService } from '../email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './dto/login-user.vo';
import { userInfo } from 'os';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  private async findUserByName(user: RegisterUserDto): Promise<User | null> {
    const ret: User | null = await this.prismaService.user.findUnique({
      where: {
        username: user.username,
      },
    });
    return ret;
  }

  async getCaptcha(address: string) {
    const captcha = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, captcha, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }

  async register(registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
    const captcha = await this.redisService.get(
      `captcha_${registerUserDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== registerUserDto.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const user = this.findUserByName(registerUserDto);

    if (await user) {
      throw new HttpException('用户已经存在', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.user.create({
      data: {
        username: registerUserDto.username,
        password: md5(registerUserDto.password),
        email: registerUserDto.email,
        nick_name: registerUserDto.nickName,
      } as User,
    });

    return 'success';
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginUserDto.username,
        is_admin: isAdmin,
      },
      include: {
        UserRoles: {
          include: {
            role: {
              include: {
                RolePermissions: {
                  include: {
                    perm: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(user);

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nick_name,
      email: user.email,
      headPic: user.head_pic,
      phoneNumber: user.phone_number,
      isFrozen: user.is_frozen,
      isAdmin: user.is_admin,
      createTime: user.create_time.getTime(),
      roles: user.UserRoles.map((item) => item.role.role_name),
      permissions: user.UserRoles.map((item) => item.role.RolePermissions)
        .flat()
        .map((item) => item.perm.code),
    };
    return vo;
  }
}
