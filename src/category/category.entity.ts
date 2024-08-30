import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../common/base.entity";
import slugify from "slugify";
import { ProductEntity } from "../product/product.entity";
import { SpesificationEntity } from "../spesification/spesification.entity";

@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'title', nullable: false })
    title: string

    @ApiProperty()
    @Column({ type: 'integer', name: 'rate', default: 999 })
    rate: number

    @ApiProperty()
    @ManyToMany(() => CategoryEntity, category => category.children)
    @JoinTable({
        name: 'category_parent_subs',
        joinColumn: {
            name: 'parent_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'sub_id',
            referencedColumnName: 'id'
        }
    })
    parents: CategoryEntity[];

    @ApiProperty()
    @ManyToMany(() => CategoryEntity, category => category.parents)
    children: CategoryEntity[];

    @ApiProperty()
    @ManyToMany(() => SpesificationEntity, x => x.categories, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable({
        name: 'category_spesifications',
        joinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'spesification_id',
            referencedColumnName: 'id',
        },
    })
    spesifications: SpesificationEntity[]

    @ApiProperty()
    @Column({ type: 'varchar', name: 'slug' })
    slug: string;

    @ApiProperty()
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
    deletedAt: Date

    @ApiProperty()
    @OneToMany(() => ProductEntity, x => x.category, { cascade: true })
    products: ProductEntity[]

    @BeforeInsert()
    async generateSlug() {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, trim: true });
        }
    }
}