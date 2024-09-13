import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { SpesificationModule } from './spesification/spesification.module';
import { InventoryModule } from './inventory/inventory.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { SocketModule } from './socket/socket.module';
import { ChatSessionModule } from './chat-session/chat-session.module';
import * as  path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        logging: true,
        synchronize: false,
        entities: [path.join(__dirname, '/**/*.entity{.js,.ts}')]
      })

    }),
    UserModule,
    AuthModule,
    CategoryModule,
    StoreModule,
    ProductModule,
    SpesificationModule,
    InventoryModule,
    RedisCacheModule,
    SocketModule,
    ChatSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
