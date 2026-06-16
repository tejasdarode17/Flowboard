/*
  Warnings:

  - You are about to drop the column `targetId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `targetName` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `targetType` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `actorId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "targetId",
DROP COLUMN "targetName",
DROP COLUMN "targetType";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "actorId",
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT,
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "workspaceId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_memberId_createdAt_idx" ON "Notification"("memberId", "createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
