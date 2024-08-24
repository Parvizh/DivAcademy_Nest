import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/base.entity";
import slugify from "slugify";
import { UserEntity } from "src/user/user.entity";
import { InventoryEntity } from "src/inventory/entities/inventory.entity";
import { CategoryEntity } from "src/category/entities/category.entity";

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

    @ApiProperty()
    @OneToOne(() => InventoryEntity, x => x.store, { onDelete: "CASCADE" })
    @JoinColumn({ name: "inventory_id" })
    inventory: InventoryEntity

    @BeforeInsert()
    async generateSlug() {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, trim: true });
        }
    }
}