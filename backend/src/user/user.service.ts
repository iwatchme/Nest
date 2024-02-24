import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from '../email/email.service';
import { md5 } from '../util/crypto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './dto/login-user.vo';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetailVo } from './dto/user-info.vo';
import { RegisterUserDto } from './dto/user.dto';

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
    console.log(captcha);
    await this.redisService.set(`captcha_${address}`, captcha, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }

  async getCaptchaForChangePassword(address: string) {
    const captcha = Math.random().toString().slice(2, 8);
    await this.redisService.set(
      `update_password_captcha_${address}`,
      captcha,
      5 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更换密码验证码',
      html: `<p>你的更换密码验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }

  async getCaptchaForChangeUserInfo(address: string) {
    const captcha = Math.random().toString().slice(2, 8);
    await this.redisService.set(
      `update_user_captcha_${address}`,
      captcha,
      5 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的验证码是 ${captcha}</p>`,
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

  async getUserInfoById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.nickName = user.nick_name;
    vo.email = user.email;
    vo.isFrozen = user.is_frozen;
    vo.createTime = user.create_time;
    vo.headPic = user.head_pic ?? '';
    return vo;
  }

  async findUserById(id: number, isAdmin: boolean) {
    console.log(id, isAdmin);
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
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

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    return {
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
        .map((item) => {
          return {
            id: item.perm.id,
            code: item.perm.code,
            desc: item.perm.description,
          };
        }),
    };
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    console.log(loginUserDto);
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

    if (user.password != md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
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
        .map((item) => {
          return {
            id: item.perm.id,
            code: item.perm.code,
            desc: item.perm.description,
          };
        }),
    };
    return vo;
  }

  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    console.log(`${passwordDto.email}`);
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );
    console.log(`captcha: ${captcha}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: passwordDto.username,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.email !== passwordDto.email) {
      throw new HttpException('邮箱不正确', HttpStatus.BAD_REQUEST);
    }

    foundUser.password = md5(passwordDto.password);

    try {
      await this.prismaService.user.update({
        where: {
          username: passwordDto.username,
        },
        data: {
          password: foundUser.password,
        },
      });
      return '密码修改成功';
    } catch (e) {
      return '密码修改失败';
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(
      `update_user_captcha_${updateUserDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.nickName) {
      foundUser.nick_name = updateUserDto.nickName;
    }
    if (updateUserDto.headPic) {
      foundUser.head_pic = updateUserDto.headPic;
    }

    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: foundUser,
      });
      return '用户信息修改成功';
    } catch (e) {
      return '用户信息修改失败';
    }
  }

  async freezeUserById(userId: number) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          is_frozen: true,
        },
      });
      return '用户冻结成功';
    } catch (e) {
      console.log(e);
      return '用户冻结失败';
    }
  }

  async list(page: number, perPage: number) {
    const users = await this.prismaService.user.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      // 添加你的其他查询条件
    });
    const result = users.map((user) => {
      const vo = new UserDetailVo();
      vo.id = user.id;
      vo.username = user.username;
      vo.nickName = user.nick_name;
      vo.email = user.email;
      vo.isFrozen = user.is_frozen;
      vo.createTime = user.create_time;
      return vo;
    });

    const total = await this.prismaService.user.count();

    return { data: result, total: total };
  }

  async findUsers(
    username: string,
    nickName: string,
    email: string,
    page: number,
    perPage: number,
  ) {
    console.log(username, nickName, email, page, perPage);
    const users = await this.prismaService.user.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        username: {
          contains: username,
        },
        nick_name: {
          contains: nickName,
        },
        email: {
          contains: email,
        },
      },
    });

    const result = users.map((user) => {
      const vo = new UserDetailVo();
      vo.id = user.id;
      vo.username = user.username;
      vo.nickName = user.nick_name;
      vo.email = user.email;
      vo.isFrozen = user.is_frozen;
      vo.createTime = user.create_time;
      vo.headPic = user.head_pic ?? '';
      return vo;
    });

    return { data: result, total: users.length };
  }
}
