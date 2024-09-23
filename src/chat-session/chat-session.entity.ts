import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../common/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MessageEntity } from "./message.entity";
import { UserEntity } from "../user/user.entity";


@Entity('chat_sessions')
export class ChatSessionEntity extends BaseEntity {

    @ManyToOne(() => UserEntity, user => user.userFromSessions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_from_id' })
    public userFrom: UserEntity;

    @ApiProperty()
    @Column({ type: 'integer', name: 'user_from_id' })
    userFromId: number;

    @ManyToOne(() => UserEntity, user => user.userToSessions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_to_id' })
    public userTo: UserEntity;

    @ApiProperty()
    @Column({ type: 'integer', name: 'user_to_id' })
    userToId: number;

    @OneToMany(() => MessageEntity, message => message.chatSession, { cascade: true })
    messages: MessageEntity[];

    @ApiProperty()
    @Column({ type: 'boolean', name: 'user_to_is_delete',default:false })
    userToIsDelete: boolean;

    @ApiProperty()
    @Column({ type: 'boolean', name: 'user_from_is_delete', default: false })
    userFromIsDelete: boolean;
}
