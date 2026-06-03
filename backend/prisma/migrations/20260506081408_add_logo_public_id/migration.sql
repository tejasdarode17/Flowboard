/*
  Warnings:

  - Added the required column `emojiId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "emojiId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarId" TEXT;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "logoId" TEXT;
