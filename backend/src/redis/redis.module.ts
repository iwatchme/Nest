import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisClient = createClient({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
          database: configService.get('REDIS_DB'),
        });
        await redisClient.connect();
        return redisClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
