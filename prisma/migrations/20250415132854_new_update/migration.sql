/*
  Warnings:

  - You are about to drop the column `consultationsId` on the `FollowUps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[consultationId]` on the table `FollowUps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `consultationId` to the `FollowUps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FollowUps" DROP CONSTRAINT "FollowUps_consultationsId_fkey";

-- DropIndex
DROP INDEX "FollowUps_consultationsId_key";

-- AlterTable
ALTER TABLE "FollowUps" DROP COLUMN "consultationsId",
ADD COLUMN     "consultationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FollowUps_consultationId_key" ON "FollowUps"("consultationId");

-- AddForeignKey
ALTER TABLE "FollowUps" ADD CONSTRAINT "FollowUps_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
