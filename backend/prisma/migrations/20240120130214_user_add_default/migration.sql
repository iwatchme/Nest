/*
  Warnings:

  - You are about to alter the column `update_time` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `update_time` DATETIME NOT NULL;
