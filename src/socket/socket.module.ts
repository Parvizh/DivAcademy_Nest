import { Module } from '@nestjs/common';
import { SocketsGateway } from './socket.gateway';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [RedisCacheModule,JwtModule,ConfigModule],
    providers: [SocketsGateway],
    exports: [SocketsGateway]

})
export class SocketModule { }
