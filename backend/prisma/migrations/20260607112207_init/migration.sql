/*
  Warnings:

  - You are about to drop the `ProjectGitHub` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectGitHub" DROP CONSTRAINT "ProjectGitHub_projectId_fkey";

-- DropTable
DROP TABLE "ProjectGitHub";

-- CreateTable
CREATE TABLE "ProjectGithub" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "webhookId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectGithub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectGithub_projectId_key" ON "ProjectGithub"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectGithub" ADD CONSTRAINT "ProjectGithub_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
