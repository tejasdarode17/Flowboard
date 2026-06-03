/*
  Warnings:

  - Added the required column `createdBy` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "createdBy" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'TODO',
ALTER COLUMN "priority" SET DEFAULT 'Medium';

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
