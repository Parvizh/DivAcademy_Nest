import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1723217780408 implements MigrationInterface {
    name = 'InitialSchema1723217780408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" (
            "id" SERIAL NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "name" character varying NOT NULL, 
            "surname" character varying NOT NULL,
            "role" character varying NOT NULL DEFAULT 'customer',
            "password" character varying NOT NULL, 
            "age" integer NOT NULL, 
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
