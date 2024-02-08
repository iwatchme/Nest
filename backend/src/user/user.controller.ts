import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserInfo, generateParseIntPipe } from 'src/util/custom.decorator';
import { RequireLogin } from '../util/custom.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/user.dto';
import { UserService } from './user.service';

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
  @RequireLogin()
  async updateUserInfoCaptcha(@UserInfo('email') address: string) {
    console.log(address);
    return this.userService.getCaptchaForChangeUserInfo(address);
  }

  @Post('login')
  async userLogin(@Body() user: LoginUserDto) {
    const vo = await this.userService.login(user, false);
    vo.accessToken = this.jwtService.sign(
      {
        username: vo.userInfo.username,
        email: vo.userInfo.email,
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
        email: vo.userInfo.email,
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
          email: userInfo.email,
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
  async updatePassword(@Body() password: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(password);
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(userId);
    return await this.userService.update(userId, updateUserDto);
  }

  @Get('freeze')
  async freeze(@Query('id', ParseIntPipe) userId: number) {
    console.log(typeof userId);
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    page: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    size: number,
  ) {
    console.log(page, size);
    return this.userService.list(page, size);
  }
}
