import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTravelCatalogTables1760000001000
  implements MigrationInterface
{
  name = "CreateTravelCatalogTables1760000001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `destinations` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` text NULL, `image` varchar(255) NULL, `status` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_destinations_slug` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `categories` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` text NULL, `status` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_categories_slug` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `tours` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `shortDescription` text NULL, `description` text NULL, `destinationId` int NOT NULL, `categoryId` int NOT NULL, `priceAdult` decimal(12,2) NOT NULL, `priceChild` decimal(12,2) NOT NULL DEFAULT '0.00', `durationDays` int NOT NULL DEFAULT '1', `durationNights` int NOT NULL DEFAULT '0', `departureLocation` varchar(255) NULL, `transport` varchar(255) NULL, `maxPeople` int NOT NULL DEFAULT '0', `status` enum ('DRAFT', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'DRAFT', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_tours_slug` (`slug`), INDEX `IDX_tours_destinationId` (`destinationId`), INDEX `IDX_tours_categoryId` (`categoryId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `tour_images` (`id` int NOT NULL AUTO_INCREMENT, `tourId` int NOT NULL, `url` varchar(255) NOT NULL, `isThumbnail` tinyint NOT NULL DEFAULT 0, `sortOrder` int NOT NULL DEFAULT '0', INDEX `IDX_tour_images_tourId` (`tourId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `tours` ADD CONSTRAINT `FK_tours_destination` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `tours` ADD CONSTRAINT `FK_tours_category` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `tour_images` ADD CONSTRAINT `FK_tour_images_tour` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `tour_images` DROP FOREIGN KEY `FK_tour_images_tour`"
    );
    await queryRunner.query(
      "ALTER TABLE `tours` DROP FOREIGN KEY `FK_tours_category`"
    );
    await queryRunner.query(
      "ALTER TABLE `tours` DROP FOREIGN KEY `FK_tours_destination`"
    );
    await queryRunner.query("DROP TABLE `tour_images`");
    await queryRunner.query("DROP TABLE `tours`");
    await queryRunner.query("DROP TABLE `categories`");
    await queryRunner.query("DROP TABLE `destinations`");
  }
}
