import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateScheduleAndBookingTables1760000002000
  implements MigrationInterface
{
  name = "CreateScheduleAndBookingTables1760000002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `tour_schedules` (`id` int NOT NULL AUTO_INCREMENT, `tourId` int NOT NULL, `startDate` date NOT NULL, `endDate` date NOT NULL, `availableSeats` int NOT NULL, `bookedSeats` int NOT NULL DEFAULT '0', `priceAdult` decimal(12,2) NOT NULL, `priceChild` decimal(12,2) NOT NULL DEFAULT '0.00', `status` enum ('OPEN', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'OPEN', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX `IDX_tour_schedules_tourId` (`tourId`), INDEX `IDX_tour_schedules_startDate` (`startDate`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `bookings` (`id` int NOT NULL AUTO_INCREMENT, `bookingCode` varchar(255) NOT NULL, `userId` int NOT NULL, `tourScheduleId` int NOT NULL, `adultCount` int NOT NULL, `childCount` int NOT NULL DEFAULT '0', `totalAmount` decimal(12,2) NOT NULL, `contactName` varchar(255) NOT NULL, `contactEmail` varchar(255) NOT NULL, `contactPhone` varchar(255) NOT NULL, `note` text NULL, `status` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING', `paymentStatus` enum ('UNPAID', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'UNPAID', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_bookings_bookingCode` (`bookingCode`), INDEX `IDX_bookings_userId` (`userId`), INDEX `IDX_bookings_tourScheduleId` (`tourScheduleId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `tour_schedules` ADD CONSTRAINT `FK_tour_schedules_tour` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `bookings` ADD CONSTRAINT `FK_bookings_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `bookings` ADD CONSTRAINT `FK_bookings_tour_schedule` FOREIGN KEY (`tourScheduleId`) REFERENCES `tour_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bookings` DROP FOREIGN KEY `FK_bookings_tour_schedule`"
    );
    await queryRunner.query(
      "ALTER TABLE `bookings` DROP FOREIGN KEY `FK_bookings_user`"
    );
    await queryRunner.query(
      "ALTER TABLE `tour_schedules` DROP FOREIGN KEY `FK_tour_schedules_tour`"
    );
    await queryRunner.query("DROP TABLE `bookings`");
    await queryRunner.query("DROP TABLE `tour_schedules`");
  }
}
