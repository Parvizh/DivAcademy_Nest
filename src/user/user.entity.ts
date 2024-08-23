import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany } from "typeorm";
import * as bcrypt from "bcryptjs"
import { BaseEntity } from "../common/base.entity";
import { RolesEnum } from "../enum/role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { StoreEntity } from "src/store/entities/store.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'name', nullable: false })
    name: string

    @ApiProperty()
    @Column({ type: 'varchar', name: 'surname', nullable: false })
    surname: string

    @ApiProperty()
    @Column({ type: 'varchar', name: 'email', nullable: false })
    email: string

    @ApiProperty()
    @Column({ type: "varchar", name: "role", default: RolesEnum.CUSTOMER })
    role: RolesEnum

    @ApiProperty()
    @Column({ type: 'varchar', name: 'password', nullable: false, select: false })
    password: string

    @ApiProperty()
    @Column({ type: 'integer', name: 'age' })
    age: number

    @ApiProperty()
    @ManyToMany(() => StoreEntity, store => store.users, { cascade: true })
    stores: StoreEntity[]

    @BeforeInsert()
    @BeforeUpdate()
    passwordBcrypt() {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, Number(process.env.PASWORD_SALT))
        }
    }

    get fullName() {
        if (this.name && this.surname) return `${this.name} ${this.surname}`
    }

    toJSON() {
        return {
            ...this,
            fullname: this.fullName
        }
    }
}