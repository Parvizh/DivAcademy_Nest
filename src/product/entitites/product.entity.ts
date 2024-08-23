import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/base.entity";
import slugify from "slugify";
import { CategoryEntity } from "src/category/entities/category.entity";

@Entity('products')
export class ProductEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'title', nullable: false })
    title: string

    @ApiProperty()
    @Column({ type: 'varchar', name: 'slug' })
    slug: string;

    @ApiProperty()
    @Column({ type: 'integer', name: 'price' })
    price: number;

    @ApiProperty()
    @Column({ type: 'integer', name: 'discount_price' })
    discountPrice: number;

    @ApiProperty()
    @Column({ type: 'varchar', name: 'description' })
    description: string;

    @ApiProperty()
    @Column({ type: 'varchar', array: true, name: 'sizes' })
    sizes: string[];

    @ApiProperty()
    @Column({ type: 'varchar', array: true, name: 'colors' })
    colors: string[];

    @ApiProperty()
    @ManyToOne(() => CategoryEntity, x => x.products, { onDelete: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: CategoryEntity

    @Column({ nullable: false, name: 'category_id' })
    public categoryId: number

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