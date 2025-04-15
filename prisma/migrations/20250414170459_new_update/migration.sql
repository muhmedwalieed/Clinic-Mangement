/*
  Warnings:

  - The values [canceled] on the enum `STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_new" AS ENUM ('pending', 'completed', 'cancelled', 'expired');
ALTER TABLE "Consultations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "FollowUps" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Consultations" ALTER COLUMN "status" TYPE "STATUS_new" USING ("status"::text::"STATUS_new");
ALTER TABLE "FollowUps" ALTER COLUMN "status" TYPE "STATUS_new" USING ("status"::text::"STATUS_new");
ALTER TYPE "STATUS" RENAME TO "STATUS_old";
ALTER TYPE "STATUS_new" RENAME TO "STATUS";
DROP TYPE "STATUS_old";
ALTER TABLE "Consultations" ALTER COLUMN "status" SET DEFAULT 'pending';
ALTER TABLE "FollowUps" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
