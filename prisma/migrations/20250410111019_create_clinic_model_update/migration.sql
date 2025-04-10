/*
  Warnings:

  - You are about to drop the column `followuUpFee` on the `Clinics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clinics" DROP COLUMN "followuUpFee",
ADD COLUMN     "followUpFee" DOUBLE PRECISION;
