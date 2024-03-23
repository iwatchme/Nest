/*
  Warnings:

  - You are about to alter the column `update_time` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `update_time` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `MeetingRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `location` VARCHAR(50) NOT NULL,
    `equipment` VARCHAR(50) NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `isBooked` BOOLEAN NOT NULL DEFAULT false,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
