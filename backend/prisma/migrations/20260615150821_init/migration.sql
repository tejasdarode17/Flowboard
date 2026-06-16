/*
  Warnings:

  - Changed the type of `action` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('WORKSPACE_CREATED', 'WORKSPACE_UPDATED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_DELETED', 'ISSUE_CREATED', 'ISSUE_UPDATED', 'ISSUE_DELETED', 'ISSUE_STATUS_CHANGED', 'ISSUE_ASSIGNED', 'ISSUE_PRIORITY_CHANGED', 'ISSUE_COMPLETED', 'ISSUE_REOPENED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'MEMBER_ROLE_CHANGED', 'PUSH', 'PR_OPENED', 'PR_MERGED', 'PR_CLOSED', 'PR_REOPENED', 'COMMENT_ADDED');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "action",
ADD COLUMN     "action" "ActivityAction" NOT NULL;
