-- CreateTable
CREATE TABLE "Clinics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "consultationFee" DOUBLE PRECISION,
    "followuUpFee" DOUBLE PRECISION,
    "doctorId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Clinics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clinics" ADD CONSTRAINT "Clinics_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinics" ADD CONSTRAINT "Clinics_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
