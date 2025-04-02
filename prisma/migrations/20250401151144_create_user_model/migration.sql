-- CreateEnum
CREATE TYPE "USER_ROLES" AS ENUM ('OWNER', 'ADMIN', 'DOCTOR', 'NURSE');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "userRole" "USER_ROLES" NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
