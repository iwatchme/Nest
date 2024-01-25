/*
  Warnings:

  - Added the required column `create_time` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_time` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `create_time` DATETIME NOT NULL,
    ADD COLUMN `update_time` DATETIME NOT NULL;
