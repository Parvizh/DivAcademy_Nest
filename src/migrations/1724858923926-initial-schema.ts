import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1724858923926 implements MigrationInterface {
    name = 'InitialSchema1724858923926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "spesifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "type" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_049f866588b507beb4076111daf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "sizes" character varying NOT NULL, "colors" character varying array NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "rate" integer NOT NULL DEFAULT '999', "slug" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_parent_subs" ("parent_id" integer NOT NULL, "sub_id" integer NOT NULL, CONSTRAINT "PK_1a094c19cda389c31bb30dba530" PRIMARY KEY ("parent_id", "sub_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f619d2b1c8d6bd821e0c1bfb74" ON "category_parent_subs" ("parent_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b47158ce30ed58199ac1e3b292" ON "category_parent_subs" ("sub_id") `);
        await queryRunner.query(`ALTER TABLE "category_parent_subs" ADD CONSTRAINT "FK_f619d2b1c8d6bd821e0c1bfb746" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_parent_subs" ADD CONSTRAINT "FK_b47158ce30ed58199ac1e3b2925" FOREIGN KEY ("sub_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_parent_subs" DROP CONSTRAINT "FK_b47158ce30ed58199ac1e3b2925"`);
        await queryRunner.query(`ALTER TABLE "category_parent_subs" DROP CONSTRAINT "FK_f619d2b1c8d6bd821e0c1bfb746"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b47158ce30ed58199ac1e3b292"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f619d2b1c8d6bd821e0c1bfb74"`);
        await queryRunner.query(`DROP TABLE "category_parent_subs"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "spesifications"`);
    }

}
