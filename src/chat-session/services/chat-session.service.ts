import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatSessionEntity } from '../chat-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UserEntity } from 'src/user/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ChatSessionService {
    constructor(
        @InjectRepository(ChatSessionEntity)
        private readonly sessionRep: Repository<ChatSessionEntity>,
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

    public async updateTime(id: number, manager: EntityManager) {
        await manager.getRepository(ChatSessionEntity)
            .createQueryBuilder('session')
            .update(ChatSessionEntity)
            .set({ updatedAt: () => 'CURRENT_TIMESTAMP' })
            .where({id})
            .execute()

    }
}
