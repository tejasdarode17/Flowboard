/*
  Warnings:

  - The values [WORKSPACE_CREATED,MEMBER_ADDED] on the enum `ActivityAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [RELEASE_CREATED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityAction_new" AS ENUM ('WORKSPACE_UPDATED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_DELETED', 'ISSUE_CREATED', 'ISSUE_UPDATED', 'ISSUE_DELETED', 'ISSUE_STATUS_CHANGED', 'ISSUE_PRIORITY_CHANGED', 'ISSUE_ASSIGNED', 'ISSUE_COMPLETED', 'ISSUE_REOPENED', 'MEMBER_JOINED', 'MEMBER_REMOVED', 'MEMBER_ROLE_CHANGED', 'PUSH', 'PR_OPENED', 'PR_MERGED', 'PR_CLOSED', 'PR_REOPENED', 'COMMENT_ADDED');
ALTER TABLE "Activity" ALTER COLUMN "action" TYPE "ActivityAction_new" USING ("action"::text::"ActivityAction_new");
ALTER TYPE "ActivityAction" RENAME TO "ActivityAction_old";
ALTER TYPE "ActivityAction_new" RENAME TO "ActivityAction";
DROP TYPE "ActivityAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('ISSUE_ASSIGNED', 'ISSUE_UPDATED', 'ISSUE_COMMENTED', 'ISSUE_CREATED', 'PR_OPENED', 'PR_MERGED', 'MEMBER_INVITED', 'MEMBER_JOINED', 'MEMBER_REMOVED', 'MEMBER_ROLE_CHANGED');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
