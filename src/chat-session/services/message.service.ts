import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatSessionEntity } from '../chat-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../message.entity';
import { ChatSessionService } from './chat-session.service';
import { SocketsGateway } from 'src/socket/socket.gateway';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(ChatSessionEntity)
        private readonly sessionRep: Repository<ChatSessionEntity>,
        @InjectRepository(UserEntity)
        private readonly userRep: Repository<UserEntity>,
        private readonly dataSource: DataSource,
        private readonly sessionService: ChatSessionService,
        private readonly socketGateway: SocketsGateway
    ) { }

    async create(userFromId: number, sessionId: number, body: CreateMessageDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        try {
            const isSessionExist = await this.sessionRep.findOne({ where: { id: sessionId } });
            if (!isSessionExist) return new NotFoundException("This session doesn't exist");

            if (
                (isSessionExist.userToId == body.userToId || isSessionExist.userFromId == userFromId)
                && (isSessionExist.userToId == userFromId || isSessionExist.userFromId == body.userToId)
            ) {
                await queryRunner.startTransaction()
                const messageT = queryRunner.manager.getRepository(MessageEntity);

                body.userFromId = userFromId;
                const newMessage = messageT.create(body);
                const result = await messageT.save(newMessage);
                await this.socketGateway.handleMessage({ userTo: result.userToId, userFrom: result.userFromId, text: result.text })
                this.sessionService.updateTime(sessionId, queryRunner.manager)
            }

        } catch (error) {
            console.log(error)
        }
    }
}
