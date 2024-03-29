import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';
import { MeetingroomService } from './meetingroom/meetingroom.service';
import { MeetingroomController } from './meetingroom/meetingroom.controller';
import { BookingroomService } from './bookingroom/bookingroom.service';
import { BookingroomController } from './bookingroom/bookingroom.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30min' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    PrismaModule,
    EmailModule,
  ],
  controllers: [AppController, MeetingroomController, BookingroomController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: PermissionGuard,
    },
    MeetingroomService,
    BookingroomService,
  ],
})
export class AppModule {}
