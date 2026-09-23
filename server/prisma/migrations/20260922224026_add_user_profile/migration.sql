/*
  Warnings:

  - You are about to drop the column `address` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `profiles` table. All the data in the column will be lost.
  - The `gender` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `contactEmail` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `dateOfBirth` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY', 'OTHER');

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "address",
DROP COLUMN "age",
DROP COLUMN "name",
DROP COLUMN "profileImage",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "avatarMimeType" TEXT,
ADD COLUMN     "avatarPath" TEXT,
ADD COLUMN     "avatarUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "genderCustom" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'PREFER_NOT_TO_SAY';
