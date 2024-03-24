/*
  Warnings:

  - You are about to alter the column `update_time` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `update_time` on the `MeetingRoom` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `update_time` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `update_time` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `MeetingRoom` MODIFY `update_time` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `update_time` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `MeetingRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
