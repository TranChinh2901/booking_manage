import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUsersForAuth1760000000000 implements MigrationInterface {
  name = "AlterUsersForAuth1760000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `users` ADD `password` varchar(255) NOT NULL DEFAULT ''"
    );
    await queryRunner.query(
      "ALTER TABLE `users` ALTER COLUMN `password` DROP DEFAULT"
    );
    await queryRunner.query("ALTER TABLE `users` ADD `phone` varchar(255) NULL");
    await queryRunner.query(
      "ALTER TABLE `users` ADD `avatar` varchar(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE `users` ADD `role` enum ('ADMIN', 'USER') NOT NULL DEFAULT 'USER'"
    );
    await queryRunner.query(
      "ALTER TABLE `users` ADD `status` enum ('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE'"
    );
    await queryRunner.query(
      "ALTER TABLE `users` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)"
    );
    await queryRunner.query(
      "ALTER TABLE `users` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `updatedAt`");
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `createdAt`");
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `status`");
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `role`");
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `avatar`");
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `phone`");
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `password`");
  }
}
