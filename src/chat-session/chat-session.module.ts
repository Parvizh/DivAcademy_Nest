import { Module } from '@nestjs/common';
import { ChatSessionController } from './controllers/chat-session.controller';
import { ChatSessionService } from './services/chat-session.service';
import { SocketModule } from '../socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionEntity } from './chat-session.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity, MessageEntity,UserEntity]),
    SocketModule,
    JwtModule
  ],
  controllers: [ChatSessionController],
  providers: [ChatSessionService]
})
export class ChatSessionModule { }
