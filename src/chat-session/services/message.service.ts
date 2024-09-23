import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatSessionEntity } from '../chat-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../message.entity';
import { ChatSessionService } from './chat-session.service';
import { SocketsGateway } from 'src/socket/socket.gateway';
import { MessageUpdateSeenDto } from '../dto/message-seen.dto';
import { CommonQueryDto } from 'src/auth/common/dto/query.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(ChatSessionEntity)
        private readonly sessionRep: Repository<ChatSessionEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRep: Repository<MessageEntity>,
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
                (isSessionExist.userToId == body.userToId && isSessionExist.userFromId == userFromId)
                || (isSessionExist.userToId == userFromId && isSessionExist.userFromId == body.userToId)
            ) {
                await queryRunner.startTransaction()
                const messageT = queryRunner.manager.getRepository(MessageEntity);

                body.userFromId = userFromId;
                body.chatSessionId = sessionId;
                const newMessage = messageT.create(body);
                const result = await messageT.save(newMessage);
                this.sessionService.updateTime(sessionId, queryRunner.manager)

                await queryRunner.commitTransaction();

                await this.socketGateway.handleMessage({ userTo: result.userToId, userFrom: result.userFromId, text: result.text })
                return result
            }
            else return new BadRequestException("This seesion doesn't belong this user")
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error)
        }
    }

    async findAll(sessionId, userId: number, query: CommonQueryDto) {
        const { limit, page, sort, searchText }: CommonQueryDto = query;
        const skip = (Number(page) - 1) * Number(limit)

        const isSession = await this.sessionRep.findOne({ where: { id: sessionId } })

        if (!isSession) return new NotFoundException()


        if ((isSession.userFromId == userId && isSession.userFromIsDelete == true) || (isSession.userToId == userId && isSession.userToIsDelete == true)) {
            return []
        }

        let result = await this.messageRep
            .createQueryBuilder('m')
            // .where('(m.userToId = :userId OR m.userFromId = :userId)', { userId })
            .where('m.chatSessionId = :id', { id: sessionId })
            .select(['m'])
            .take(limit)
            .skip(skip)
            .orderBy('m.createAt', sort)
            .getMany()

        return result;
    }

    async messageSeen(userId: number, sessionId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()

        const isSessionExist = await this.sessionRep.findOne({ where: { id: sessionId } });
        if (!isSessionExist) return new NotFoundException("This session doesn't exist");
        if (
            isSessionExist.userToId == userId || isSessionExist.userFromId == userId
        ) {
            const userToId = isSessionExist.userFromId == userId ? isSessionExist.userToId : isSessionExist.userFromId
            await this.messageRep
                .createQueryBuilder('messages')
                .update(MessageEntity)
                .set({ hasSeen: () => 'CURRENT_TIMESTAMP' })
                .where('messages.chat_session_id = :sessionId AND messages.has_seen IS NULL', { sessionId: sessionId })
                .execute()

            await this.socketGateway.messageSeen({ userToId, sessionId: isSessionExist.id })
        }
        else return new BadRequestException("This session doesn't belong this user")
    }
}
