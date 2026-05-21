import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentAndTravelerTables1760000006000
  implements MigrationInterface
{
  name = "CreatePaymentAndTravelerTables1760000006000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `payments` (`id` int NOT NULL AUTO_INCREMENT, `paymentCode` varchar(255) NOT NULL, `bookingId` int NOT NULL, `method` enum ('CASH', 'BANK_TRANSFER', 'MOMO', 'VNPAY') NOT NULL, `amount` decimal(12,2) NOT NULL, `transactionRef` varchar(255) NULL, `status` enum ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING', `paidAt` datetime NULL, `note` text NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_payments_paymentCode` (`paymentCode`), INDEX `IDX_payments_bookingId` (`bookingId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `booking_travelers` (`id` int NOT NULL AUTO_INCREMENT, `bookingId` int NOT NULL, `fullName` varchar(255) NOT NULL, `dateOfBirth` date NULL, `gender` enum ('MALE', 'FEMALE', 'OTHER') NULL, `travelerType` enum ('ADULT', 'CHILD') NOT NULL, `identityNumber` varchar(255) NULL, `nationality` varchar(255) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_booking_travelers_bookingId` (`bookingId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `payments` ADD CONSTRAINT `FK_payments_booking` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE"
    );
    await queryRunner.query(
      "ALTER TABLE `booking_travelers` ADD CONSTRAINT `FK_booking_travelers_booking` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `booking_travelers` DROP FOREIGN KEY `FK_booking_travelers_booking`"
    );
    await queryRunner.query(
      "ALTER TABLE `payments` DROP FOREIGN KEY `FK_payments_booking`"
    );
    await queryRunner.query("DROP TABLE `booking_travelers`");
    await queryRunner.query("DROP TABLE `payments`");
  }
}
