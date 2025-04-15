/*
  Warnings:

  - Made the column `adminId` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_adminId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "adminId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
