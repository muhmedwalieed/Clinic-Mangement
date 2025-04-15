-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('pending', 'completed', 'canceled', 'expired');

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "isActive" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Consultations" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clinicId" TEXT NOT NULL,

    CONSTRAINT "Consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followUps" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "consultationsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followUps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "followUps_consultationsId_key" ON "followUps"("consultationsId");

-- AddForeignKey
ALTER TABLE "Consultations" ADD CONSTRAINT "Consultations_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followUps" ADD CONSTRAINT "followUps_consultationsId_fkey" FOREIGN KEY ("consultationsId") REFERENCES "Consultations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
