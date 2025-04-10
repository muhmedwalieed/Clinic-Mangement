/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,id]` on the table `Clinics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clinics_doctorId_id_key" ON "Clinics"("doctorId", "id");
