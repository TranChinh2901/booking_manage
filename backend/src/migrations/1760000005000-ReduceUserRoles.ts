import { MigrationInterface, QueryRunner } from "typeorm";

export class ReduceUserRoles1760000005000 implements MigrationInterface {
  name = "ReduceUserRoles1760000005000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `users` MODIFY `role` enum ('ADMIN', 'STAFF', 'CUSTOMER', 'USER') NOT NULL DEFAULT 'USER'"
    );
    await queryRunner.query(
      "UPDATE `users` SET `role` = 'USER' WHERE `role` IN ('STAFF', 'CUSTOMER')"
    );
    await queryRunner.query(
      "ALTER TABLE `users` MODIFY `role` enum ('ADMIN', 'USER') NOT NULL DEFAULT 'USER'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `users` MODIFY `role` enum ('ADMIN', 'STAFF', 'CUSTOMER', 'USER') NOT NULL DEFAULT 'CUSTOMER'"
    );
    await queryRunner.query(
      "UPDATE `users` SET `role` = 'CUSTOMER' WHERE `role` = 'USER'"
    );
    await queryRunner.query(
      "ALTER TABLE `users` MODIFY `role` enum ('ADMIN', 'STAFF', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER'"
    );
  }
}
