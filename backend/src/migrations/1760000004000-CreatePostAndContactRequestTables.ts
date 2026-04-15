import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostAndContactRequestTables1760000004000
  implements MigrationInterface
{
  name = "CreatePostAndContactRequestTables1760000004000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `excerpt` text NULL, `content` longtext NOT NULL, `thumbnail` varchar(255) NULL, `status` enum ('DRAFT', 'PUBLISHED', 'HIDDEN') NOT NULL DEFAULT 'DRAFT', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_posts_slug` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `contact_requests` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `phone` varchar(255) NULL, `subject` varchar(255) NOT NULL, `message` text NOT NULL, `status` enum ('NEW', 'PROCESSING', 'DONE') NOT NULL DEFAULT 'NEW', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `contact_requests`");
    await queryRunner.query("DROP TABLE `posts`");
  }
}
