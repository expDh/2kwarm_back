/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('user', 'admin');

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "steamid64" BIGINT,
    "avatar" VARCHAR(255),
    "profile_url" VARCHAR(255),
    "real_name" VARCHAR(255),
    "balance" INTEGER DEFAULT 0,
    "date_of_birth" INTEGER,
    "last_online" INTEGER,
    "sid" VARCHAR(255),
    "group_id" INTEGER DEFAULT 3,
    "virtual_balance" INTEGER DEFAULT 0,
    "email" VARCHAR(255),
    "discord" VARCHAR(255),
    "vkURL" VARCHAR(255),
    "verified" INTEGER DEFAULT 0,
    "friendTrades" INTEGER DEFAULT 0,
    "expired_group" TIMESTAMP(3),
    "vip_test_used" INTEGER DEFAULT 0,
    "xp" INTEGER DEFAULT 0,
    "trade_offer" TEXT,
    "vk_subscribed" INTEGER DEFAULT 0,
    "socials" INTEGER DEFAULT 0,
    "ip" VARCHAR(50),
    "registered_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "disabled_coin" INTEGER DEFAULT 0,
    "role" "Roles" NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
