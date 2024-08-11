import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1723220583828 implements MigrationInterface {
    name = 'InitialSchema1723220583828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }

}
