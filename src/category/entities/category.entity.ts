import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/base.entity";
import slugify from "slugify";
import { ProductEntity } from "src/product/entitites/product.entity";

@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'title', nullable: false })
    title: string

    @ApiProperty()
    @Column({ type: 'integer', name: 'rate', default: 999 })
    rate: number

    @ManyToMany(() => CategoryEntity, category => category.children)
    @JoinTable({
        name: 'category_parent_subs',
        joinColumn: {
            name: 'category_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'parent_id',
            referencedColumnName: 'id'
        }
    })
    parents: CategoryEntity[];

    @ManyToMany(() => CategoryEntity, category => category.parents)
    children: CategoryEntity[];

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