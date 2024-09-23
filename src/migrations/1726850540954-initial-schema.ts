import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1726850540954 implements MigrationInterface {
    name = 'InitialSchema1726850540954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_sessions" ADD "user_to_is_delete" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" ADD "user_from_is_delete" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_sessions" DROP COLUMN "user_from_is_delete"`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" DROP COLUMN "user_to_is_delete"`);
    }

}
