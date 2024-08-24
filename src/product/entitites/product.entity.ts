import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/base.entity";
import slugify from "slugify";
import { CategoryEntity } from "src/category/entities/category.entity";
import { SpesificationEntity } from "src/spesification/entities/spesification.entity";
import { InventoryEntity } from "src/inventory/entities/inventory.entity";

@Entity('products')
export class ProductEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', name: 'title', nullable: false })
    title: string

    @ApiProperty()
    @Column({ type: 'varchar', name: 'slug' })
    slug: string;


    @ApiProperty()
    @Column({ type: 'varchar', name: 'description' })
    description: string;

    @ApiProperty()
    @Column({ type: 'varchar', name: 'sizes' })
    size: string;

    @ApiProperty()
    @Column({ type: 'varchar', array: true, name: 'colors' })
    colors: string;

    @ApiProperty()
    @ManyToOne(() => CategoryEntity, x => x.products, { onDelete: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: CategoryEntity

    @ApiProperty()
    @Column({ nullable: false, name: 'category_id' })
    public categoryId: number

    @ApiProperty()
    @ManyToMany(() => SpesificationEntity, x => x.products, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable({
        name: 'product_spesifications',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'spesification_id',
            referencedColumnName: 'id',
        },
    })
    spesifications: SpesificationEntity[]

    @ApiProperty()
    @ManyToMany(() => InventoryEntity, x => x.products, { cascade: true })
    inventories: InventoryEntity[]

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