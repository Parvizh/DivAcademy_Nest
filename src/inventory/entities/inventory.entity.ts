import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../../common/base.entity";
import { Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { StoreEntity } from "src/store/entities/store.entity";
import { ProductEntity } from "src/product/entitites/product.entity";

export class InventoryEntity extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'integer', name: 'price' })
    price: number;

    @ApiProperty()
    @Column({ type: 'integer', name: 'discount_price' })
    discountPrice: number;

    @ApiProperty()
    @Column({ type: 'integer', name: 'count' })
    count: number;

    @ApiProperty()
    @Column({ type: 'integer', name: 'serialNumber', nullable: true })
    serialNumber: number;

    @ApiProperty()
    @OneToOne(() => StoreEntity, x => x.inventory, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store: StoreEntity

    @ApiProperty()
    @Column({ nullable: false, name: 'store_id' })
    storeId: number


    @ApiProperty()
    @ManyToMany(() => ProductEntity, x => x.inventories, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable({
        name: 'inventory_products',
        joinColumn: {
            name: 'inventory_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
    })
    products: ProductEntity[]

}
