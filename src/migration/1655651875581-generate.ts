import {MigrationInterface, QueryRunner} from "typeorm";

export class generate1655651875581 implements MigrationInterface {
    name = 'generate1655651875581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "saving-balances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "availableAmount" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f3ff3c5dc476a7dba358b8bf10e" UNIQUE ("userId"), CONSTRAINT "PK_86b71cb046d0a7a4fe978ac0493" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a94e9ac501dfdaf101869750e6" ON "saving-balances" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "deposits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision NOT NULL, "availableAmountBefore" double precision NOT NULL, "availableAmountAfter" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "savingBalanceId" uuid, CONSTRAINT "PK_f49ba0cd446eaf7abb4953385d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saving-interests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "interestRate" double precision NOT NULL, "period" character varying NOT NULL, "amount" double precision NOT NULL, "availableAmountBefore" double precision NOT NULL, "availableAmountAfter" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "savingBalanceId" uuid, CONSTRAINT "PK_49df8690190ba5c63300808b7e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_12130d2bfd951866ac55e58257" ON "saving-interests" ("savingBalanceId", "period") `);
        await queryRunner.query(`CREATE TABLE "withdraws" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision NOT NULL, "availableAmountBefore" double precision NOT NULL, "availableAmountAfter" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "savingBalanceId" uuid, CONSTRAINT "PK_f4fdb46314be0e41de7da92f63c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deposits" ADD CONSTRAINT "FK_85cdee108cc9a3c42038ee7ffbe" FOREIGN KEY ("savingBalanceId") REFERENCES "saving-balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saving-interests" ADD CONSTRAINT "FK_559fc3cc86291f68231a40090f9" FOREIGN KEY ("savingBalanceId") REFERENCES "saving-balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdraws" ADD CONSTRAINT "FK_0b22bb5fdfc4be34241f7675d3b" FOREIGN KEY ("savingBalanceId") REFERENCES "saving-balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraws" DROP CONSTRAINT "FK_0b22bb5fdfc4be34241f7675d3b"`);
        await queryRunner.query(`ALTER TABLE "saving-interests" DROP CONSTRAINT "FK_559fc3cc86291f68231a40090f9"`);
        await queryRunner.query(`ALTER TABLE "deposits" DROP CONSTRAINT "FK_85cdee108cc9a3c42038ee7ffbe"`);
        await queryRunner.query(`DROP TABLE "withdraws"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12130d2bfd951866ac55e58257"`);
        await queryRunner.query(`DROP TABLE "saving-interests"`);
        await queryRunner.query(`DROP TABLE "deposits"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a94e9ac501dfdaf101869750e6"`);
        await queryRunner.query(`DROP TABLE "saving-balances"`);
    }

}
