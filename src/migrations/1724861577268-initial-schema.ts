import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1724861577268 implements MigrationInterface {
    name = 'InitialSchema1724861577268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "price" integer NOT NULL, "discount_price" integer NOT NULL, "count" integer NOT NULL, "serialNumber" integer, "store_id" integer NOT NULL, CONSTRAINT "REL_676a2ef2e301391abf39e8700c" UNIQUE ("store_id"), CONSTRAINT "PK_7b1946392ffdcb50cfc6ac78c0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_spesifications" ("category_id" integer NOT NULL, "spesification_id" integer NOT NULL, CONSTRAINT "PK_8fe21d0a3a484e11988a8edf069" PRIMARY KEY ("category_id", "spesification_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5c6a9aba621412fc19c3f4f4d" ON "category_spesifications" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_adecb4e865a49aa1b586fe5394" ON "category_spesifications" ("spesification_id") `);
        await queryRunner.query(`CREATE TABLE "product_spesifications" ("product_id" integer NOT NULL, "spesification_id" integer NOT NULL, CONSTRAINT "PK_efe5159ab388098c419b4230013" PRIMARY KEY ("product_id", "spesification_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_18c2ad0c48a4662abb1928068f" ON "product_spesifications" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e803c2945487a312400aaa7cf0" ON "product_spesifications" ("spesification_id") `);
        await queryRunner.query(`CREATE TABLE "inventory_products" ("inventory_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_cc5f3833ef2fb091301bec26c45" PRIMARY KEY ("inventory_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2551671f881ce98a0d44a14f26" ON "inventory_products" ("inventory_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_11f15fa2ab6edb54caa785dc18" ON "inventory_products" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "store_users" ("store_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_665168b23451669e6807610a0fa" PRIMARY KEY ("store_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3077a42ec6ad94cfb93f919359" ON "store_users" ("store_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d741d647a3ef6419a31592f8ad" ON "store_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "products" ADD "category_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "inventory_id" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_fc81ab32011719769ff0d6cfdc3" UNIQUE ("inventory_id")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventories" ADD CONSTRAINT "FK_676a2ef2e301391abf39e8700c7" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_fc81ab32011719769ff0d6cfdc3" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_spesifications" ADD CONSTRAINT "FK_f5c6a9aba621412fc19c3f4f4d4" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_spesifications" ADD CONSTRAINT "FK_adecb4e865a49aa1b586fe53940" FOREIGN KEY ("spesification_id") REFERENCES "spesifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_spesifications" ADD CONSTRAINT "FK_18c2ad0c48a4662abb1928068fc" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_spesifications" ADD CONSTRAINT "FK_e803c2945487a312400aaa7cf00" FOREIGN KEY ("spesification_id") REFERENCES "spesifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_products" ADD CONSTRAINT "FK_2551671f881ce98a0d44a14f268" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inventory_products" ADD CONSTRAINT "FK_11f15fa2ab6edb54caa785dc189" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_users" ADD CONSTRAINT "FK_3077a42ec6ad94cfb93f919359d" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "store_users" ADD CONSTRAINT "FK_d741d647a3ef6419a31592f8ad6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_users" DROP CONSTRAINT "FK_d741d647a3ef6419a31592f8ad6"`);
        await queryRunner.query(`ALTER TABLE "store_users" DROP CONSTRAINT "FK_3077a42ec6ad94cfb93f919359d"`);
        await queryRunner.query(`ALTER TABLE "inventory_products" DROP CONSTRAINT "FK_11f15fa2ab6edb54caa785dc189"`);
        await queryRunner.query(`ALTER TABLE "inventory_products" DROP CONSTRAINT "FK_2551671f881ce98a0d44a14f268"`);
        await queryRunner.query(`ALTER TABLE "product_spesifications" DROP CONSTRAINT "FK_e803c2945487a312400aaa7cf00"`);
        await queryRunner.query(`ALTER TABLE "product_spesifications" DROP CONSTRAINT "FK_18c2ad0c48a4662abb1928068fc"`);
        await queryRunner.query(`ALTER TABLE "category_spesifications" DROP CONSTRAINT "FK_adecb4e865a49aa1b586fe53940"`);
        await queryRunner.query(`ALTER TABLE "category_spesifications" DROP CONSTRAINT "FK_f5c6a9aba621412fc19c3f4f4d4"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_fc81ab32011719769ff0d6cfdc3"`);
        await queryRunner.query(`ALTER TABLE "inventories" DROP CONSTRAINT "FK_676a2ef2e301391abf39e8700c7"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_fc81ab32011719769ff0d6cfdc3"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "inventory_id"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d741d647a3ef6419a31592f8ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3077a42ec6ad94cfb93f919359"`);
        await queryRunner.query(`DROP TABLE "store_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11f15fa2ab6edb54caa785dc18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2551671f881ce98a0d44a14f26"`);
        await queryRunner.query(`DROP TABLE "inventory_products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e803c2945487a312400aaa7cf0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18c2ad0c48a4662abb1928068f"`);
        await queryRunner.query(`DROP TABLE "product_spesifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_adecb4e865a49aa1b586fe5394"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5c6a9aba621412fc19c3f4f4d"`);
        await queryRunner.query(`DROP TABLE "category_spesifications"`);
        await queryRunner.query(`DROP TABLE "inventories"`);
    }

}
