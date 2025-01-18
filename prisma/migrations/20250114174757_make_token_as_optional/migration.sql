-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_contact_id_fkey`;

-- DropIndex
DROP INDEX `addresses_contact_id_fkey` ON `addresses`;

-- AlterTable
ALTER TABLE `users` MODIFY `token` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
