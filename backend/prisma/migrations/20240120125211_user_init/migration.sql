-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `nick_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `head_pic` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `is_frozen` BOOLEAN NOT NULL DEFAULT false,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `description` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoles` (
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermissions` (
    `role_id` INTEGER NOT NULL,
    `perm_id` INTEGER NOT NULL,

    PRIMARY KEY (`role_id`, `perm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_perm_id_fkey` FOREIGN KEY (`perm_id`) REFERENCES `Permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
