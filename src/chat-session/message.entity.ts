import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../common/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { ChatSessionEntity } from "./chat-session.entity";
import { UserEntity } from "../user/user.entity";


@Entity('messages')
export class MessageEntity extends BaseEntity {

    @ManyToOne(() => UserEntity, user => user.userFromMessages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_from_id' })
    public userFrom: UserEntity;

    @ApiProperty()
    @Column({ type: 'integer', name: 'user_from_id' })
    userFromId: number;

    @ManyToOne(() => UserEntity, user => user.userToMessages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_to_id' })
    public userTo: UserEntity;

    @ApiProperty()
    @Column({ type: 'integer', name: 'user_to_id' })
    userToId: number;

    @ApiProperty()
    @Column({ type: 'varchar', name: 'text' })
    text: string;

    @ApiProperty()
    @Column({ type: 'timestamp', name: 'has_seen', default: null })
    hasSeen: Date;

    @ManyToOne(() => ChatSessionEntity, session => session.messages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'chat_session_id' })
    public chatSession: ChatSessionEntity;

    @Column('integer', { nullable: false, name: 'chat_session_id' })
    public chatSessionId: number;
}
