import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewAndFavoriteTables1760000003000
  implements MigrationInterface
{
  name = "CreateReviewAndFavoriteTables1760000003000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `reviews` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `tourId` int NOT NULL, `rating` int NOT NULL, `comment` text NULL, `status` enum ('VISIBLE', 'HIDDEN') NOT NULL DEFAULT 'VISIBLE', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_reviews_user_tour` (`userId`, `tourId`), INDEX `IDX_reviews_tourId` (`tourId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `favorites` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `tourId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_favorites_user_tour` (`userId`, `tourId`), INDEX `IDX_favorites_tourId` (`tourId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `reviews` ADD CONSTRAINT `FK_reviews_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `reviews` ADD CONSTRAINT `FK_reviews_tour` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `favorites` ADD CONSTRAINT `FK_favorites_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `favorites` ADD CONSTRAINT `FK_favorites_tour` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `favorites` DROP FOREIGN KEY `FK_favorites_tour`"
    );
    await queryRunner.query(
      "ALTER TABLE `favorites` DROP FOREIGN KEY `FK_favorites_user`"
    );
    await queryRunner.query(
      "ALTER TABLE `reviews` DROP FOREIGN KEY `FK_reviews_tour`"
    );
    await queryRunner.query(
      "ALTER TABLE `reviews` DROP FOREIGN KEY `FK_reviews_user`"
    );
    await queryRunner.query("DROP TABLE `favorites`");
    await queryRunner.query("DROP TABLE `reviews`");
  }
}
