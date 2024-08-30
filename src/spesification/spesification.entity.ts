import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../common/base.entity";
import slugify from "slugify";
import { CategoryEntity } from "../category/category.entity";
import { SPESIFICATION_ENUM } from "../auth/common/enums/spesification-type.enum";
import { ProductEntity } from "../product/product.entity";

@Entity('spesifications')
export class SpesificationEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'title', nullable: false })
    title: string

    @ApiProperty()
    @Column({ type: 'varchar', name: 'slug' })
    slug: string;

    @ApiProperty()
    @Column({ type: 'varchar', name: 'type' })
    type: SPESIFICATION_ENUM;

    @ApiProperty()
    @ManyToMany(() => CategoryEntity, category => category.spesifications)
    categories: CategoryEntity[]

    @ApiProperty()
    @ManyToMany(() => ProductEntity, product => product.spesifications)
    products: ProductEntity[]

    @ApiProperty()
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
    deletedAt: Date

    @BeforeInsert()
    async generateSlug() {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, trim: true });
        }
    }
}