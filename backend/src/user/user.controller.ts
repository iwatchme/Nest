import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RegisterUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Get('register-captcha')
  async getCaptcha(@Query('address') address: string) {
    return this.userService.getCaptcha(address);
  }

  @Post('login')
  async userLogin(@Body() user: LoginUserDto) {
    return this.userService.login(user, false);
  }

  @Post('admin/login')
  async adminLogin(@Body() user: LoginUserDto) {
    console.log(user);
    return 'adminLogin';
  }
}
