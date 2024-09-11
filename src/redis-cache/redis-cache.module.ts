import { Module } from '@nestjs/common';
import { createClient } from 'redis'
import { RedisCacheService } from './redis-cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisClient } from 'src/constants/redis.constant';

@Module({
  imports: [ConfigModule],
  providers: [RedisCacheService,
    {
      provide: 'REDIS_OPTIONS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`
      }),
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: redisClient,
      useFactory: async (options: { url: string }) => {
        const client = createClient(options);
        await client.connect();

        client.on('error', (err) => {
          console.error('Redis error: ' + err)
        })
        return client;
      }
    }
  ],
  exports: [redisClient, RedisCacheService],
})
export class RedisCacheModule { }
