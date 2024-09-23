import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatSessionEntity } from '../chat-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UserEntity } from 'src/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CommonQueryDto } from 'src/auth/common/dto/query.dto';
import { MessageEntity } from '../message.entity';

@Injectable()
export class ChatSessionService {
    constructor(
        @InjectRepository(ChatSessionEntity)
        private readonly sessionRep: Repository<ChatSessionEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRep: Repository<MessageEntity>,
        @InjectRepository(UserEntity)
        private readonly userRep: Repository<UserEntity>) { }

    async create(userFromId: number, body: CreateSessionDto) {
        try {
            if (userFromId == body.userToId) return new BadRequestException()
            const isUser = await this.userRep.findOne({ where: { id: body.userToId } });
            if (!isUser) throw new NotFoundException("This user doesn't exist")

            body.userFromId = userFromId;

            let result = await this.sessionRep.findOne({
                where: [
                    { userFromId, userToId: body.userToId },
                    { userFromId: body.userToId, userToId: userFromId },
                ]
            })

            if (!result) {

                const session = this.sessionRep.create(body)
                result = await this.sessionRep.save(session)
            }
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async findAll(userId: number, query: CommonQueryDto) {
        const { limit, page, sort, searchText }: CommonQueryDto = query;
        const skip = (Number(page) - 1) * Number(limit)

        let result = await this.sessionRep
            .createQueryBuilder('chat_session')
            .where('((chat_session.userToId = :userId AND chat_session.userToIsDelete=false) OR (chat_session.userFromId = :userId AND chat_session.userFromIsDelete = false))', { userId })
            .leftJoinAndSelect('chat_session.messages', 'messages')
            .leftJoin(
                'chat_session.messages', 'next_messages',
                'messages.updatedAt < next_messages.updatedAt')
            .andWhere('next_messages.id IS NULL')
            .select(['chat_session', 'messages.userFromId', 'messages.userToId', 'messages.hasSeen', 'messages.text'])
            .take(limit)
            .skip(skip)
            .orderBy('chat_session.updatedAt', sort)
            .getMany()

        const notSeenedMessages = await this.messageRep.createQueryBuilder('messages')
            .select('messages.chatSessionId', 'chatSessionId')
            .addSelect('COUNT(DISTINCT messages.id)', 'unReadMessageCount')
            .where('messages.hasSeen IS NULL')
            .andWhere('messages.userToId = :id', { id: userId })
            .groupBy('messages.chatSessionId')
            .getRawMany()
        console.log(result)


        const transformedResult = result.map(session => {
            const unReadMessage = notSeenedMessages.find(message => message.chatSessionId == session.id)
            return {
                id: session.id,
                createdAt: session.createdAt,
                userFromId: session.userFromId,
                userToId: session.userToId,
                unReadMessagecount: unReadMessage?.unReadMessageCount ? parseInt(unReadMessage?.unReadMessageCount, 10) : 0,
                messages: [{
                    userFromId: session.messages[0]?.userFromId,
                    userToId: session.messages[0]?.userToId,
                    text: session.messages[0]?.text,
                    hasSeen: session.messages[0]?.hasSeen,
                }]
            }
        })

        return transformedResult;
    }

    public async deleteSessionByUser(userId: number, sessionId: number) {
        const session = await this.sessionRep.findOne({ where: { id: sessionId } });
        if (!session) return new NotFoundException()
        if (
            session.userToId == userId || session.userFromId == userId
        ) {
            const set = session.userFromId == userId ? { userFromIsDelete: true } : { userToIsDelete: true }
            await this.sessionRep.createQueryBuilder('session')
                .update(ChatSessionEntity)
                .set(set)
                .where({ id: sessionId })
                .execute()
        }

    }


    public async updateTime(id: number, manager: EntityManager) {
        await manager.getRepository(ChatSessionEntity)
            .createQueryBuilder('session')
            .update(ChatSessionEntity)
            .set({ updatedAt: () => 'CURRENT_TIMESTAMP' })
            .where({ id })
            .execute()

    }
}
