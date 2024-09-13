import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1726243317720 implements MigrationInterface {
    name = 'InitialSchema1726243317720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_sessions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_from_id" integer NOT NULL, "user_to_id" integer NOT NULL, CONSTRAINT "PK_efc151a4aafa9a28b73dedc485f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_from_id" integer NOT NULL, "user_to_id" integer NOT NULL, "text" character varying NOT NULL, "has_seen" TIMESTAMP, "chat_session_id" integer NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" ADD CONSTRAINT "FK_6f36d6c83c7672da4ca12bbad1c" FOREIGN KEY ("user_from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" ADD CONSTRAINT "FK_4ad00b1affa2667b1c04b83ce13" FOREIGN KEY ("user_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_045f2f0964a4b9c4c123e50b71d" FOREIGN KEY ("user_from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ab7da101d3fa599463fc739d14a" FOREIGN KEY ("user_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_33369bc7d291ae4605005c14da1" FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_33369bc7d291ae4605005c14da1"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ab7da101d3fa599463fc739d14a"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_045f2f0964a4b9c4c123e50b71d"`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" DROP CONSTRAINT "FK_4ad00b1affa2667b1c04b83ce13"`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" DROP CONSTRAINT "FK_6f36d6c83c7672da4ca12bbad1c"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "chat_sessions"`);
    }

}
