/*
  Warnings:

  - You are about to alter the column `update_time` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `head_pic` VARCHAR(100) NULL,
    MODIFY `phone_number` VARCHAR(20) NULL,
    MODIFY `update_time` DATETIME NOT NULL;
