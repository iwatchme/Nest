import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UserInfo } from 'src/util/custom.decorator';
import { RequireLogin } from '../util/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Get('register-captcha')
  async getCaptcha(@Query('address') address: string) {
    return this.userService.getCaptcha(address);
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    return this.userService.getCaptchaForChangePassword(address);
  }

  @Get('update/captcha')
  async updateUserInfoCaptcha(@Query('address') address: string) {
    return this.userService.getCaptchaForChangeUserInfo(address);
  }

  @Post('login')
  async userLogin(@Body() user: LoginUserDto) {
    const vo = await this.userService.login(user, false);
    vo.accessToken = this.jwtService.sign(
      {
        username: vo.userInfo.username,
        id: vo.userInfo.id,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRE') ?? '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        id: vo.userInfo.id,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRE') ?? '30m',
      },
    );
    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() user: LoginUserDto) {
    const vo = await this.userService.login(user, true);
    vo.accessToken = this.jwtService.sign(
      {
        username: vo.userInfo.username,
        id: vo.userInfo.id,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRE') ?? '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        id: vo.userInfo.id,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRE') ?? '30m',
      },
    );
    return vo;
  }

  @Get('refresh')
  async refreshToken(
    @Query('refreshToken') refreshToken: string,
    @Query('isAdmin') isAdmin: string,
  ) {
    try {
      const data = await this.jwtService.verify(refreshToken);
      const userInfo = await this.userService.findUserById(
        data.id,
        isAdmin === 'true',
      );
      const accessToken = this.jwtService.sign(
        {
          username: userInfo.username,
          id: userInfo.id,
          roles: userInfo.roles,
          permissions: userInfo.permissions,
        },
        {
          expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRE') ?? '30m',
        },
      );

      refreshToken = this.jwtService.sign(
        {
          id: userInfo.id,
        },
        {
          expiresIn:
            this.configService.get('JWT_REFRESH_TOKEN_EXPIRE') ?? '30m',
        },
      );
      return { accessToken, refreshToken };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 已经失效请重新登录');
    }
  }

  @Get('info')
  @RequireLogin()
  async getInfo(@UserInfo('id') userId: number) {
    return this.userService.getUserInfoById(userId);
  }

  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('id') userId: number,
    @Body() password: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, password);
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }
}
