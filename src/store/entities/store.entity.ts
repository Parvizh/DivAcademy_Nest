import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinTable, ManyToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/base.entity";
import slugify from "slugify";
import { UserEntity } from "src/user/user.entity";

@Entity('stores')
export class StoreEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'title', nullable: false })
    title: string

    @ApiProperty()
    @Column({ type: 'varchar', name: 'slug' })
    slug: string;

    @ApiProperty()
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
    deletedAt: Date

    @ManyToMany(() => UserEntity, user => user.stores, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable({
        name: 'store_users',
        joinColumn: {
            name: 'store_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    public users: UserEntity[];

    @BeforeInsert()
    async generateSlug() {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, trim: true });
        }
    }
}