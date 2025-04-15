/*
  Warnings:

  - You are about to drop the `followUps` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,clinicId]` on the table `Consultations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `Consultations` table without a default value. This is not possible if the table is not empty.
  - Made the column `isActive` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "followUps" DROP CONSTRAINT "followUps_consultationsId_fkey";

-- AlterTable
ALTER TABLE "Consultations" ADD COLUMN     "description" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "isActive" SET NOT NULL;

-- DropTable
DROP TABLE "followUps";

-- CreateTable
CREATE TABLE "FollowUps" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "consultationsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FollowUps_consultationsId_key" ON "FollowUps"("consultationsId");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_phone_key" ON "Patients"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Consultations_id_clinicId_key" ON "Consultations"("id", "clinicId");

-- AddForeignKey
ALTER TABLE "Consultations" ADD CONSTRAINT "Consultations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUps" ADD CONSTRAINT "FollowUps_consultationsId_fkey" FOREIGN KEY ("consultationsId") REFERENCES "Consultations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
